"use client";

import React, { useState } from "react";
import { Card, Avatar, Chip, Button, Tooltip } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";

export default function PilotsPage() {
  const crew = [
    {
      id: "carlos",
      name: "Capt. Carlos Silva",
      role: "Comandante",
      hours: "12.500 hrs",
      status: "Disponível",
      statusColor: "success",
      aircraft: "Gulfstream G650ER",
      initials: "CS",
      license: "PLA-A 142095",
      medicalExpiry: "15/10/2026",
      safetyRating: "100%",
      flightsThisMonth: 14,
      efficiencyIndex: "98.7%",
      upcomingFlights: [
        { id: "VA-102", route: "GRU → GIG", time: "Hoje, 09:20", status: "Confirmado" },
        { id: "VA-095", route: "GIG → BSB", time: "Amanhã, 14:00", status: "Programado" }
      ]
    },
    {
      id: "lucas",
      name: "Copiloto Lucas Costa",
      role: "Primeiro Oficial",
      hours: "4.200 hrs",
      status: "Em Voo",
      statusColor: "primary",
      aircraft: "Bombardier Global 7500",
      initials: "LC",
      license: "PC-A 198302",
      medicalExpiry: "24/11/2026",
      safetyRating: "99.8%",
      flightsThisMonth: 22,
      efficiencyIndex: "97.4%",
      upcomingFlights: [
        { id: "VA-205", route: "MIA → MCO", time: "Hoje, 11:30", status: "Em Rota" }
      ]
    },
    {
      id: "ana",
      name: "Capt. Ana Oliveira",
      role: "Comandante",
      hours: "9.800 hrs",
      status: "Em Folga",
      statusColor: "default",
      aircraft: "Embraer Phenom 300E",
      initials: "AO",
      license: "PLA-A 115049",
      medicalExpiry: "12/08/2026",
      safetyRating: "100%",
      flightsThisMonth: 8,
      efficiencyIndex: "99.1%",
      upcomingFlights: [
        { id: "VA-091", route: "LIS → JFK", time: "26/03/2026, 14:00", status: "Confirmado" }
      ]
    },
  ];

  const [selectedId, setSelectedId] = useState<string>("carlos");
  const selectedPilot = crew.find((p) => p.id === selectedId) || crew[0];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800 animate-fade-in">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Equipe de Tripulantes</h1>
          <p className="text-slate-400 text-xs font-light mt-1">
            Status operacional dos pilotos, conformidade de licenças e escalas ativas de voo.
          </p>
        </div>
      </header>

      {/* Main Grid: Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pilots List (Master) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Lista de Pilotos Operacionais
          </h3>

          <div className="flex flex-col gap-3">
            {crew.map((pilot) => {
              const isSelected = pilot.id === selectedId;
              return (
                <Card
                  key={pilot.id}
                  onClick={() => setSelectedId(pilot.id)}
                  className={`cursor-pointer transition-all duration-300 p-5 backdrop-blur-xl rounded-3xl border flex flex-col gap-4 ${
                    isSelected
                      ? "bg-white border-blue-600 shadow-[0_12px_36px_-8px_rgba(0,49,132,0.06)]"
                      : "bg-white/60 border-white/80 hover:bg-white/90 hover:border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(79,119,186,0.04)]"
                  }`}
                >
                  {/* Header: Avatar, Name & Status Chip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-100/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 text-xs font-bold border border-slate-200/60 shadow-xs bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700">
                        {pilot.initials}
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-700 truncate">{pilot.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{pilot.role}</span>
                      </div>
                    </div>
                    <Chip
                      color={pilot.statusColor as "success" | "primary" | "default"}
                      variant="flat"
                      size="sm"
                      className="font-bold text-[9px] uppercase h-5 min-w-0"
                    >
                      {pilot.status}
                    </Chip>
                  </div>

                  {/* Body: Aircraft authorization info */}
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Habilitação</span>
                      <h4 className="text-sm font-extrabold text-slate-800 leading-snug flex items-center gap-1.5 mt-0.5">
                        <SvgIcon name="plane" className="w-4 h-4 text-slate-400 rotate-45" />
                        {pilot.aircraft}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-700">{pilot.hours}</span>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Horas de Voo</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pilot Details Dashboard (Detail) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Ficha Cadastral e Escala do Piloto
          </h3>

          <Card className="bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-6">
            {/* Profile Header Details */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4.5 border-b border-slate-100/60">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 text-lg font-bold border border-slate-200/60 shadow-xs bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700">
                  {selectedPilot.initials}
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selectedPilot.role}</span>
                  <h2 className="text-xl font-extrabold text-slate-800 leading-snug mt-0.5">{selectedPilot.name}</h2>
                  <span className="text-xs font-semibold text-slate-500 font-mono mt-1 flex items-center gap-1.5">
                    <SvgIcon name="clipboard-check" className="w-4 h-4 text-slate-400" />
                    CHT: {selectedPilot.license} • Venc. Médico: {selectedPilot.medicalExpiry}
                  </span>
                </div>
              </div>

              <Chip
                color={selectedPilot.statusColor as "success" | "primary" | "default"}
                variant="flat"
                size="sm"
                className="font-bold text-[10px] uppercase h-5.5 min-w-0 px-3"
              >
                {selectedPilot.status}
              </Chip>
            </div>

            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-slate-100/50 py-4 bg-slate-50/20 px-4 rounded-2xl">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Acumulado</span>
                <p className="text-base font-extrabold text-slate-700 mt-1">{selectedPilot.hours}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Escalas do Mês</span>
                <p className="text-base font-extrabold text-slate-700 mt-1">{selectedPilot.flightsThisMonth} Voos</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Índice de Segurança</span>
                <p className="text-base font-extrabold text-emerald-600 mt-1">{selectedPilot.safetyRating}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Score Combustível</span>
                <p className="text-base font-extrabold text-blue-900 mt-1">{selectedPilot.efficiencyIndex}</p>
              </div>
            </div>

            {/* Upcoming scale schedule list */}
            <div className="flex flex-col gap-3.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Escala Futura Próximos Voos</span>
              <div className="flex flex-col gap-3">
                {selectedPilot.upcomingFlights.map((flight, idx) => (
                  <div
                    key={idx}
                    className="bg-white/40 border border-white/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/50 flex items-center justify-center shrink-0">
                        <SvgIcon name="plane" className="w-4.5 h-4.5 rotate-45" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-slate-800">{flight.route}</span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{flight.id} • {flight.time}</div>
                      </div>
                    </div>
                    <Chip
                      color={flight.status === "Em Rota" ? "primary" : "success"}
                      variant="flat"
                      size="sm"
                      className="font-bold text-[8.5px] uppercase h-5 min-w-0"
                    >
                      {flight.status}
                    </Chip>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100/60 bg-white/40">
              <span className="text-[9.5px] text-slate-400 font-light flex items-center gap-1">
                <SvgIcon name="info-circle" className="w-4 h-4 text-slate-400" />
                Dados cadastrais auditados de acordo com as normas RBAC da ANAC.
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="light"
                  size="sm"
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl"
                >
                  Histórico de Escalas
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 h-9 rounded-xl transition-all shadow-xs"
                >
                  Editar Escala
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
