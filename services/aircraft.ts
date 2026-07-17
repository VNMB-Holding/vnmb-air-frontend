"use server";

import { fetchWithAuth } from "@/services/apiClient";

export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  capacity: number;
  rangeKm: number;
  status: string;
  engines: string;
  fuelBurnPerHour: number;
  costPerHour: number;
  nextInspectionDate: string;
  totalHoursFlown: number;
  model3DUrl?: string;
  cruiseSpeedKmh: number;
}

export async function getAircrafts(): Promise<Aircraft[] | null> {
  try {
    const response = await fetchWithAuth("/api/aircraft");
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching aircrafts:", error);
    return null;
  }
}

export async function getAircraft(id: string): Promise<Aircraft | null> {
  try {
    const response = await fetchWithAuth(`/api/aircraft/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching aircraft:", error);
    return null;
  }
}

export async function createAircraft(data: Partial<Aircraft>) {
  try {
    const response = await fetchWithAuth("/api/aircraft", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      return { success: false, error: err.message };
    }
    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAircraft(id: string, data: Partial<Aircraft>) {
  try {
    const response = await fetchWithAuth(`/api/aircraft/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      return { success: false, error: err.message };
    }
    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAircraft(id: string) {
  try {
    const response = await fetchWithAuth(`/api/aircraft/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.json();
      return { success: false, error: err.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
