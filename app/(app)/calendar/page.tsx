"use client";

import React, { useState } from "react";
import { Card, Calendar } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(today(getLocalTimeZone()));

  const mockFlights = [
    { id: "1", time: "09:00", route: "GRU → GIG", code: "VA-001", pilot: "Capt. Silva", status: "Confirmado" },
    { id: "2", time: "14:30", route: "CGH → BSB", code: "VA-104", pilot: "Capt. Costa", status: "Em Preparação" },
    { id: "3", time: "17:15", route: "GIG → MIA", code: "VA-002", pilot: "Capt. Oliveira", status: "Aguardando Liberação" },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Calendário de Voos</h1>
          <p className="text-slate-400 text-xs font-light mt-1">
            Escalas e programação de voos para a data selecionada.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Card (HeroUI Calendar) */}
        <div className="lg:col-span-5 flex justify-center">
          <Card className="p-4 bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] w-full">
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
              </Calendar>
            </div>
          </Card>
        </div>

        {/* Flight Details Side Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
            <SvgIcon name="calendar" className="w-4 h-4 text-blue-600" />
            Voos Programados • {selectedDate.toString()}
          </h3>

          <div className="flex flex-col gap-3">
            {mockFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white/60 border border-white/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/90 hover:border-slate-200 transition-all shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 shrink-0">
                    <SvgIcon name="plane" className="w-5 h-5 rotate-45" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{flight.route}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded-md">
                        {flight.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <SvgIcon name="user-01" className="w-3.5 h-3.5 text-slate-400" />
                      {flight.pilot}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500">{flight.time}</span>
                    <p className="text-[10px] text-slate-400 font-light mt-0.5">Partida Prevista</p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                      flight.status === "Confirmado"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : flight.status === "Em Preparação"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}
                  >
                    {flight.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
