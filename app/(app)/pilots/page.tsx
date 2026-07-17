"use client";

import React, { useState, useEffect } from "react";
import { Card, Avatar, Chip, Button, Tooltip, Spinner, toast } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";

import { getPilots, Pilot } from "@/services/pilots";

export default function PilotsPage() {
  const [crew, setCrew] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getPilots();
      if (data) {
        setCrew(data);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const [selectedId, setSelectedId] = useState<string>("");
  const selectedPilot = crew.find((p) => p.id === selectedId) || crew[0];
  const [isEditingScale, setIsEditingScale] = useState(false);

  const handleEditScale = () => {
    setIsEditingScale(true);
    setTimeout(() => {
      setIsEditingScale(false);
      toast.success("Escala atualizada!", {
        description: `A escala do tripulante ${selectedPilot.name} foi salva com sucesso.`,
      });
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Equipe de Tripulantes</h1>
          <p className="text-slate-400 text-xs font-light mt-1">
            Status operacional dos pilotos, conformidade de licenças e escalas ativas de voo.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Lista de Pilotos Operacionais
          </h3>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="flex justify-center p-10"><Spinner size="lg" /></div>
            ) : crew.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum piloto encontrado.</p>
            ) : crew.map((pilot) => {
              const isSelected = pilot.id === selectedId;
              const initials = pilot.name ? pilot.name.substring(0, 2).toUpperCase() : "NA";
              const statusColor = pilot.status === "ACTIVE" ? "success" : pilot.status === "INACTIVE" ? "default" : "accent";
              return (
                <Card
                  key={pilot.id}
                  onClick={() => setSelectedId(pilot.id)}
                  className={`cursor-pointer transition-all duration-300 p-5 backdrop-blur-xl rounded-3xl border flex flex-col gap-4 ${isSelected
                      ? "bg-white border-blue-600 shadow-[0_12px_36px_-8px_rgba(0,49,132,0.06)]"
                      : "bg-white/60 border-white/80 hover:bg-white/90 hover:border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(79,119,186,0.04)]"
                    }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-100/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 text-xs font-bold border border-slate-200/60 shadow-xs bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700">
                        {initials}
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-700 truncate">{pilot.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{pilot.licenseNumber || "N/A"}</span>
                      </div>
                    </div>
                    <Chip
                      color={statusColor}
                      variant="soft"
                      size="sm"
                      className="font-bold text-[9px] uppercase h-5 min-w-0"
                    >
                      {pilot.status}
                    </Chip>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Habilitação</span>
                      <h4 className="text-sm font-extrabold text-slate-800 leading-snug flex items-center gap-1.5 mt-0.5">
                        <SvgIcon name="plane" className="w-4 h-4 text-slate-400 rotate-45" />
                        {pilot.aircraft || "--"}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-700">{pilot.hoursFlown || "-- hrs"}</span>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Horas de Voo</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Ficha Cadastral e Escala do Piloto
          </h3>

          {selectedPilot ? (
            <Card className="bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-6">
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
                    CHT: {selectedPilot.licenseNumber} • Venc. Médico: {new Date(selectedPilot.medicalExpiry).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              <Chip
                color={selectedPilot?.status === "ACTIVE" ? "success" : "default"}
                variant="soft"
                size="sm"
                className="font-bold text-[10px] uppercase h-5.5 min-w-0 px-3"
              >
                {selectedPilot?.status || "N/A"}
              </Chip>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-slate-100/50 py-4 bg-slate-50/20 px-4 rounded-2xl">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Acumulado</span>
                <p className="text-base font-extrabold text-slate-700 mt-1">{selectedPilot.hoursFlown}</p>
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
                <p className="text-base font-extrabold text-blue-900 mt-1">{selectedPilot.fuelEfficiencyScore}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Escala Futura Próximos Voos</span>
              <div className="flex flex-col gap-3">
                {selectedPilot?.upcomingFlights?.length ? selectedPilot.upcomingFlights.map((flight: any, idx: number) => (
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
                      color={flight.status === "Em Rota" ? "accent" : "success"}
                      variant="soft"
                      size="sm"
                      className="font-bold text-[9px] uppercase h-5 min-w-0"
                    >
                      {flight.status}
                    </Chip>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500">Nenhum voo programado.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100/60 bg-white/40">
              <span className="text-[9.5px] text-slate-400 font-light flex items-center gap-1">
                <SvgIcon name="info-circle" className="w-4 h-4 text-slate-400" />
                Dados cadastrais auditados de acordo com as normas RBAC da ANAC.
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 rounded-xl"
                >
                  Histórico de Escalas
                </Button>
                <Button
                  isPending={isEditingScale}
                  onPress={handleEditScale}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 h-9 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  {({ isPending }) => (
                    <>
                      {isPending ? <Spinner color="current" size="sm" /> : null}
                      Editar Escala
                    </>
                  )}
                </Button>
              </div>
            </div>
            </Card>
          ) : (
            <Card className="bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 gap-3 min-h-[400px]">
              <SvgIcon name="user-01" className="w-10 h-10 text-slate-300" />
              <p>Nenhum piloto selecionado.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
