"use server";

export interface WeatherHub {
  name: string;
  lat: number;
  lon: number;
}

const defaultHubs: WeatherHub[] = [
  { name: "São Paulo (GRU)", lat: -23.4356, lon: -46.4731 },
  { name: "Miami (MIA)", lat: 25.7959, lon: -80.2870 },
  { name: "Rio de Janeiro (GIG)", lat: -22.8100, lon: -43.2436 },
  { name: "Lisboa (LIS)", lat: 38.7742, lon: -9.1342 },
  { name: "New York (JFK)", lat: 40.6413, lon: -73.7781 },
  { name: "Brasília (BSB)", lat: -15.8692, lon: -47.9208 }
];

export interface WeatherData {
  hub: string;
  temp: string;
  wind: string;
  cond: string;
  vis: string;
  runway: string;
  impact: string;
  impactColor: "success" | "warning" | "default";
}

export async function getHubWeather(hubs: WeatherHub[] = defaultHubs): Promise<WeatherData[]> {
  const results = await Promise.all(hubs.map(async (hub) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${hub.lat}&longitude=${hub.lon}&current_weather=true`, { 
        cache: 'no-store' 
      });
      if (!res.ok) throw new Error("API response error");
      
      const data = await res.json();
      const cw = data.current_weather;
      
      return {
        hub: hub.name,
        temp: `${cw.temperature}°C`,
        wind: `${cw.windspeed} km/h`,
        cond: cw.weathercode <= 3 ? "Limpo/Nublado" : (cw.weathercode <= 69 ? "Chuva Leve" : "Chuva/Tempestade"),
        vis: cw.weathercode <= 3 ? "> 10 km" : "Reduzida",
        runway: cw.weathercode > 50 ? "Molhada" : "Seca",
        impact: cw.weathercode > 50 ? "Atenção Média" : "Excelente",
        impactColor: cw.weathercode > 50 ? "warning" : "success"
      };
    } catch (e) {
      return {
        hub: hub.name,
        temp: "--", 
        wind: "--", 
        cond: "Indisponível", 
        vis: "--", 
        runway: "--", 
        impact: "Erro na API", 
        impactColor: "default"
      };
    }
  }));

  return results as WeatherData[];
}
