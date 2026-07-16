"use client";

import React, { useState } from "react";
import { Card, Chip, Button, Spinner, toast } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";

export default function AircraftPage() {
  const fleet = [
    {
      id: "g650",
      model: "Gulfstream G650ER",
      registration: "PR-VNM",
      capacity: "16 Passageiros",
      range: "13.900 km",
      status: "Em Voo",
      statusColor: "accent",
      speed: "Mach 0.925 (982 km/h)",
      ceiling: "51.000 ft (15.545 m)",
      engines: "2x Rolls-Royce BR725",
      fuelBurn: "1.500 L/h",
      nextInspection: "18/06/2026",
      hoursFlown: "2.420 hrs",
      costPerHour: "R$ 28.000,00",
    },
    {
      id: "global7500",
      model: "Bombardier Global 7500",
      registration: "PR-AIR",
      capacity: "19 Passageiros",
      range: "14.260 km",
      status: "Disponível",
      statusColor: "success",
      speed: "Mach 0.925 (982 km/h)",
      ceiling: "51.000 ft (15.545 m)",
      engines: "2x GE Passport",
      fuelBurn: "1.650 L/h",
      nextInspection: "24/09/2026",
      hoursFlown: "1.150 hrs",
      costPerHour: "R$ 31.000,00",
    },
    {
      id: "phenom300",
      model: "Embraer Phenom 300E",
      registration: "PR-FLT",
      capacity: "9 Passageiros",
      range: "3.720 km",
      status: "Manutenção",
      statusColor: "warning",
      speed: "833 km/h",
      ceiling: "45.000 ft (13.716 m)",
      engines: "2x Pratt & Whitney PW535E1",
      fuelBurn: "700 L/h",
      nextInspection: "12/04/2026",
      hoursFlown: "3.890 hrs",
      costPerHour: "R$ 14.500,00",
    },
  ];

  const [selectedId, setSelectedId] = useState<string>("g650");
  const selectedAircraft = fleet.find((ac) => ac.id === selectedId) || fleet[0];
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedule = () => {
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      toast.success("Escala programada!", {
        description: `Nova escala de voo definida com sucesso para a aeronave ${selectedAircraft.model}.`
      });
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Gerenciamento de Frota</h1>
          <p className="text-slate-400 text-xs font-light mt-1">
            Status operacional, telemetria das aeronaves e visualizador 3D técnico da frota VNMB.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Lista de Aeronaves Ativas
          </h3>

          <div className="flex flex-col gap-3">
            {fleet.map((aircraft) => {
              const isSelected = aircraft.id === selectedId;
              return (
                <Card
                  key={aircraft.id}
                  onClick={() => setSelectedId(aircraft.id)}
                  className={`cursor-pointer transition-all duration-300 p-5 backdrop-blur-xl rounded-3xl border flex flex-col gap-4 ${isSelected
                      ? "bg-white border-blue-600 shadow-[0_12px_36px_-8px_rgba(0,49,132,0.06)]"
                      : "bg-white/60 border-white/80 hover:bg-white/90 hover:border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(79,119,186,0.04)]"
                    }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-100/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100/40">
                        {aircraft.registration}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {aircraft.model.split(" ")[0]}
                      </span>
                    </div>
                    <Chip
                      color={aircraft.statusColor as "accent" | "success" | "warning"}
                      variant="soft"
                      size="sm"
                      className="font-bold text-[9px] uppercase h-5 min-w-0"
                    >
                      {aircraft.status}
                    </Chip>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 leading-snug">{aircraft.model}</h4>
                      <p className="text-[10px] text-slate-400 font-light mt-0.5">Jato Corporativo Executivo</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-700">{aircraft.range}</span>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Alcance</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100/50 bg-slate-50/20 px-3 py-2 rounded-2xl">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <SvgIcon name="user-01" className="w-3.5 h-3.5 text-slate-400" />
                      <span>Capacidade: <strong>{aircraft.capacity.split(" ")[0]}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <SvgIcon name="activity" className="w-3.5 h-3.5 text-slate-400" />
                      <span>Horas: <strong>{aircraft.hoursFlown}</strong></span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Painel Técnico & Telemetria do Jato
          </h3>

          <Card className="bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3.5 border-b border-slate-100/60">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">{selectedAircraft.model}</h2>
                <p className="text-xs text-slate-400 font-light mt-0.5">Matrícula Regulamentada ANAC: <strong>{selectedAircraft.registration}</strong></p>
              </div>
              <div className="flex items-center gap-2">
                <Chip
                  color={selectedAircraft.statusColor as "accent" | "success" | "warning"}
                  variant="soft"
                  size="sm"
                  className="font-bold text-[10px] uppercase h-5.5 min-w-0 px-3"
                >
                  {selectedAircraft.status}
                </Chip>
              </div>
            </div>

            <div className="w-full h-[260px] bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-900 shadow-inner group">
              {selectedAircraft.id === "g650" ? (
                <iframe
                  title="Gulfstream G650"
                  allowFullScreen
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  src="https://sketchfab.com/models/67451e56d38746de86667347d7a56587/embed?autostart=1&camera=0&preload=1&transparent=1"
                  className="w-full h-full border-none rounded-2xl z-10"
                />
              ) : selectedAircraft.id === "phenom300" ? (
                <iframe
                  title="Embraer Legacy 600"
                  allowFullScreen
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  src="https://sketchfab.com/models/a9a9b1e004634237b1775e4d3231770b/embed?autostart=1&camera=0&preload=1&transparent=1"
                  className="w-full h-full border-none rounded-2xl z-10"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0 z-0 opacity-15"
                    style={{
                      backgroundImage: `radial-gradient(circle, #0284c7 1px, transparent 1px), linear-gradient(to right, rgba(2, 132, 199, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.08) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px, 40px 40px, 40px 40px",
                      backgroundPosition: "center center",
                    }}
                  />

                  <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-blue-500/60" />
                  <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-blue-500/60" />
                  <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-blue-500/60" />
                  <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-blue-500/60" />

                  <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-sky-500/10 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-4 bottom-4 w-[1px] bg-sky-500/10 -translate-x-1/2" />

                  <div className="absolute w-36 h-36 border border-sky-500/20 rounded-full animate-[spin_20s_linear_infinite] flex items-center justify-center">
                    <div className="w-32 h-32 border border-dashed border-sky-500/10 rounded-full" />
                  </div>

                  <div className="absolute top-3 left-6 text-[8px] font-mono text-sky-500/60 flex flex-col gap-0.5 uppercase tracking-widest z-10">
                    <span>Viewport: Interactive 3D HUD</span>
                    <span>Active Link: {selectedAircraft.id}_mesh</span>
                    <span>Shader: PBR_MAT_GLASS_CHROME</span>
                  </div>
                  <div className="absolute bottom-3 right-6 text-[8px] font-mono text-sky-500/60 text-right uppercase tracking-widest z-10">
                    <span>FPS: 60.0 • GPU Core</span>
                    <span>Tgt: {selectedAircraft.registration}</span>
                  </div>

                  <div className="z-10 flex flex-col items-center gap-3 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform duration-300">
                      <SvgIcon name="plane" className="w-6 h-6 rotate-45" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h5 className="text-xs font-mono font-bold text-sky-400 tracking-wider uppercase">
                        Visualizador Modelo 3D
                      </h5>
                      <p className="text-[9.5px] font-mono text-slate-500 max-w-[220px] leading-relaxed">
                        [Espaço Reservado para Imagem/Malha 3D Interativa em Tempo Real]
                      </p>
                    </div>
                    <span className="text-[8px] font-mono bg-blue-950/40 text-blue-500 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest animate-pulse">
                      Pronto para Renderização 3D
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-100/60 pt-5 bg-slate-50/20 p-4 rounded-2xl">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Capacidade</span>
                <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                  <SvgIcon name="user-01" className="w-4 h-4 text-slate-400" />
                  {selectedAircraft.capacity}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Alcance Operacional</span>
                <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                  <SvgIcon name="route" className="w-4 h-4 text-slate-400" />
                  {selectedAircraft.range}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Velocidade Máxima</span>
                <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                  <SvgIcon name="activity" className="w-4 h-4 text-slate-400" />
                  {selectedAircraft.speed}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Teto Operacional</span>
                <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                  <SvgIcon name="arrows-triangle" className="w-4 h-4 text-slate-400" />
                  {selectedAircraft.ceiling}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Motorização</span>
                <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5 truncate">
                  <SvgIcon name="settings-04" className="w-4 h-4 text-slate-400" />
                  {selectedAircraft.engines}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fluxo de Combustível</span>
                <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                  <SvgIcon name="activity" className="w-4 h-4 text-slate-400" />
                  {selectedAircraft.fuelBurn}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3.5 border-t border-slate-100/60 bg-white/40">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Inspeção Mandatória ANAC</span>
                <span className="text-xs font-bold text-slate-600 mt-0.5">Próxima: {selectedAircraft.nextInspection}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col text-right mr-2" title={`Custos operacionais: ${selectedAircraft.costPerHour} / hora de voo`}>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Custo Estimado</span>
                  <span className="text-xs font-bold text-blue-900">{selectedAircraft.costPerHour}/h</span>
                </div>
                <Button
                  isPending={isScheduling}
                  onPress={handleSchedule}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 h-9 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  {({ isPending }) => (
                    <>
                      {isPending ? <Spinner color="current" size="sm" /> : null}
                      Programar Escala
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
