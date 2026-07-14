"use client";

import React from "react";
import { Card, Chip } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";

export default function AircraftPage() {
  const fleet = [
    {
      id: "1",
      model: "Gulfstream G650ER",
      registration: "PR-VNM",
      capacity: "16 Passageiros",
      range: "13.900 km",
      status: "Em Voo",
      statusColor: "primary",
      speed: "Mach 0.925",
    },
    {
      id: "2",
      model: "Bombardier Global 7500",
      registration: "PR-AIR",
      capacity: "19 Passageiros",
      range: "14.260 km",
      status: "Disponível",
      statusColor: "success",
      speed: "Mach 0.925",
    },
    {
      id: "3",
      model: "Embraer Phenom 300E",
      registration: "PR-FLT",
      capacity: "9 Passageiros",
      range: "3.720 km",
      status: "Manutenção",
      statusColor: "warning",
      speed: "833 km/h",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Frota de Aeronaves</h1>
          <p className="text-slate-400 text-xs font-light mt-1">
            Gerenciamento e status em tempo real dos jatos executivos da frota.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fleet.map((aircraft) => (
          <Card
            key={aircraft.id}
            className="bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] overflow-hidden flex flex-col justify-between"
          >
            {/* Top Info Header */}
            <div className="p-6 pb-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/50">
                  {aircraft.registration}
                </span>
                <Chip
                  color={aircraft.statusColor as "primary" | "success" | "warning"}
                  variant="flat"
                  size="sm"
                  className="font-semibold text-[10px]"
                >
                  {aircraft.status}
                </Chip>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-800 leading-snug">{aircraft.model}</h3>
                <p className="text-[10px] text-slate-400 font-light mt-0.5">Jato Executivo de Longo Alcance</p>
              </div>
            </div>

            {/* Aircraft specs list */}
            <div className="px-6 py-4 border-t border-slate-100/40 bg-slate-50/30 flex flex-col gap-2.5 flex-grow">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-light">Capacidade</span>
                <span className="font-semibold text-slate-700">{aircraft.capacity}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-light">Alcance Máximo</span>
                <span className="font-semibold text-slate-700">{aircraft.range}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-light">Velocidade Máxima</span>
                <span className="font-semibold text-slate-700">{aircraft.speed}</span>
              </div>
            </div>

            {/* View Details / Action Button */}
            <div className="p-6 pt-3 flex items-center justify-between border-t border-slate-100/40 bg-white/40">
              <div className="flex items-center gap-1.5 text-slate-400">
                <SvgIcon name="plane" className="w-4 h-4" />
                <span className="text-[10px] font-medium font-mono">Disponível p/ Fretamento</span>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-bold transition-colors">
                Detalhes
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
