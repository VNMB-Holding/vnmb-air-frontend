"use client";

import React from "react";
import { Card, Avatar, Chip } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";

export default function PilotsPage() {
  const crew = [
    {
      id: "1",
      name: "Capt. Carlos Silva",
      role: "Comandante",
      hours: "12.500 hrs",
      status: "Disponível",
      statusColor: "success",
      aircraft: "Gulfstream G650ER",
      initials: "CS",
    },
    {
      id: "2",
      name: "Copiloto Lucas Costa",
      role: "Primeiro Oficial",
      hours: "4.200 hrs",
      status: "Em Voo",
      statusColor: "primary",
      aircraft: "Bombardier Global 7500",
      initials: "LC",
    },
    {
      id: "3",
      name: "Capt. Ana Oliveira",
      role: "Comandante",
      hours: "9.800 hrs",
      status: "Em Folga",
      statusColor: "default",
      aircraft: "Embraer Phenom 300E",
      initials: "AO",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Equipe de Pilotos</h1>
          <p className="text-slate-400 text-xs font-light mt-1">
            Status operacional, horas de voo acumuladas e aeronaves habilitadas.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crew.map((pilot) => (
          <Card
            key={pilot.id}
            className="bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] p-6 flex flex-col gap-5 justify-between"
          >
            {/* Profile Avatar + Identity Block */}
            <div className="flex items-start gap-4">
              <Avatar className="w-14 h-14 text-lg font-bold border border-slate-200/60 shadow-xs bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700">
                {pilot.initials}
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {pilot.role}
                </span>
                <h3 className="text-base font-extrabold text-slate-800 truncate mt-0.5">{pilot.name}</h3>
                <span className="text-[11px] text-slate-400 font-light mt-1 flex items-center gap-1.5">
                  <SvgIcon name="plane" className="w-3.5 h-3.5" />
                  {pilot.aircraft}
                </span>
              </div>
            </div>

            {/* Crew Stats Row */}
            <div className="grid grid-cols-2 gap-3 border-t border-b border-slate-100/50 py-3 bg-slate-50/20 px-3 rounded-2xl">
              <div>
                <span className="text-[10px] text-slate-400 font-light">Horas de Voo</span>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{pilot.hours}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-light">Status</span>
                <div className="mt-0.5">
                  <Chip
                    color={pilot.statusColor as "success" | "primary" | "default"}
                    size="sm"
                    variant="flat"
                    className="font-semibold text-[9px] h-5 min-w-0"
                  >
                    {pilot.status}
                  </Chip>
                </div>
              </div>
            </div>

            {/* Actions Block */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 font-light">Ultima atualização há 2h</span>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-bold transition-colors">
                Escala de Voos
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
