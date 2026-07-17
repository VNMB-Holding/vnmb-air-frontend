"use server";

import { fetchWithAuth } from "@/services/apiClient";

export interface Flight {
  id: string;
  flightCode: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraftId: string;
  pilotId: string;
  status: string;
}

export async function getFlights(): Promise<Flight[] | null> {
  try {
    const response = await fetchWithAuth("/api/flights");
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching flights:", error);
    return null;
  }
}

export async function getFlight(id: string): Promise<Flight | null> {
  try {
    const response = await fetchWithAuth(`/api/flights/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching flight:", error);
    return null;
  }
}

export async function scheduleFlight(data: Partial<Flight>) {
  try {
    const response = await fetchWithAuth("/api/flights", {
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

export async function updateFlightStatus(id: string, status: string) {
  try {
    const response = await fetchWithAuth(`/api/flights/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
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
