import { NextResponse } from "next/server";

export async function GET() {
  const OPENAQ_KEY = process.env.OPENAQ_API_KEY;
  const TMD_KEY = process.env.TMD_API_KEY;

  let aqiData = null;
  let weatherData = null;

  try {
    // 1. Fetch OpenAQ Data (Location 2178 = Bangkok example)
    if (OPENAQ_KEY) {
      const aqRes = await fetch("https://api.openaq.org/v3/locations/2178", {
        headers: { "X-API-Key": OPENAQ_KEY },
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      if (aqRes.ok) {
        aqiData = await aqRes.json();
      }
    }

    // 2. Fetch TMD Weather Data
    // Replace the URL with the specific TMD endpoint you want to use (e.g. WeatherToday or Weather3Hours)
    if (TMD_KEY) {
      const tmdRes = await fetch("https://data.tmd.go.th/api/WeatherToday/V1/?uid=api&ukey=" + TMD_KEY + "&format=json", {
        headers: { "Accept": "application/json" },
        next: { revalidate: 3600 }
      });
      if (tmdRes.ok) {
        weatherData = await tmdRes.json();
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        aqi: aqiData || { message: "Mock AQI data (No API key provided)", value: 145 },
        weather: weatherData || { message: "Mock Weather data (No API key provided)", temp: "41C" }
      }
    });

  } catch (error) {
    console.error("Weather API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch weather data" }, { status: 500 });
  }
}
