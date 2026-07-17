"use server";

import { fetchWithAuth } from "@/services/apiClient";

export interface Pilot {
  id: string;
  name: string;
  initials: string;
  licenseNumber: string;
  role: string;
  status: string;
  hoursFlown: number;
  medicalExpiry: string;
  safetyRating: number;
  fuelEfficiencyScore: number;
  qualifiedAircraftId?: string;
}

export async function getPilots(): Promise<Pilot[] | null> {
  try {
    const response = await fetchWithAuth("/api/pilots");
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching pilots:", error);
    return null;
  }
}

export async function getPilot(id: string): Promise<Pilot | null> {
  try {
    const response = await fetchWithAuth(`/api/pilots/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching pilot:", error);
    return null;
  }
}

export async function createPilot(data: Partial<Pilot>) {
  try {
    const response = await fetchWithAuth("/api/pilots", {
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

export async function updatePilot(id: string, data: Partial<Pilot>) {
  try {
    const response = await fetchWithAuth(`/api/pilots/${id}`, {
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

export async function deletePilot(id: string) {
  try {
    const response = await fetchWithAuth(`/api/pilots/${id}`, {
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
