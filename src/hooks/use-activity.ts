import { useEffect, useState } from "react";

export type ActivityType = "email" | "summary" | "plan" | "research" | "chat";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: number;
}

const KEY = "tooliverse-activity";

function read(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function logActivity(type: ActivityType, title: string) {
  if (typeof window === "undefined") return;
  const list = read();
  const next: Activity = { id: crypto.randomUUID(), type, title, timestamp: Date.now() };
  const updated = [next, ...list].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("tooliverse-activity-updated"));
}

export function useActivity() {
  const [items, setItems] = useState<Activity[]>([]);
  useEffect(() => {
    const refresh = () => setItems(read());
    refresh();
    window.addEventListener("tooliverse-activity-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("tooliverse-activity-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const counts = {
    email: items.filter((i) => i.type === "email").length,
    summary: items.filter((i) => i.type === "summary").length,
    plan: items.filter((i) => i.type === "plan").length,
    research: items.filter((i) => i.type === "research").length,
    chat: items.filter((i) => i.type === "chat").length,
    total: items.length,
  };

  // Estimate: each automation saves ~15 minutes
  const hoursSaved = +(counts.total * 0.25).toFixed(1);

  return { items, counts, hoursSaved };
}

export function clearActivity() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("tooliverse-activity-updated"));
}
