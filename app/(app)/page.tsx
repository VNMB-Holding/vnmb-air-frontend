"use client";

import React, { useState } from "react";
import { Avatar, Button } from "@heroui/react";

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState("Maio 2024");

  // Flight calendar static mock data
  const calendarDays = [
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false, flights: [{ time: "08:30", route: "GRU → MIA", code: "VA-001" }] },
    { day: 30, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true, flights: [{ time: "11:45", route: "GIG → ORL", code: "VA-002" }] },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true, flights: [{ time: "15:20", route: "CGH → MCO", code: "VA-001" }] },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true, flights: [{ time: "09:10", route: "VCP → MIA", code: "VA-002" }] },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true, flights: [{ time: "14:00", route: "MIA → GRU", code: "VA-001" }] },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true, flights: [{ time: "16:30", route: "MCO → CGH", code: "VA-002" }] },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true, isToday: true },
    { day: 15, isCurrentMonth: true, flights: [{ time: "10:25", route: "GRU → GIG", code: "VA-001" }] },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true, flights: [{ time: "13:50", route: "GIG → VCP", code: "VA-002" }] },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true, flights: [{ time: "08:00", route: "VCP → MCO", code: "VA-001" }] },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true, flights: [{ time: "17:10", route: "MCO → GRU", code: "VA-002" }] },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true, flights: [{ time: "07:30", route: "CGH → MIA", code: "VA-001" }] },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false }
  ];

  return (
    <div className="w-full flex flex-col gap-6 text-white pb-12">
      {/* Top Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 mb-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white/95">Bem-vindo de volta, John.</h1>
          <p className="text-white/50 text-sm font-light mt-1">Aqui está o resumo dos voos da sua frota.</p>
        </div>

        {/* Right side quick user controls */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          {/* Search Icon */}
          <button className="p-2.5 rounded-full hover:bg-white/5 transition-colors text-white/70 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Notifications Icon with Badge */}
          <button className="p-2.5 rounded-full hover:bg-white/5 transition-colors text-white/70 hover:text-white relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 rounded-full text-[9px] flex items-center justify-center font-bold text-white">
              2
            </span>
          </button>

          {/* Dropdown Chevron */}
          <button className="p-1 text-white/40 hover:text-white/80 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Grid: Left calendar/flights, Right Fleet/Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Side (full width calendar) */}
        <div className="xl:col-span-12 flex flex-col gap-6">
          {/* Upcoming Flights Horizontal Row (moved to top) */}
          <section className="flex flex-col gap-3 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-white/90">Próximos Voos</h2>
              <button className="text-xs text-white/50 hover:text-white/80 font-light transition-colors">
                Ver todos os voos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { timeInfo: "Hoje • 14:00", route: "GRU → GIG", code: "VA-001" },
                { timeInfo: "Hoje • 16:30", route: "MCO → CGH", code: "VA-002" },
                { timeInfo: "Amanhã • 08:00", route: "VCP → MIA", code: "VA-001" },
                { timeInfo: "Amanhã • 11:45", route: "GIG → ORL", code: "VA-002" },
              ].map((flight, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-xl bg-white/[0.06] border border-white/10 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/[0.09] hover:border-white/20 transition-all duration-200"
                >
                  <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/10 shrink-0">
                    <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-white/40 font-light">{flight.timeInfo}</span>
                    <span className="text-sm font-semibold text-white truncate leading-tight mt-0.5">{flight.route}</span>
                    <span className="text-[10px] text-white/50 font-mono mt-0.5">{flight.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Calendar Widget */}
          <section className="backdrop-blur-3xl bg-white/[0.08] border border-white/10 rounded-3xl p-6 shadow-2xl">
            {/* Calendar Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-medium text-white/90">Calendário de Voos</h2>
                <div className="flex items-center bg-white/5 rounded-xl p-0.5 border border-white/5 ml-4">
                  <button className="px-3.5 py-1.5 rounded-lg text-xs font-light text-white/80 hover:bg-white/5">
                    Hoje
                  </button>
                  <button className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <button className="flex items-center gap-1.5 text-white/90 hover:text-white font-medium text-sm ml-2">
                  <span>Maio 2024</span>
                  <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              <Button
                variant="primary"
                className="bg-blue-600 text-white font-medium text-xs px-5 shadow-lg shadow-blue-600/25 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                + Agendar Voo
              </Button>
            </div>

            {/* Grid Header (Days of week) */}
            <div className="grid grid-cols-7 text-center text-xs font-light text-white/40 mb-3 uppercase tracking-wider">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sáb</div>
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((item, index) => (
                <div
                  key={index}
                  className={`min-h-[92px] p-2 rounded-2xl flex flex-col justify-between transition-colors border border-transparent ${item.isCurrentMonth ? "bg-white/[0.01]" : "opacity-35"
                    } ${item.isToday ? "bg-blue-600/5 border-blue-500/20" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full ${item.isToday ? "bg-blue-600 text-white font-bold" : "text-white/60"
                        }`}
                    >
                      {item.day}
                    </span>
                  </div>

                  {/* Flight Info inside cell */}
                  {item.flights && item.flights.map((flight, fIdx) => (
                    <div
                      key={fIdx}
                      className="backdrop-blur-md bg-white/[0.06] border border-white/10 rounded-xl p-1.5 mt-1 shadow-sm text-left hover:bg-white/[0.09] hover:border-white/20 transition-colors"
                    >
                      <div className="text-[10px] font-semibold text-white/80 leading-none mb-1">
                        {flight.time}
                      </div>
                      <div className="text-[10px] font-bold text-white leading-none truncate">
                        {flight.route}
                      </div>
                      <div className="text-[8px] text-white/40 font-light mt-0.5 leading-none">
                        {flight.code}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Flights moved above calendar (original location removed) */}
        </div>

        {/* Right-side cards removed: calendar now spans full width */}
      </div>
    </div>
  );
}
