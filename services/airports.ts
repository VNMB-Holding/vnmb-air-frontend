import { fetchWithAuth } from "@/services/apiClient";

export interface Airport {
  id: string;
  ident: string;
  iataCode: string;
  icaoCode: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  isoCountry: string;
  municipality: string;
}

export async function getTopAirports(): Promise<{ success: boolean; data?: Airport[]; error?: string }> {
  try {
    const response = await fetchWithAuth("/api/airports/top");
    if (!response.ok) {
      const err = await response.json();
      return { success: false, error: err.message };
    }
    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
