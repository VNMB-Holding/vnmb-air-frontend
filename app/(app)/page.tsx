"use client";

import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  toast,
  Select,
  Label,
  ListBox,
  DatePicker,
  DateField,
  Calendar,
  Autocomplete,
  EmptyState,
  SearchField,
  useFilter,
  Card,
  Chip,
  Tooltip,
} from "@heroui/react";
import type { Key } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";
import { CalendarDate } from "@internationalized/date";

const airports = [
  { id: "GRU", name: "São Paulo (GRU)", code: "GRU", city: "São Paulo", country: "Brasil" },
  { id: "MIA", name: "Miami (MIA)", code: "MIA", city: "Miami", country: "Estados Unidos" },
  { id: "GIG", name: "Rio de Janeiro (GIG)", code: "GIG", city: "Rio de Janeiro", country: "Brasil" },
  { id: "MCO", name: "Orlando (MCO)", code: "MCO", city: "Orlando", country: "Estados Unidos" },
  { id: "BSB", name: "Brasília (BSB)", code: "BSB", city: "Brasília", country: "Brasil" },
  { id: "VCP", name: "Campinas (VCP)", code: "VCP", city: "Campinas", country: "Brasil" },
  { id: "JFK", name: "New York (JFK)", code: "JFK", city: "New York", country: "Estados Unidos" },
  { id: "LIS", name: "Lisboa (LIS)", code: "LIS", city: "Lisboa", country: "Portugal" },
];

const aircraftFleet = [
  { id: "g650", name: "Gulfstream G650ER", range: 13900 },
  { id: "global7500", name: "Bombardier Global 7500", range: 14260 },
  { id: "phenom300", name: "Embraer Phenom 300E", range: 3720 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("voos");
  const [originKey, setOriginKey] = useState<Key | null>("GRU");
  const [destinationKey, setDestinationKey] = useState<Key | null>("MIA");
  const [departDate, setDepartDate] = useState<CalendarDate | null>(new CalendarDate(2026, 3, 24));
  const [returnDate, setReturnDate] = useState<CalendarDate | null>(new CalendarDate(2026, 3, 28));
  const [tripType, setTripType] = useState("round");
  const [sortBy, setSortBy] = useState<Key>("Recomendados");
  const [isSearching, setIsSearching] = useState(false);

  // States for AI Routing simulation
  const [routeOrigin, setRouteOrigin] = useState<Key | null>("GRU");
  const [routeDest, setRouteDest] = useState<Key | null>("MIA");
  const [routeAircraft, setRouteAircraft] = useState<Key | null>("phenom300");
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<any>(null);

  const { contains } = useFilter({ sensitivity: "base" });

  const handleSwapAirports = () => {
    const temp = originKey;
    setOriginKey(destinationKey);
    setDestinationKey(temp);
  };

  const handleSelectFlight = (flightCode: string, route: string, price: string) => {
    toast.success("Voo selecionado!", {
      description: `Voo ${flightCode} (${route}) adicionado ao seu rascunho por ${price}.`,
    });
  };

  const handleSearchFlights = () => {
    const orig = airports.find(a => a.id === originKey)?.name || "";
    const dest = airports.find(a => a.id === destinationKey)?.name || "";
    setIsSearching(true);
    toast.success("Buscando voos...", {
      description: `Procurando conexões disponíveis de ${orig} para ${dest} em ${departDate ? departDate.toString() : ""}.`,
    });
  };

  // AI Routing Logic
  const handleCalculateRoute = () => {
    if (!routeOrigin || !routeDest || !routeAircraft) {
      toast.error("Por favor, preencha todos os campos para o roteamento.");
      return;
    }

    setIsRoutingLoading(true);
    setRouteResult(null);

    setTimeout(() => {
      const origItem = airports.find(a => a.id === routeOrigin);
      const destItem = airports.find(a => a.id === routeDest);
      const acItem = aircraftFleet.find(a => a.id === routeAircraft);

      if (!origItem || !destItem || !acItem) return;

      // Distance mock (GRU -> MIA is approx 6500km)
      let baseDistance = 6500;
      if (
        (routeOrigin === "GRU" && routeDest === "GIG") ||
        (routeOrigin === "GIG" && routeDest === "GRU")
      ) {
        baseDistance = 360;
      } else if (
        (routeOrigin === "GRU" && routeDest === "BSB") ||
        (routeOrigin === "BSB" && routeDest === "GRU")
      ) {
        baseDistance = 880;
      }

      // Check if distance exceeds aircraft range
      const needsRefuel = baseDistance > acItem.range;
      const legs = [];

      if (needsRefuel) {
        // Recommend MCO or LIS as intermediate stop depending on routes
        const stop = "MCO";
        legs.push({ from: origItem.code, to: stop, dist: Math.round(baseDistance * 0.8), time: "6h 15m", status: "Recomendado para Reabastecimento" });
        legs.push({ from: stop, to: destItem.code, dist: Math.round(baseDistance * 0.2), time: "1h 45m", status: "Leg Final" });
      } else {
        const estTimeHours = Math.floor(baseDistance / 800);
        const estTimeMin = Math.round(((baseDistance / 800) % 1) * 60);
        legs.push({ from: origItem.code, to: destItem.code, dist: baseDistance, time: `${estTimeHours}h ${estTimeMin}m`, status: "Voo Direto" });
      }

      const totalTime = legs.reduce((acc, leg) => acc + (leg.from ? 7 : 0), 0); // Simulated total hours
      const fuelConsumption = Math.round(baseDistance * 4.2); // Simulated fuel

      setRouteResult({
        aircraftName: acItem.name,
        distance: baseDistance,
        needsRefuel,
        legs,
        totalTime: needsRefuel ? "8h 30m total" : `${Math.floor(baseDistance / 800)}h ${Math.round(((baseDistance / 800) % 1) * 60)}m total`,
        fuel: `${fuelConsumption.toLocaleString()} L`,
        efficiency: needsRefuel ? "Eficiência Regular (Devido à escala de reabastecimento)" : "Alta Eficiência (Voo Direto Otimizado)",
        co2: `${Math.round(fuelConsumption * 2.5)} kg CO2`,
      });

      setIsRoutingLoading(false);
      toast.success("Rota otimizada pela IA com sucesso!");
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-8 text-slate-800 animate-fade-in">
      {/* Premium Glass Banner with custom background */}
      <div className="rounded-[24px] px-8 pt-8 md:pt-12 pb-12 md:pb-24 relative overflow-hidden flex flex-col justify-start min-h-[220px] md:min-h-[280px] shrink-0 shadow-sm">
        {/* Background Image */}
        <img
          src="/images/banner-bg.png"
          alt="Banner Background"
          className="absolute inset-0 w-full h-full object-cover z-0 animate-fade-in filter brightness-95"
        />

        <div className="z-10 flex flex-col justify-start max-w-[60%]">
          <span className="text-[10px] md:text-xs font-bold text-blue-700 tracking-widest uppercase">
            Quarta-feira, 24 de Março, 2026
          </span>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-wide text-slate-900 uppercase leading-tight mt-1.5">
            Portal Executivo VNMB
          </h1>
          <p className="text-[10px] md:text-xs text-slate-700 font-semibold mt-2 max-w-sm hidden sm:block">
            Gerenciamento de frota corporativa, rotas otimizadas por IA e monitoramento meteorológico em tempo real.
          </p>
        </div>
      </div>

      {/* Flight Search Widget Card */}
      <Card className="backdrop-blur-xl bg-white/60 rounded-3xl p-5 md:p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] border border-white/80 -mt-16 md:-mt-24 mx-2 md:mx-6 z-10 relative flex flex-col gap-4">
        {/* Quick Selectors Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100/40">
          <div className="flex gap-2 p-0.5 bg-slate-100/60 rounded-full border border-slate-200/30">
            <button
              onClick={() => setTripType("round")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tripType === "round" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
            >
              Ida e Volta
            </button>
            <button
              onClick={() => setTripType("one-way")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${tripType === "one-way" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
            >
              Somente Ida
            </button>
          </div>
          {isSearching && (
            <Button
              size="sm"
              variant="light"
              className="text-slate-400 hover:text-blue-500 text-xs font-bold"
              onClick={() => setIsSearching(false)}
            >
              Limpar Busca
            </Button>
          )}
        </div>

        {/* Input Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Origin Autocomplete */}
          <div className="md:col-span-3 flex flex-col min-w-0">
            <Autocomplete
              placeholder="Selecione origem"
              selectionMode="single"
              value={originKey}
              onChange={setOriginKey}
              className="w-full"
            >
              <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1 pl-3">Origem</Label>
              <Autocomplete.Trigger className="bg-white border border-slate-200/40 rounded-2xl p-3 flex items-center justify-between w-full h-[52px] hover:border-slate-200/80 transition-all text-xs font-semibold text-slate-700">
                <Autocomplete.Value>
                  {({ defaultChildren, isPlaceholder, state }) => {
                    if (isPlaceholder || state.selectedItems.length === 0) return defaultChildren;
                    const selectedItem = airports.find((airport) => airport.id === state.selectedItems[0]?.key);
                    return selectedItem ? <span className="font-bold text-slate-700">{selectedItem.name}</span> : defaultChildren;
                  }}
                </Autocomplete.Value>
                <div className="flex items-center gap-2.5 text-slate-400 shrink-0">
                  <Autocomplete.ClearButton className="hover:text-slate-600 transition-colors" />
                  <Autocomplete.Indicator className="hover:text-slate-600 transition-colors" />
                </div>
              </Autocomplete.Trigger>
              <Autocomplete.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                <Autocomplete.Filter filter={contains}>
                  <SearchField autoFocus name="search" variant="secondary" className="p-2 border-b border-slate-100/50">
                    <SearchField.Group className="bg-slate-100/60 rounded-xl px-3 py-1.5 flex items-center gap-2">
                      <SearchField.SearchIcon className="text-slate-400 w-4 h-4" />
                      <SearchField.Input placeholder="Buscar aeroporto..." className="text-xs bg-transparent outline-none flex-grow" />
                      <SearchField.ClearButton />
                    </SearchField.Group>
                  </SearchField>
                  <ListBox renderEmptyState={() => <EmptyState className="p-4 text-center text-xs text-slate-400">Nenhum aeroporto encontrado</EmptyState>} className="max-h-[200px] overflow-y-auto p-1">
                    {airports.map((airport) => (
                      <ListBox.Item key={airport.id} id={airport.id} textValue={airport.name} className="px-3 py-2 rounded-xl text-xs flex flex-col items-start gap-0.5 hover:bg-blue-50/50 cursor-pointer transition-all">
                        <span className="font-bold text-slate-700">{airport.name}</span>
                        <span className="text-[10px] text-slate-400">{airport.city}, {airport.country}</span>
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Autocomplete.Filter>
              </Autocomplete.Popover>
            </Autocomplete>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 justify-self-center z-10 shrink-0 flex items-center justify-center h-[52px] mt-3 md:mt-0">
            <Button
              isIconOnly
              onClick={handleSwapAirports}
              variant="flat"
              className="bg-white border border-slate-200/40 text-slate-400 hover:text-blue-500 hover:bg-slate-50 hover:border-slate-200/80 w-11 h-11 rounded-full transition-all flex items-center justify-center min-w-0"
              title="Inverter aeroportos"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L17.5 12M21 7.5H7.5" />
              </svg>
            </Button>
          </div>

          {/* Destination Autocomplete */}
          <div className="md:col-span-3 flex flex-col min-w-0">
            <Autocomplete
              placeholder="Selecione destino"
              selectionMode="single"
              value={destinationKey}
              onChange={setDestinationKey}
              className="w-full"
            >
              <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1 pl-3">Destino</Label>
              <Autocomplete.Trigger className="bg-white border border-slate-200/40 rounded-2xl p-3 flex items-center justify-between w-full h-[52px] hover:border-slate-200/80 transition-all text-xs font-semibold text-slate-700">
                <Autocomplete.Value>
                  {({ defaultChildren, isPlaceholder, state }) => {
                    if (isPlaceholder || state.selectedItems.length === 0) return defaultChildren;
                    const selectedItem = airports.find((airport) => airport.id === state.selectedItems[0]?.key);
                    return selectedItem ? <span className="font-bold text-slate-700">{selectedItem.name}</span> : defaultChildren;
                  }}
                </Autocomplete.Value>
                <div className="flex items-center gap-2.5 text-slate-400 shrink-0">
                  <Autocomplete.ClearButton className="hover:text-slate-600 transition-colors" />
                  <Autocomplete.Indicator className="hover:text-slate-600 transition-colors" />
                </div>
              </Autocomplete.Trigger>
              <Autocomplete.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                <Autocomplete.Filter filter={contains}>
                  <SearchField autoFocus name="search" variant="secondary" className="p-2 border-b border-slate-100/50">
                    <SearchField.Group className="bg-slate-100/60 rounded-xl px-3 py-1.5 flex items-center gap-2">
                      <SearchField.SearchIcon className="text-slate-400 w-4 h-4" />
                      <SearchField.Input placeholder="Buscar aeroporto..." className="text-xs bg-transparent outline-none flex-grow" />
                      <SearchField.ClearButton />
                    </SearchField.Group>
                  </SearchField>
                  <ListBox renderEmptyState={() => <EmptyState className="p-4 text-center text-xs text-slate-400">Nenhum aeroporto encontrado</EmptyState>} className="max-h-[200px] overflow-y-auto p-1">
                    {airports.map((airport) => (
                      <ListBox.Item key={airport.id} id={airport.id} textValue={airport.name} className="px-3 py-2 rounded-xl text-xs flex flex-col items-start gap-0.5 hover:bg-blue-50/50 cursor-pointer transition-all">
                        <span className="font-bold text-slate-700">{airport.name}</span>
                        <span className="text-[10px] text-slate-400">{airport.city}, {airport.country}</span>
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Autocomplete.Filter>
              </Autocomplete.Popover>
            </Autocomplete>
          </div>

          {/* Departure Date */}
          <DatePicker
            value={departDate}
            onChange={setDepartDate}
            className="md:col-span-2 flex flex-col min-w-0"
            aria-label="Data de ida"
          >
            <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1 pl-3">Ida</Label>
            <DateField.Group className="bg-white border border-slate-200/40 rounded-2xl p-3 flex items-center justify-between w-full h-[52px] hover:border-slate-200/80 transition-all">
              <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
              <DateField.Suffix>
                <DatePicker.Trigger className="text-slate-400 hover:text-slate-600">
                  <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <DatePicker.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
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
                    {(day) => <Calendar.HeaderCell className="text-slate-400 font-bold text-xs">{day}</Calendar.HeaderCell>}
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
            <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1 pl-3">Volta</Label>
            <DateField.Group className="bg-white border border-slate-200/40 rounded-2xl p-3 flex items-center justify-between w-full h-[52px] hover:border-slate-200/80 transition-all">
              <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
              <DateField.Suffix>
                <DatePicker.Trigger className="text-slate-400 hover:text-slate-600">
                  <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <DatePicker.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
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
                    {(day) => <Calendar.HeaderCell className="text-slate-400 font-bold text-xs">{day}</Calendar.HeaderCell>}
                  </Calendar.GridHeader>
                  <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                </Calendar.Grid>
              </Calendar>
            </DatePicker.Popover>
          </DatePicker>

          {/* Search Button */}
          <div className="md:col-span-1 flex md:justify-end mt-4 md:mt-0">
            <Button
              onClick={handleSearchFlights}
              className="w-[52px] h-[52px] bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0 min-w-0"
              title="Pesquisar voos"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Button>
          </div>
        </div>
      </Card>

      {/* Dynamic Sub-Navigation Tabs governed by the custom ButtonGroup */}
      <div className="flex items-center overflow-x-auto pb-2 mt-2 custom-scrollbar -mx-2 px-2 shrink-0">
        <ButtonGroup variant="secondary" className="bg-white/90 border border-slate-200/50 p-1.5 rounded-full flex gap-1.5 shadow-sm">
          <Button
            size="sm"
            onClick={() => setActiveTab("voos")}
            className={`rounded-full text-xs font-bold flex items-center gap-2 h-9 px-4 cursor-pointer transition-all active:scale-[0.97] ${activeTab === "voos"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
          >
            <SvgIcon name="plane" className={`w-4 h-4 ${activeTab === "voos" ? "text-white" : "text-slate-400"}`} />
            Voos
          </Button>

          {[
            { id: "historico", tag: "Histórico de voos", icon: "clock" },
            { id: "clima", tag: "Previsão do Clima", icon: "cloud-01" },
            { id: "roteamento", tag: "AI Roteamento", icon: "route" },
          ].map((item) => (
            <Button
              key={item.id}
              size="sm"
              onClick={() => setActiveTab(item.id)}
              className={`rounded-full text-xs font-bold flex items-center gap-2 h-9 px-4 cursor-pointer transition-all active:scale-[0.97] ${activeTab === item.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
            >
              <SvgIcon name={item.icon} className={`w-4 h-4 ${activeTab === item.id ? "text-white" : "text-slate-400"}`} />
              {item.tag}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Main Layout Grid (Active Tab Content vs. Control Center Side Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
        {/* Left Column: Dynamic Panels */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* TAB 1: FLIGHTS & SEARCH RESULTS */}
          {activeTab === "voos" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/40">
                <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  {isSearching ? "Resultados da Busca" : "Painel Operacional - Voos Programados"}
                </h2>
                {isSearching && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>Ordenar por:</span>
                    <Select
                      value={sortBy}
                      onChange={(key) => setSortBy(key as Key)}
                      className="w-[140px]"
                      aria-label="Ordenar por"
                    >
                      <Select.Trigger className="bg-white border border-slate-200/30 rounded-full px-3 py-1 text-slate-700 font-bold flex items-center justify-between gap-1 hover:border-slate-200/80 transition-colors text-xs h-7">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                        <ListBox>
                          <ListBox.Item id="Recomendados" textValue="Recomendados">Recomendados</ListBox.Item>
                          <ListBox.Item id="Mais Baratos" textValue="Mais Baratos">Mais Baratos</ListBox.Item>
                          <ListBox.Item id="Mais Rápidos" textValue="Mais Rápidos">Mais Rápidos</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                )}
              </div>

              {/* SEARCH RESULTS VIEW */}
              {isSearching ? (
                <div className="flex flex-col gap-4">
                  {[
                    {
                      carrier: "VNMB Premium Jet",
                      code: "VA-001",
                      depTime: "08:45 AM",
                      arrTime: "17:15 PM",
                      depCode: originKey?.toString() || "GRU",
                      arrCode: destinationKey?.toString() || "MIA",
                      depCity: airports.find(a => a.id === originKey)?.city || "São Paulo",
                      arrCity: airports.find(a => a.id === destinationKey)?.city || "Miami",
                      duration: "8h 30m",
                      stops: "Sem escalas",
                      price: "R$ 4.850,00",
                      ac: "Gulfstream G650ER",
                    },
                    {
                      carrier: "LATAM Executive",
                      code: "LA-4122",
                      depTime: "12:30 PM",
                      arrTime: "21:10 PM",
                      depCode: originKey?.toString() || "GRU",
                      arrCode: destinationKey?.toString() || "MIA",
                      depCity: airports.find(a => a.id === originKey)?.city || "São Paulo",
                      arrCity: airports.find(a => a.id === destinationKey)?.city || "Miami",
                      duration: "8h 40m",
                      stops: "Sem escalas",
                      price: "R$ 5.210,00",
                      ac: "Bombardier Global 7500",
                    },
                    {
                      carrier: "American Premium",
                      code: "AA-9731",
                      depTime: "10:15 PM",
                      arrTime: "06:45 AM",
                      depCode: originKey?.toString() || "GRU",
                      arrCode: destinationKey?.toString() || "MIA",
                      depCity: airports.find(a => a.id === originKey)?.city || "São Paulo",
                      arrCity: airports.find(a => a.id === destinationKey)?.city || "Miami",
                      duration: "8h 30m",
                      stops: "Sem escalas",
                      price: "R$ 4.390,00",
                      ac: "Boeing 777 Executive",
                    }
                  ].map((flight, idx) => (
                    <Card
                      key={idx}
                      className="bg-white/60 border border-white/80 rounded-2xl p-5 hover:bg-white/95 transition-all shadow-[0_4px_24px_-4px_rgba(79,119,186,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(79,119,186,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      {/* Carrier Details */}
                      <div className="flex items-center gap-4 md:w-1/4">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/50 flex items-center justify-center shrink-0">
                          <SvgIcon name="plane" className="w-5 h-5 rotate-45" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-800 truncate">{flight.carrier}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{flight.code} • {flight.ac}</span>
                        </div>
                      </div>

                      {/* Flight Path Graphic */}
                      <div className="flex-grow flex items-center justify-center gap-6">
                        <div className="w-20">
                          <div className="text-base font-bold text-slate-800">{flight.depTime}</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">{flight.depCode} • {flight.depCity}</div>
                        </div>

                        <div className="flex-grow flex flex-col items-center max-w-[160px] relative px-1">
                          <span className="text-[9px] text-slate-400 font-bold mb-1.5">{flight.duration}</span>
                          <div className="w-full h-[1.5px] bg-slate-200 relative flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 absolute left-0" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 absolute right-0" />
                            <div className="absolute w-5 h-5 bg-white border border-slate-200/50 rounded-full flex items-center justify-center shadow-xs">
                              <SvgIcon name="plane" className="w-3 h-3 rotate-45 text-blue-600" />
                            </div>
                          </div>
                          <span className="text-[8px] text-emerald-600 font-bold mt-1.5 tracking-wide uppercase">{flight.stops}</span>
                        </div>

                        <div className="w-20 text-right">
                          <div className="text-base font-bold text-slate-800">{flight.arrTime}</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">{flight.arrCode} • {flight.arrCity}</div>
                        </div>
                      </div>

                      {/* Select Flight Action */}
                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100/50 pt-3 md:pt-0">
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-blue-900">{flight.price}</span>
                          <p className="text-[8px] text-slate-400 tracking-wider">PREÇO ÚNICO FRETAMENTO</p>
                        </div>
                        <Button
                          onClick={() => handleSelectFlight(flight.code, `${flight.depCode} → ${flight.arrCode}`, flight.price)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-xs text-xs"
                        >
                          Selecionar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                /* DEFAULT ACTIVE SCHEDULED FLIGHTS DASHBOARD */
                <div className="flex flex-col gap-4">
                  {[
                    {
                      id: "VA-102",
                      origin: "São Paulo (GRU)",
                      dest: "Rio de Janeiro (GIG)",
                      aircraft: "Gulfstream G650ER",
                      registration: "PR-VNM",
                      status: "Em Voo",
                      statusColor: "primary",
                      progress: 68,
                      pilot: "Capt. Carlos Silva",
                      depTime: "09:20",
                      arrTime: "10:15",
                      weather: "Limpo • 22°C",
                      impact: "Sem impacto",
                    },
                    {
                      id: "VA-205",
                      origin: "Miami (MIA)",
                      dest: "Orlando (MCO)",
                      aircraft: "Embraer Phenom 300E",
                      registration: "PR-FLT",
                      status: "Aguardando Embarque",
                      statusColor: "warning",
                      progress: 0,
                      pilot: "Copiloto Lucas Costa",
                      depTime: "11:30",
                      arrTime: "12:15",
                      weather: "Chuva Leve • 26°C",
                      impact: "Atraso estimado: 10m",
                    },
                    {
                      id: "VA-091",
                      origin: "Lisboa (LIS)",
                      dest: "New York (JFK)",
                      aircraft: "Bombardier Global 7500",
                      registration: "PR-AIR",
                      status: "Em Solo (Preparação)",
                      statusColor: "default",
                      progress: 25,
                      pilot: "Capt. Ana Oliveira",
                      depTime: "14:00",
                      arrTime: "21:30",
                      weather: "Parcialmente Nublado • 18°C",
                      impact: "Nenhum",
                    }
                  ].map((flight) => (
                    <Card
                      key={flight.id}
                      className="bg-white/60 border border-white/80 rounded-2xl p-5 hover:bg-white/85 transition-all shadow-[0_4px_24px_-4px_rgba(79,119,186,0.04)] flex flex-col gap-4"
                    >
                      {/* Flight Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-100/50">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/40">
                            {flight.id}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{flight.aircraft} ({flight.registration})</span>
                        </div>
                        <Chip
                          color={flight.statusColor as "primary" | "warning" | "default"}
                          variant="flat"
                          size="sm"
                          className="font-bold text-[10px] uppercase h-5 min-w-0"
                        >
                          {flight.status}
                        </Chip>
                      </div>

                      {/* Flight Route, Weather Info and Times */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rota</span>
                          <span className="text-sm font-extrabold text-slate-700 mt-0.5">{flight.origin} → {flight.dest}</span>
                          <span className="text-[11px] text-slate-500 font-light mt-1 flex items-center gap-1">
                            <SvgIcon name="user-01" className="w-3.5 h-3.5 text-slate-400" />
                            {flight.pilot}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Horários Previstos</span>
                          <span className="text-sm font-extrabold text-slate-700 mt-0.5">{flight.depTime} → {flight.arrTime}</span>
                          <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                            <SvgIcon name="clock" className="w-3.5 h-3.5 text-slate-400" />
                            Hora Local UTC-3
                          </span>
                        </div>

                        <div className="flex flex-col bg-slate-50/60 border border-slate-100 rounded-xl p-2.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Meteorologia Destino</span>
                          <span className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                            <SvgIcon name="cloud-01" className="w-3.5 h-3.5 text-blue-500" />
                            {flight.weather}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium mt-1 truncate">{flight.impact}</span>
                        </div>
                      </div>

                      {/* Flight Live Progress Bar (if in flight or in prep) */}
                      <div className="flex flex-col gap-1.5 mt-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                          <span>Status da Preparação / Rota</span>
                          <span>{flight.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/10">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${flight.progress}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FLIGHT HISTORY */}
          {activeTab === "historico" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/40">
                <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Histórico de Voos Realizados
                </h2>
                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full border border-slate-200/40">
                  Total de 142 horas de voo logadas
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { id: "H-882", route: "Miami (MIA) → São Paulo (GRU)", date: "22/03/2026", ac: "Gulfstream G650ER", time: "8h 15m", fuel: "32.400 L", pilot: "Capt. Ana Oliveira", status: "Concluído" },
                  { id: "H-881", route: "New York (JFK) → Miami (MIA)", date: "20/03/2026", ac: "Bombardier Global 7500", time: "2h 45m", fuel: "11.100 L", pilot: "Capt. Carlos Silva", status: "Concluído" },
                  { id: "H-880", route: "Brasília (BSB) → São Paulo (GRU)", date: "18/03/2026", ac: "Embraer Phenom 300E", time: "1h 10m", fuel: "3.200 L", pilot: "Copiloto Lucas Costa", status: "Concluído" },
                  { id: "H-879", route: "São Paulo (GRU) → Lisboa (LIS)", date: "15/03/2026", ac: "Bombardier Global 7500", time: "9h 30m", fuel: "41.000 L", pilot: "Capt. Ana Oliveira", status: "Concluído" },
                ].map((log) => (
                  <Card
                    key={log.id}
                    className="bg-white/60 border border-white/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/95 transition-all shadow-[0_2px_12px_rgba(79,119,186,0.02)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 border border-slate-200/50 flex items-center justify-center shrink-0">
                        <SvgIcon name="clock" className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-slate-800">{log.route}</span>
                          <span className="text-[9px] bg-slate-100 border border-slate-200/50 text-slate-500 font-mono px-1.5 py-0.5 rounded">
                            {log.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                          <span>{log.date}</span>
                          <span>•</span>
                          <span>Aeronave: {log.ac}</span>
                          <span>•</span>
                          <span>Piloto: {log.pilot}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-100/50 pt-3 sm:pt-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700">{log.time}</span>
                        <p className="text-[10px] text-slate-400">Consumo: {log.fuel}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip color="success" size="sm" variant="flat" className="font-bold text-[9px] h-5 min-w-0">
                          {log.status}
                        </Chip>
                        <Tooltip content="Baixar relatório de voo">
                          <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-blue-500 rounded-lg min-w-0 w-8 h-8">
                            <SvgIcon name="download-01" className="w-4 h-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WEATHER FORECAST */}
          {activeTab === "clima" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/40">
                <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Monitor Meteorológico - Hubs de Aviação
                </h2>
                <span className="text-xs text-slate-500 font-medium">Atualizado há 5 minutos</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { hub: "São Paulo (GRU)", temp: "22°C", cond: "Limpo", wind: "12 kt NE", vis: "> 10 km", runway: "Seca", impact: "Excelente", impactColor: "success" },
                  { hub: "Miami (MIA)", temp: "28°C", cond: "Chuva Isolada", wind: "18 kt SE", vis: "8 km", runway: "Molhada", impact: "Atenção Média", impactColor: "warning" },
                  { hub: "Rio de Janeiro (GIG)", temp: "25°C", cond: "Parcialmente Nublado", wind: "8 kt S", vis: "> 10 km", runway: "Seca", impact: "Excelente", impactColor: "success" },
                  { hub: "Lisboa (LIS)", temp: "19°C", cond: "Nublado", wind: "14 kt NW", vis: "9 km", runway: "Seca", impact: "Excelente", impactColor: "success" },
                  { hub: "New York (JFK)", temp: "11°C", cond: "Nevoeiro Matinal", wind: "5 kt W", vis: "3 km", runway: "Úmida", impact: "Impacto Baixo (Visibilidade)", impactColor: "warning" },
                  { hub: "Brasília (BSB)", temp: "24°C", cond: "Limpo", wind: "10 kt E", vis: "> 10 km", runway: "Seca", impact: "Excelente", impactColor: "success" }
                ].map((weather, idx) => (
                  <Card
                    key={idx}
                    className="bg-white/60 border border-white/80 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-[0_4px_24px_-4px_rgba(79,119,186,0.02)]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{weather.hub}</h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">METAR Ativo</p>
                      </div>
                      <Chip color={weather.impactColor as "success" | "warning"} variant="flat" size="sm" className="font-bold text-[9px] h-5 min-w-0">
                        {weather.impact}
                      </Chip>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-b border-slate-100/50 py-3 bg-slate-50/20 px-3 rounded-xl">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Temperatura</span>
                        <div className="text-base font-extrabold text-slate-700 mt-0.5 flex items-center gap-1.5">
                          <SvgIcon name="sun" className="w-4 h-4 text-amber-500 animate-pulse" />
                          {weather.temp} ({weather.cond})
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Ventos</span>
                        <p className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                          <SvgIcon name="activity" className="w-3.5 h-3.5 text-blue-500" />
                          {weather.wind}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Visibilidade: <strong>{weather.vis}</strong></span>
                      <span>Pista: <strong>{weather.runway}</strong></span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AI ROUTING */}
          {activeTab === "roteamento" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/40">
                <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  Otimização de Rota por Inteligência Artificial
                </h2>
                <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  IA ativa
                </span>
              </div>

              <Card className="bg-white/60 border border-white/80 rounded-2xl p-5 flex flex-col gap-4 shadow-[0_4px_24px_-4px_rgba(79,119,186,0.02)]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Aeroporto de Origem</label>
                    <Select
                      value={routeOrigin}
                      onChange={(key) => setRouteOrigin(key as Key)}
                      aria-label="Origem Rota"
                    >
                      <Select.Trigger className="bg-white border border-slate-200/40 rounded-xl px-3 py-2 text-slate-700 font-semibold flex items-center justify-between gap-1 hover:border-slate-200/80 transition-colors text-xs h-11">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                        <ListBox>
                          {airports.map(a => <ListBox.Item key={a.id} id={a.id}>{a.name}</ListBox.Item>)}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Aeroporto de Destino</label>
                    <Select
                      value={routeDest}
                      onChange={(key) => setRouteDest(key as Key)}
                      aria-label="Destino Rota"
                    >
                      <Select.Trigger className="bg-white border border-slate-200/40 rounded-xl px-3 py-2 text-slate-700 font-semibold flex items-center justify-between gap-1 hover:border-slate-200/80 transition-colors text-xs h-11">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                        <ListBox>
                          {airports.map(a => <ListBox.Item key={a.id} id={a.id}>{a.name}</ListBox.Item>)}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Aeronave Escalada</label>
                    <Select
                      value={routeAircraft}
                      onChange={(key) => setRouteAircraft(key as Key)}
                      aria-label="Aeronave Rota"
                    >
                      <Select.Trigger className="bg-white border border-slate-200/40 rounded-xl px-3 py-2 text-slate-700 font-semibold flex items-center justify-between gap-1 hover:border-slate-200/80 transition-colors text-xs h-11">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                        <ListBox>
                          {aircraftFleet.map(ac => (
                            <ListBox.Item key={ac.id} id={ac.id} textValue={ac.name}>
                              <div className="flex flex-col">
                                <span className="font-bold text-xs">{ac.name}</span>
                                <span className="text-[9px] text-slate-400">Alcance: {ac.range.toLocaleString()} km</span>
                              </div>
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleCalculateRoute}
                  isLoading={isRoutingLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 mt-2"
                >
                  <SvgIcon name="route" className="w-4 h-4 text-white" />
                  <span>Otimizar Rota por IA</span>
                </Button>
              </Card>

              {/* ROUTE CALCULATION DISPLAY RESULT */}
              {routeResult && (
                <Card className="bg-white border border-slate-200/40 rounded-2xl p-5 flex flex-col gap-5 shadow-[0_4px_24px_-4px_rgba(79,119,186,0.04)] animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Resultado do Plano de Voo Inteligente</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Operado por {routeResult.aircraftName}</p>
                    </div>
                    <Chip color="success" size="sm" variant="flat" className="font-bold text-[9px] uppercase">
                      Rota Gerada
                    </Chip>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Distância Total</span>
                      <span className="text-sm font-extrabold text-slate-700 mt-0.5">{routeResult.distance.toLocaleString()} km</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Tempo de Voo Estimado</span>
                      <span className="text-sm font-extrabold text-slate-700 mt-0.5">{routeResult.totalTime}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Combustível Otimizado</span>
                      <span className="text-sm font-extrabold text-slate-700 mt-0.5">{routeResult.fuel}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Redução de Emissões</span>
                      <span className="text-sm font-extrabold text-emerald-600 mt-0.5">{routeResult.co2}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-100/50 p-4 rounded-xl flex flex-col gap-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Passos das Pernas de Voo</span>
                    <div className="flex flex-col gap-3 relative pl-6 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200">
                      {routeResult.legs.map((leg: any, idx: number) => (
                        <div key={idx} className="flex flex-col relative gap-1">
                          <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center text-[9px] font-bold">
                            {idx + 1}
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            Perna {idx + 1}: {leg.from} → {leg.to} ({leg.dist} km)
                          </span>
                          <span className="text-[10px] text-slate-500 font-light leading-none">
                            Tempo estimado: {leg.time} • Status: {leg.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-emerald-50/50 border border-emerald-100/30 p-2.5 rounded-xl">
                    <SvgIcon name="check-circle" className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Nota da IA:</strong> {routeResult.efficiency} com base no vento em altitude média e reserva obrigatória de combustível regulamentada.</span>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Control Center Side Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/40">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <SvgIcon name="activity" className="w-4 h-4 text-blue-600 animate-pulse" />
                Central de Controle Operacional
              </h3>
              <Chip
                color="success"
                variant="flat"
                size="sm"
                startContent={<span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping mr-1" />}
                className="font-bold text-[9px] border border-emerald-100/50 h-5"
              >
                ATIVO
              </Chip>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { title: "Frota Ativa", value: "3 Aeronaves", desc: "100% da frota operacional", icon: "plane" },
                { title: "Pilotos Escalados", value: "3 Operacionais", desc: "Nenhuma pendência médica", icon: "user-01" },
                { title: "Meta de Eficiência", value: "98.4%", desc: "+1.2% otimização por IA", icon: "activity" },
                { title: "Próximo Pouso", value: "10:15 - GIG", desc: "Voo VA-102 (PR-VNM)", icon: "clock" },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/70 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-blue-50/50 text-blue-600 border border-blue-100/30 flex items-center justify-center shrink-0">
                    <SvgIcon name={stat.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                      {stat.title}
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 mt-1 leading-none">{stat.value}</span>
                    <span className="text-[9.5px] text-slate-500 mt-1 leading-none font-light">{stat.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 text-center text-[10px] text-slate-400 font-light flex items-center justify-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[8px] font-bold">i</span>
              Painel sincronizado com a central de despacho de voos VNMB Air.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
