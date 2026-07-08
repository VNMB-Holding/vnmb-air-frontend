"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button, ButtonGroup, toast, Select, Label, ListBox, DatePicker, DateField, Calendar } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";
import { CalendarDate } from "@internationalized/date";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tab sync with query param
  const activeTab = searchParams.get("tab") || "bookings";

  // Search parameters state
  const [origin, setOrigin] = useState("São Paulo (GRU)");
  const [destination, setDestination] = useState("Miami (MIA)");
  const [departDate, setDepartDate] = useState<CalendarDate | null>(new CalendarDate(2026, 3, 24));
  const [returnDate, setReturnDate] = useState<CalendarDate | null>(new CalendarDate(2026, 3, 28));
  const [tripType, setTripType] = useState("round"); // round / one-way
  const [passengers, setPassengers] = useState("1 Adulto");
  const [cabinClass, setCabinClass] = useState("Econômica");

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

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSelectFlight = (flightCode: string, route: string, price: string) => {
    toast.success("Voo selecionado!", {
      description: `Voo ${flightCode} (${route}) adicionado ao seu rascunho por ${price}.`,
    });
  };

  const handleSearchFlights = () => {
    toast.success("Buscando voos...", {
      description: `Procurando conexões disponíveis de ${origin} para ${destination} em ${departDate ? departDate.toString() : ""}.`,
    });
  };

  // 1. RENDER BOOKINGS / SEARCH VIEW (Light Glassmorphic layout)
  if (activeTab === "bookings") {
    return (
      <div className="w-full flex flex-col gap-6 pb-8 text-slate-800">

        {/* Light Glass Banner with custom background */}
        <div className="rounded-[24px] px-6 pt-8 md:pt-14 pb-12 md:pb-24 lg:pb-30 relative overflow-hidden flex flex-col justify-start min-h-[250px] md:min-h-[340px] lg:min-h-[390px] shrink-0">
          {/* Background Image */}
          <img
            src="/images/banner-bg.png"
            alt="Banner Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <div className="z-10 flex flex-col justify-start max-w-[60%]">
            <span className="text-[10px] md:text-xs font-bold text-blue-700 tracking-widest uppercase">
              Quarta-feira, 24 de Março, 2026
            </span>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wide text-slate-900 uppercase leading-tight mt-1.5">
              Reserve sua Viagem
            </h1>
            <p className="text-[10px] md:text-xs text-slate-700 font-semibold mt-2 max-w-sm hidden sm:block">
              Encontre o jato executivo perfeito e programe a rota ideal para sua equipe corporativa.
            </p>
          </div>
        </div>

        {/* Flight Search Widget Card (Light Glassmorphic) */}
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-5 md:p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] border border-white/80 -mt-24 md:-mt-36 lg:-mt-44 mx-2 md:mx-6 z-10 relative flex flex-col gap-4">
          {/* Quick Selectors Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100/40">
            <ButtonGroup variant="secondary" size="sm" className="bg-slate-100/60 p-0.5 rounded-full border border-slate-200/30">
              <Button
                onClick={() => setTripType("round")}
                className={`rounded-full text-xs font-semibold px-4 h-7 min-w-0 transition-all ${
                  tripType === "round" ? "bg-white text-blue-600 shadow-xs" : "bg-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Ida e Volta
              </Button>
              <Button
                onClick={() => setTripType("one-way")}
                className={`rounded-full text-xs font-semibold px-4 h-7 min-w-0 transition-all ${
                  tripType === "one-way" ? "bg-white text-blue-600 shadow-xs" : "bg-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Somente Ida
              </Button>
            </ButtonGroup>

            <div className="flex items-center gap-2">
              {/* Passengers Selector */}
              <Select
                value={passengers}
                onChange={(val) => setPassengers(val as string)}
                className="w-[130px]"
                aria-label="Passageiros"
              >
                <Select.Trigger className="bg-white/50 text-xs font-semibold text-slate-700 border border-slate-200/50 rounded-full px-3.5 py-1.5 backdrop-blur-md flex items-center justify-between gap-1 cursor-pointer">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="1 Adulto" textValue="1 Adulto">
                      1 Adulto
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="2 Adultos" textValue="2 Adultos">
                      2 Adultos
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="5 Adultos" textValue="5 Adultos">
                      5 Adultos
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="Grupo Fretamento" textValue="Fretamento Completo">
                      Fretamento Completo
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              {/* Class Selector */}
              <Select
                value={cabinClass}
                onChange={(val) => setCabinClass(val as string)}
                className="w-[150px]"
                aria-label="Classe de Cabine"
              >
                <Select.Trigger className="bg-white/50 text-xs font-semibold text-slate-700 border border-slate-200/50 rounded-full px-3.5 py-1.5 backdrop-blur-md flex items-center justify-between gap-1 cursor-pointer">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="Econômica" textValue="Econômica">
                      Econômica
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="Executiva" textValue="Executiva">
                      Executiva
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="Primeira Classe" textValue="Primeira Classe">
                      Primeira Classe
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="VIP Lounge" textValue="Cabine Presidencial">
                      Cabine Presidencial
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          </div>

          {/* Input Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Origin Airport */}
            <div className="md:col-span-3 border border-slate-200/30 bg-white/40 rounded-2xl p-3 flex flex-col min-w-0 transition-all hover:bg-white/80 hover:border-slate-300">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Origem</span>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="text-sm font-medium text-slate-700 bg-transparent outline-none border-none p-0 w-full"
              />
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 justify-self-center z-10 shrink-0">
              <button
                onClick={handleSwapAirports}
                className="bg-white border border-slate-100 text-slate-400 hover:text-blue-500 hover:shadow-xs p-2.5 rounded-full transition-all flex items-center justify-center shadow-xs"
                title="Inverter aeroportos"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L17.5 12M21 7.5H7.5" />
                </svg>
              </button>
            </div>

            {/* Destination Airport */}
            <div className="md:col-span-3 border border-slate-200/30 bg-white/40 rounded-2xl p-3 flex flex-col min-w-0 transition-all hover:bg-white/80 hover:border-slate-300">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Destino</span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="text-sm font-medium text-slate-700 bg-transparent outline-none border-none p-0 w-full"
              />
            </div>

            {/* Departure Date */}
            {/* Departure Date */}
            <DatePicker 
              value={departDate} 
              onChange={setDepartDate} 
              className="md:col-span-2 flex flex-col min-w-0" 
              aria-label="Data de ida"
            >
              <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5 pl-3">Ida</Label>
              <DateField.Group className="border border-slate-200/30 bg-white/40 rounded-2xl p-3 flex items-center justify-between w-full h-[52px] hover:bg-white/80 hover:border-slate-300 transition-all">
                <DateField.Input>
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateField.Suffix>
                  <DatePicker.Trigger className="text-slate-400 hover:text-slate-600">
                    <DatePicker.TriggerIndicator />
                  </DatePicker.Trigger>
                </DateField.Suffix>
              </DateField.Group>
              <DatePicker.Popover>
                <Calendar aria-label="Data de ida">
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
                      {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                    </Calendar.GridHeader>
                    <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                  </Calendar.Grid>
                </Calendar>
              </DatePicker.Popover>
            </DatePicker>

            {/* Return Date */}
            <DatePicker 
              value={returnDate} 
              onChange={setReturnDate} 
              className="md:col-span-2 flex flex-col min-w-0" 
              aria-label="Data de volta"
            >
              <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5 pl-3">Volta</Label>
              <DateField.Group className="border border-slate-200/30 bg-white/40 rounded-2xl p-3 flex items-center justify-between w-full h-[52px] hover:bg-white/80 hover:border-slate-300 transition-all">
                <DateField.Input>
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateField.Suffix>
                  <DatePicker.Trigger className="text-slate-400 hover:text-slate-600">
                    <DatePicker.TriggerIndicator />
                  </DatePicker.Trigger>
                </DateField.Suffix>
              </DateField.Group>
              <DatePicker.Popover>
                <Calendar aria-label="Data de volta">
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
                      {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                    </Calendar.GridHeader>
                    <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                  </Calendar.Grid>
                </Calendar>
              </DatePicker.Popover>
            </DatePicker>

            {/* Search Button */}
            <div className="md:col-span-1 flex md:justify-end">
              <button
                onClick={handleSearchFlights}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0"
                title="Pesquisar voos"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Tag Buttons */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2.5 mt-1.5 custom-scrollbar -mx-2 px-2">
          <button className="bg-blue-50 border border-blue-100 text-blue-600 font-semibold px-4.5 py-2 rounded-2xl text-xs flex items-center gap-2 shrink-0 transition-all shadow-xs">
            <span className="w-4.5 h-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">+</span>
            Voos
          </button>
          {[
            { tag: "Histórico de voos", icon: "clock" },
            { tag: "Previsão do Clima", icon: "cloud-01" },
            { tag: "Al Roteamento", icon: "route" },
          ].map((item, idx) => (
            <button
              key={idx}
              className="bg-white/80 border border-slate-200/50 hover:border-slate-300 text-slate-500 hover:text-slate-800 px-4 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all shadow-xs flex items-center gap-2"
            >
              <SvgIcon name={item.icon} className="w-4 h-4 text-slate-400" />
              {item.tag}
            </button>
          ))}
        </div>

        {/* Main Grid: Flights list and Live Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Flight options list (Left Column) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-1.5 mt-1">
              <h2 className="text-xs font-bold text-slate-800 tracking-wider uppercase">
                Voos agendados
              </h2>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <span>Ordenar por:</span>
                <Select
                  defaultValue="Recomendados"
                  className="w-[140px]"
                  aria-label="Ordenar por"
                >
                  <Select.Trigger className="bg-white border border-slate-200/60 rounded-xl px-3 py-1.5 text-slate-700 font-bold flex items-center justify-between gap-1 cursor-pointer hover:border-slate-300 transition-colors">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="Recomendados" textValue="Recomendados">
                        Recomendados
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="Mais Baratos" textValue="Mais Baratos">
                        Mais Baratos
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="Mais Rápidos" textValue="Mais Rápidos">
                        Mais Rápidos
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>

            {/* Mock flight cards container (Light Glassmorphic list) */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] divide-y divide-slate-100/50 overflow-hidden">
              {[
                {
                  carrier: "VNMB Premium Jet",
                  code: "VA-001",
                  depTime: "08:45",
                  depPeriod: "AM",
                  arrTime: "17:15",
                  arrPeriod: "PM",
                  depCode: "GRU",
                  arrCode: "MIA",
                  depCity: "São Paulo",
                  arrCity: "Miami",
                  duration: "8h 30m",
                  stops: "Sem escalas",
                  price: "R$ 4.850,00"
                },
                {
                  carrier: "LATAM Executive",
                  code: "LA-4122",
                  depTime: "12:30",
                  depPeriod: "PM",
                  arrTime: "21:10",
                  arrPeriod: "PM",
                  depCode: "GRU",
                  arrCode: "MIA",
                  depCity: "São Paulo",
                  arrCity: "Miami",
                  duration: "8h 40m",
                  stops: "Sem escalas",
                  price: "R$ 5.210,00"
                },
                {
                  carrier: "American Premium",
                  code: "AA-9731",
                  depTime: "10:15",
                  depPeriod: "PM",
                  arrTime: "06:45",
                  arrPeriod: "AM",
                  depCode: "GRU",
                  arrCode: "MIA",
                  depCity: "São Paulo",
                  arrCity: "Miami",
                  duration: "8h 30m",
                  stops: "Sem escalas",
                  price: "R$ 4.390,00"
                }
              ].map((flight, idx) => (
                <div
                  key={idx}
                  className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-white/40 transition-colors"
                >
                  {/* Airline & Code */}
                  <div className="flex items-center gap-3.5 sm:w-1/4 shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50/50 text-blue-600 border border-blue-100/30 flex items-center justify-center shrink-0 shadow-xs">
                      <SvgIcon name="plane" className="w-5 h-5 rotate-45" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-800 truncate">{flight.carrier}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">{flight.code}</span>
                    </div>
                  </div>

                  {/* Times & Visual Flight Line */}
                  <div className="flex-1 flex items-center justify-center gap-6">
                    <div className="w-20">
                      <div className="text-lg font-bold text-slate-800 flex items-baseline gap-0.5">
                        {flight.depTime}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5">{flight.depCode}</div>
                      <div className="text-[10px] text-slate-400 font-medium truncate">{flight.depCity}</div>
                    </div>

                    {/* Flight line graphic */}
                    <div className="flex-1 flex flex-col items-center max-w-[150px] relative px-1">
                      <span className="text-[10px] text-slate-400 font-bold mb-2.5">{flight.duration}</span>
                      <div className="w-full h-[1.5px] bg-slate-200 relative flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 absolute left-0" />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 absolute right-0" />
                        <div className="absolute w-6 h-6 bg-white rounded-full shadow-xs flex items-center justify-center">
                          <SvgIcon name="plane" className="w-3.5 h-3.5 rotate-45 text-rose-500" />
                        </div>
                      </div>
                    </div>

                    <div className="w-20 text-right">
                      <div className="text-lg font-bold text-slate-800 flex items-baseline justify-end gap-0.5">
                        {flight.arrTime}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5">{flight.arrCode}</div>
                      <div className="text-[10px] text-slate-400 font-medium truncate">{flight.arrCity}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectFlight(flight.code, `${flight.depCode} → ${flight.arrCode}`, flight.price)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 h-9 rounded-xl transition-all shadow-xs active:scale-[0.97]"
                      >
                        Selecionar
                      </button>
                      <button className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors hidden sm:block">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Itinerary Preview (Right Column) */}
          <div className="lg:col-span-4 backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-6">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100/40">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Live Itinerary Preview</h3>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 tracking-wide bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                AO VIVO
              </div>
            </div>

            {/* Timeline Events list */}
            <div className="flex flex-col gap-6 relative pl-6 before:absolute before:left-[9px] before:top-2.5 before:bottom-2.5 before:w-[1.5px] before:bg-slate-100">
              {[
                {
                  date: "MAR 23 - ARRIVAL IN MIAMI (MIA)",
                  timeInfo: "Hangar Executivo FBO - 14:00",
                  state: "completed" // completed / active / future
                },
                {
                  date: "MAR 24 - ACCOMMODATION CHECK-IN",
                  timeInfo: "LAX Village Guesthouse - 16:30",
                  state: "completed"
                },
                {
                  date: "MAR 25 - DIA TOTALMENTE LIVRE",
                  timeInfo: "Reuniões e Network local",
                  state: "active"
                },
                {
                  date: "MAR 26 - VOO DE RETORNO (VA-002)",
                  timeInfo: "Miami (MIA) para São Paulo (GRU) - 13:00",
                  state: "future"
                }
              ].map((event, idx) => (
                <div key={idx} className="flex flex-col gap-1 relative">
                  {/* Timeline dot */}
                  {event.state === "completed" && (
                    <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                      ✓
                    </div>
                  )}
                  {event.state === "active" && (
                    <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center text-blue-600 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    </div>
                  )}
                  {event.state === "future" && (
                    <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full border-2 border-slate-200 bg-white shadow-xs" />
                  )}

                  <span className={`text-[10px] font-bold tracking-wide ${event.state === "completed" ? "text-blue-600" : "text-slate-800"}`}>
                    {event.date}
                  </span>
                  <span className="text-[10px] text-slate-500 font-light mt-0.5 leading-none">
                    {event.timeInfo}
                  </span>
                </div>
              ))}
            </div>

            {/* Complete Itinerary Link Button */}
            <button className="w-full border border-blue-100 hover:bg-blue-50/40 text-blue-600 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 bg-blue-50/10 active:scale-[0.98]">
              <span>Ver itinerário completo</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. RENDER FLIGHT CALENDAR VIEW (Light Glassmorphic layout)
  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800">

      {/* Top Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Bem-vindo de volta, John.</h1>
          <p className="text-slate-400 text-xs font-light mt-1">Aqui está o resumo dos voos da sua frota.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/?tab=bookings")}
            className="text-xs text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 px-4 py-2 rounded-full font-medium transition-all"
          >
            Pesquisar novos voos
          </button>
        </div>
      </header>

      {/* Upcoming Flights Row */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Próximos Voos</h2>
          <button className="text-xs text-slate-400 hover:text-slate-600 font-light transition-colors">
            Ver todos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { timeInfo: "Hoje • 14:00", route: "GRU → GIG", code: "VA-001" },
            { timeInfo: "Hoje • 16:30", route: "MCO → CGH", code: "VA-002" },
            { timeInfo: "Amanhã • 08:00", route: "VCP → MIA", code: "VA-001" },
            { timeInfo: "Amanhã • 11:45", route: "GIG → ORL", code: "VA-002" },
          ].map((flight, idx) => (
            <div
              key={idx}
              className="bg-white/60 border border-white/80 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/90 hover:border-slate-200 transition-all cursor-pointer shadow-xs"
              onClick={() => handleSelectFlight(flight.code, flight.route, "R$ 3.500,00")}
            >
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-500 border border-blue-100 shrink-0">
                <svg className="w-4.5 h-4.5 rotate-45" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-slate-400 font-semibold">{flight.timeInfo}</span>
                <span className="text-sm font-bold text-slate-800 truncate leading-tight mt-0.5">{flight.route}</span>
                <span className="text-[9px] text-slate-400 font-mono mt-0.5">{flight.code}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Calendar Widget */}
      <section className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl p-5 md:p-6 shadow-[0_10px_35px_-8px_rgba(79,119,186,0.03)]">
        {/* Calendar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-800">Calendário de Voos</h2>
            <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-200/50 ml-4">
              <button className="px-3.5 py-1.5 rounded-lg text-[10px] font-medium text-slate-600 hover:text-slate-800 hover:bg-white hover:shadow-xs transition-all">
                Hoje
              </button>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <button className="flex items-center gap-1 text-slate-800 hover:text-blue-600 font-semibold text-xs ml-2">
              <span>Maio 2024</span>
              <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <Button
            onPress={() => toast.success("Agendar voo aberto", { description: "Formulário de agendamento de fretamento carregado." })}
            className="bg-blue-600 text-white font-medium text-xs px-5 h-9 rounded-xl shadow-md shadow-blue-500/10 hover:bg-blue-500 transition-all"
          >
            + Agendar Voo
          </Button>
        </div>

        {/* Grid Header (Days of week) */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((item, index) => (
            <div
              key={index}
              className={`min-h-[92px] p-2 rounded-2xl flex flex-col justify-between transition-all border ${item.isCurrentMonth
                ? "bg-white/30 border-slate-200/40 hover:border-slate-300"
                : "opacity-25 bg-transparent border-transparent"
                } ${item.isToday ? "bg-blue-500/5 border-blue-300/30 shadow-xs" : ""}`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ${item.isToday ? "bg-blue-600 text-white" : "text-slate-500"
                    }`}
                >
                  {item.day}
                </span>
              </div>

              {/* Flight Info inside cell */}
              {item.flights &&
                item.flights.map((flight, fIdx) => (
                  <div
                    key={fIdx}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFlight(flight.code, flight.route, "Tarifa Interna");
                    }}
                    className="bg-blue-50 border border-blue-100 hover:bg-blue-100/80 text-blue-600 font-semibold rounded-xl p-1.5 mt-1 shadow-xs text-left cursor-pointer transition-all"
                  >
                    <div className="text-[9px] font-bold text-blue-700 leading-none mb-0.5">{flight.time}</div>
                    <div className="text-[9px] font-bold text-slate-800 leading-none truncate">{flight.route}</div>
                    <div className="text-[8px] text-slate-400 font-mono mt-0.5 leading-none">{flight.code}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="w-full flex items-center justify-center py-20 bg-white/40 rounded-3xl border border-slate-200/50 animate-pulse">
        <span className="text-slate-400 font-light text-sm">Carregando painel principal...</span>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
