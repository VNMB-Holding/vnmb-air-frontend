"use server";

import { fetchWithAuth } from "@/services/apiClient";

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
}

export async function getAlerts(): Promise<Notification[] | null> {
  try {
    const response = await fetchWithAuth("/api/notifications");
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return null;
  }
}

export async function getSummary() {
  try {
    const response = await fetchWithAuth("/api/notifications/summary");
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching summary:", error);
    return null;
  }
}
