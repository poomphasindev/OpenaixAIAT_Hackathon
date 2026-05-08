import type { HiddenPattern } from "@/lib/types";

export function nextHiddenPattern(patterns: HiddenPattern[]) {
  return patterns.find((pattern) => pattern.status === "hidden") ?? patterns[0];
}

export function discoveredCount(patterns: HiddenPattern[]) {
  return patterns.filter((pattern) => pattern.status !== "hidden").length;
}
