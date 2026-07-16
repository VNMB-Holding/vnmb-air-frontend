"use client";

import React, { useState } from "react";
import { Card, Calendar, Chip, Button, Tooltip } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(today(getLocalTimeZone()));

  const mockFlights = [
    {
      id: "1",
      time: "09:00 AM",
      arrTime: "10:15 AM",
      route: "GRU → GIG",
      depCode: "GRU",
      arrCode: "GIG",
      depCity: "São Paulo",
      arrCity: "Rio de Janeiro",
      code: "VA-001",
      pilot: "Capt. Carlos Silva",
      status: "Confirmado",
      statusColor: "success",
      aircraft: "Gulfstream G650ER",
      registration: "PR-VNM",
      duration: "1h 15m",
      weather: "Limpo • 24°C"
    },
    {
      id: "2",
      time: "02:30 PM",
      arrTime: "03:45 PM",
      route: "CGH → BSB",
      depCode: "CGH",
      arrCode: "BSB",
      depCity: "São Paulo",
      arrCity: "Brasília",
      code: "VA-104",
      pilot: "Copiloto Lucas Costa",
      status: "Em Preparação",
      statusColor: "warning",
      aircraft: "Embraer Phenom 300E",
      registration: "PR-FLT",
      duration: "1h 15m",
      weather: "Parcialmente Nublado • 26°C"
    },
    {
      id: "3",
      time: "05:15 PM",
      arrTime: "01:45 AM",
      route: "GIG → MIA",
      depCode: "GIG",
      arrCode: "MIA",
      depCity: "Rio de Janeiro",
      arrCity: "Miami",
      code: "VA-002",
      pilot: "Capt. Ana Oliveira",
      status: "Aguardando Liberação",
      statusColor: "primary",
      aircraft: "Bombardier Global 7500",
      registration: "PR-AIR",
      duration: "8h 30m",
      weather: "Chuva Leve • 28°C"
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Calendário de Escalas</h1>
          <p className="text-slate-400 text-xs font-light mt-1">
            Visualização de rotas corporativas programadas e alocação de tripulantes.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="p-5 bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] w-full">
            <div className="flex justify-center heroui-calendar-wrapper">
              <Calendar
                aria-label="Calendário de Voos"
                value={selectedDate}
                onChange={setSelectedDate}
                className="w-full max-w-full border-none shadow-none bg-transparent"
              >
                <Calendar.Header>
                  <Calendar.YearPickerTrigger>
                    <Calendar.YearPickerTriggerHeading />
                    <Calendar.YearPickerTriggerIndicator />
                  </Calendar.YearPickerTrigger>
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </Calendar.Header>
                <Calendar.Grid>
                  <Calendar.GridHeader>
                    {(day) => <Calendar.HeaderCell className="text-slate-400 font-bold text-xs">{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>
                    {(date) => <Calendar.Cell date={date} />}
                  </Calendar.GridBody>
                </Calendar.Grid>
                <Calendar.YearPickerGrid>
                  <Calendar.YearPickerGridBody>
                    {({ year }) => <Calendar.YearPickerCell year={year} />}
                  </Calendar.YearPickerGridBody>
                </Calendar.YearPickerGrid>
              </Calendar>
            </div>
          </Card>

          <Card className="p-5 bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
              Resumo Operacional do Dia
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/40 border border-white/50 rounded-2xl p-3 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Voos</span>
                <p className="text-xl font-extrabold text-slate-800 mt-1">3</p>
              </div>
              <div className="bg-white/40 border border-white/50 rounded-2xl p-3 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tempo</span>
                <p className="text-xl font-extrabold text-slate-800 mt-1">11h</p>
              </div>
              <div className="bg-white/40 border border-white/50 rounded-2xl p-3 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tripulação</span>
                <p className="text-xl font-extrabold text-slate-800 mt-1">3</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-2 pl-1">
            <SvgIcon name="calendar" className="w-4 h-4 text-blue-600" />
            Escalas Programadas • {selectedDate.toString()}
          </h3>

          <div className="flex flex-col gap-4">
            {mockFlights.map((flight) => (
              <Card
                key={flight.id}
                className="bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl p-5 hover:bg-white/90 transition-all shadow-[0_4px_24px_-4px_rgba(79,119,186,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(79,119,186,0.08)] flex flex-col gap-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-100/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100/40">
                      {flight.code}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {flight.aircraft} ({flight.registration})
                    </span>
                  </div>
                  <Chip
                    color={flight.statusColor === "primary" ? "default" : flight.statusColor as "success" | "warning" | "default"}
                    variant="soft"
                    size="sm"
                    className="font-bold text-[9px] uppercase h-5 min-w-0"
                  >
                    {flight.status}
                  </Chip>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Origem</span>
                    <span className="text-sm font-extrabold text-slate-800 mt-0.5">{flight.depCity}</span>
                    <span className="text-xs font-bold text-slate-400 mt-0.5">{flight.depCode} • {flight.time}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center relative px-2">
                    <span className="text-[9px] text-slate-400 font-bold mb-1.5">{flight.duration}</span>
                    <div className="w-full h-[1.5px] bg-slate-200 relative flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 absolute left-0" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 absolute right-0" />
                      <div className="absolute w-5 h-5 bg-white border border-slate-200/50 rounded-full flex items-center justify-center shadow-xs">
                        <SvgIcon name="plane" className="w-3 h-3 rotate-45 text-blue-600" />
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-medium mt-1.5 truncate">Voo Direto</span>
                  </div>

                  <div className="flex flex-col text-right md:text-right">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Destino</span>
                    <span className="text-sm font-extrabold text-slate-800 mt-0.5">{flight.arrCity}</span>
                    <span className="text-xs font-bold text-slate-400 mt-0.5">{flight.arrCode} • {flight.arrTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100/50 bg-slate-50/20 px-3 py-2.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <SvgIcon name="user-01" className="w-4 h-4 text-slate-400" />
                    <span>Piloto: <strong>{flight.pilot}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <SvgIcon name="cloud-01" className="w-4 h-4 text-blue-500" />
                    <span>Destino: <strong>{flight.weather}</strong></span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
