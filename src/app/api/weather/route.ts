import { NextResponse } from "next/server";
import type { ExternalContext } from "@/lib/types";

export const dynamic = "force-dynamic";

const MOCK_CONTEXT: ExternalContext = {
  source: "mock",
  location: "Bangkok",
  aqi: 145,
  pm25: 52,
  temperature: 34,
  heatIndex: 41,
  humidity: 78,
  condition: "hazy",
  providers: {
    openaq: false,
    tmd: false
  },
  notes: ["Using mock Bangkok context because one or more API keys/endpoints are missing."]
};

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

export async function GET() {
  const openAqKey = process.env.OPENAQ_API_KEY;
  const openAqBaseUrl = process.env.OPENAQ_BASE_URL ?? "https://api.openaq.org/v3";
  const openAqLocationId = process.env.OPENAQ_LOCATION_ID ?? "418";
  const tmdKey = process.env.TMD_API_KEY ?? process.env.TMD_WEATHER_API_KEY;
  const tmdUrl = process.env.TMD_WEATHER_URL ?? "https://data.tmd.go.th/api/WeatherToday/V1/?uid=api&format=json";
  const tmdUid = process.env.TMD_UID ?? "api";

  const notes: string[] = [];
  let openAqContext: Partial<ExternalContext> | null = null;
  let tmdContext: Partial<ExternalContext> | null = null;

  if (openAqKey) {
    try {
      const openAqResponse = await fetchWithTimeout(`${openAqBaseUrl.replace(/\/$/, "")}/locations/${openAqLocationId}`, {
        headers: { "X-API-Key": openAqKey },
        next: { revalidate: 900 }
      }, 4500);

      if (openAqResponse.ok) {
        const openAqPayload = await openAqResponse.json();
        openAqContext = normalizeOpenAq(openAqPayload);
        if (!openAqContext) {
          const sensorId = findPm25SensorId(openAqPayload);
          if (sensorId) {
            const sensorResponse = await fetchWithTimeout(`${openAqBaseUrl.replace(/\/$/, "")}/sensors/${sensorId}`, {
              headers: { "X-API-Key": openAqKey },
              next: { revalidate: 900 }
            }, 4500);
            if (sensorResponse.ok) {
              openAqContext = normalizeOpenAqSensor(await sensorResponse.json(), openAqPayload);
            }
          }
        }
        if (!openAqContext) {
          notes.push("OpenAQ response had no usable Thailand PM2.5/AQI data.");
        }
      } else {
        notes.push(`OpenAQ responded ${openAqResponse.status}`);
      }
    } catch {
      notes.push("OpenAQ request failed");
    }
  } else {
    notes.push("OPENAQ_API_KEY is missing");
  }

  if (tmdKey) {
    try {
      const weatherUrl = buildTmdUrl(tmdUrl, tmdKey, tmdUid);
      const tmdResponse = await fetchWithTimeout(weatherUrl, {
        headers: { Accept: "application/json" },
        next: { revalidate: 900 }
      }, 4500);

      if (tmdResponse.ok) {
        tmdContext = normalizeTmd(await tmdResponse.json());
      } else {
        notes.push(`TMD responded ${tmdResponse.status}`);
      }
    } catch {
      notes.push("TMD request failed");
    }
  } else {
    notes.push("TMD_API_KEY is missing");
  }

  const liveEnough = Boolean(openAqContext || tmdContext);
  const context: ExternalContext = {
    ...MOCK_CONTEXT,
    ...openAqContext,
    ...tmdContext,
    source: openAqContext && tmdContext ? "live" : liveEnough ? "partial" : "mock",
    providers: {
      openaq: Boolean(openAqContext),
      tmd: Boolean(tmdContext)
    },
    notes,
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json({ success: true, data: context });
}

async function fetchWithTimeout(input: string, init: NextFetchInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

function buildTmdUrl(baseUrl: string, key: string, uid: string) {
  if (baseUrl.includes("{key}")) return baseUrl.replace("{key}", encodeURIComponent(key));
  const url = new URL(baseUrl);
  if (!url.searchParams.has("uid")) url.searchParams.set("uid", uid);
  if (!url.searchParams.has("ukey")) url.searchParams.set("ukey", key);
  if (!url.searchParams.has("format")) url.searchParams.set("format", "json");
  return url.toString();
}

function normalizeOpenAq(payload: unknown): Partial<ExternalContext> | null {
  const root = payload as Record<string, unknown>;
  const result = Array.isArray(root.results) ? root.results[0] as Record<string, unknown> : root;
  const location = pickString(result, ["name", "locality", "city"]) ?? "Bangkok";
  const countryText = JSON.stringify(result.country ?? "").toLowerCase();
  const isThailandContext =
    countryText.includes('"th"') ||
    countryText.includes("thailand") ||
    /bangkok|กรุงเทพ|thailand|thai/i.test(location);
  const latest = findOpenAqMeasurement(result);
  const pm25 = latest?.value;
  const aqi = typeof pm25 === "number" ? pm25ToUsAqi(pm25) : undefined;

  if (!isThailandContext || typeof aqi !== "number") {
    return null;
  }

  return {
    location: /bangkok|กรุงเทพ/i.test(location) ? "Bangkok" : location,
    ...(typeof pm25 === "number" ? { pm25 } : {}),
    ...(typeof aqi === "number" ? { aqi } : {}),
    condition: typeof aqi === "number" && aqi >= 100 ? "hazy" : "clear"
  };
}

function normalizeOpenAqSensor(sensorPayload: unknown, locationPayload: unknown): Partial<ExternalContext> | null {
  const measurement = findOpenAqMeasurement(sensorPayload);
  if (!measurement) return null;
  const latestDate = findOpenAqDateTime(sensorPayload);
  if (latestDate && Date.now() - latestDate.getTime() > 7 * 24 * 60 * 60 * 1000) {
    return null;
  }

  const root = locationPayload as Record<string, unknown>;
  const locationResult = Array.isArray(root.results) ? root.results[0] as Record<string, unknown> : root;
  const location = pickString(locationResult, ["name", "locality", "city"]) ?? "Bangkok";
  const countryText = JSON.stringify(locationResult.country ?? "").toLowerCase();
  const isThailandContext =
    countryText.includes('"th"') ||
    countryText.includes("thailand") ||
    /bangkok|กรุงเทพ|thailand|thai|chatuchak|dindaeng|nonthaburi/i.test(location);

  if (!isThailandContext) return null;

  return {
    location: /bangkok|กรุงเทพ|chatuchak|dindaeng/i.test(location) ? "Bangkok" : location,
    pm25: measurement.value,
    aqi: pm25ToUsAqi(measurement.value),
    condition: measurement.value >= 35 ? "hazy" : "clear"
  };
}

function findOpenAqDateTime(payload: unknown): Date | null {
  if (!payload || typeof payload !== "object") return null;
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = findOpenAqDateTime(item);
      if (found) return found;
    }
    return null;
  }

  const record = payload as Record<string, unknown>;
  const datetime = record.datetime;
  if (datetime && typeof datetime === "object" && !Array.isArray(datetime)) {
    const datetimeRecord = datetime as Record<string, unknown>;
    const value = typeof datetimeRecord.utc === "string" ? datetimeRecord.utc : datetimeRecord.local;
    if (typeof value === "string") {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  }

  for (const value of Object.values(record)) {
    const found = findOpenAqDateTime(value);
    if (found) return found;
  }

  return null;
}

function findPm25SensorId(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const id = findPm25SensorId(item);
      if (id) return id;
    }
    return null;
  }

  const record = payload as Record<string, unknown>;
  const parameter = JSON.stringify(record.parameter ?? "").toLowerCase();
  if ((parameter.includes("pm25") || parameter.includes("pm2.5")) && typeof record.id === "number") {
    return record.id;
  }

  for (const value of Object.values(record)) {
    const id = findPm25SensorId(value);
    if (id) return id;
  }

  return null;
}

function findOpenAqMeasurement(node: unknown): { value: number; unit?: string } | null {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findOpenAqMeasurement(item);
      if (found) return found;
    }
    return null;
  }

  const record = node as Record<string, unknown>;
  const parameter = JSON.stringify(record.parameter ?? record.parameter_name ?? record.name ?? "").toLowerCase();
  const value = firstNumber(record, ["value", "latest", "lastValue"]);
  if (typeof value === "number" && (parameter.includes("pm25") || parameter.includes("pm2.5") || parameter.includes("pm 2.5"))) {
    return { value, unit: pickString(record, ["unit", "units"]) };
  }

  for (const value of Object.values(record)) {
    const found = findOpenAqMeasurement(value);
    if (found) return found;
  }

  return null;
}

function normalizeTmd(payload: unknown): Partial<ExternalContext> {
  const flat = flattenObjects(payload);
  const bangkok = flat.find((item) => {
    const text = JSON.stringify(item);
    return text.includes("กรุงเทพ") || /bangkok/i.test(text);
  }) ?? flat[0] ?? {};

  const temperature = firstNumber(bangkok, ["Temperature", "temperature", "Temp", "tc", "AirTemperature"]);
  const humidity = firstNumber(bangkok, ["RelativeHumidity", "humidity", "Humidity", "rh"]);
  const condition = pickString(bangkok, ["Weather", "weather", "Description", "description", "Condition"]) ?? "hazy";

  return {
    ...(typeof temperature === "number" ? { temperature, heatIndex: estimateHeatIndex(temperature, humidity ?? MOCK_CONTEXT.humidity) } : {}),
    ...(typeof humidity === "number" ? { humidity } : {}),
    condition
  };
}

function flattenObjects(value: unknown): Array<Record<string, unknown>> {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(flattenObjects);

  const record = value as Record<string, unknown>;
  return [record, ...Object.values(record).flatMap(flattenObjects)];
}

function firstNumber(record: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value.replace(/[^\d.-]/g, ""));
      if (Number.isFinite(parsed)) return parsed;
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = firstNumber(value as Record<string, unknown>, keys);
      if (typeof nested === "number") return nested;
    }
  }
  return undefined;
}

function pickString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function pm25ToUsAqi(pm25: number) {
  const breakpoints = [
    [0, 12, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 350.4, 301, 400],
    [350.5, 500.4, 401, 500]
  ];
  const bp = breakpoints.find(([low, high]) => pm25 >= low && pm25 <= high) ?? breakpoints[breakpoints.length - 1];
  const [cLow, cHigh, iLow, iHigh] = bp;
  return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (pm25 - cLow) + iLow);
}

function estimateHeatIndex(tempC: number, humidity: number) {
  if (tempC < 27 || humidity < 40) return Math.round(tempC);
  const tempF = tempC * 1.8 + 32;
  const hiF =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * humidity -
    0.22475541 * tempF * humidity -
    0.00683783 * tempF * tempF -
    0.05481717 * humidity * humidity +
    0.00122874 * tempF * tempF * humidity +
    0.00085282 * tempF * humidity * humidity -
    0.00000199 * tempF * tempF * humidity * humidity;
  return Math.round((hiF - 32) / 1.8);
}
