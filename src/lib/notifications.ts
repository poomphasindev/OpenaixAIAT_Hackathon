import type { DemoNotification, EnergyForecast } from "@/lib/types";

export function selectActiveNotification(
  notifications: DemoNotification[],
  forecast: EnergyForecast,
  hour = 11
) {
  if (hour >= 11 && hour < 14) {
    return notifications.find((item) => item.type === "alert") ?? notifications[0];
  }

  if (forecast.timeSlots.some((slot) => slot.status === "crash")) {
    return notifications.find((item) => item.id === "n2") ?? notifications[0];
  }

  return notifications[0];
}

export function notificationTone(type: DemoNotification["type"]) {
  if (type === "alert") return "alert";
  if (type === "celebration") return "celebration";
  return "proactive";
}
