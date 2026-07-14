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
  Chip
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

export default function Home() {
  const [originKey, setOriginKey] = useState<Key | null>("GRU");
  const [destinationKey, setDestinationKey] = useState<Key | null>("MIA");
  const [departDate, setDepartDate] = useState<CalendarDate | null>(new CalendarDate(2026, 3, 24));
  const [returnDate, setReturnDate] = useState<CalendarDate | null>(new CalendarDate(2026, 3, 28));
  const [tripType, setTripType] = useState("round"); 
  const [passengers, setPassengers] = useState("1 Adulto");
  const [cabinClass, setCabinClass] = useState("Econômica");

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
    toast.success("Buscando voos...", {
      description: `Procurando conexões disponíveis de ${orig} para ${dest} em ${departDate ? departDate.toString() : ""}.`,
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-8 text-slate-800 animate-fade-in">
      {/* Light Glass Banner with custom background */}
      <div className="rounded-[24px] px-6 pt-8 md:pt-14 pb-12 md:pb-24 lg:pb-30 relative overflow-hidden flex flex-col justify-start min-h-[250px] md:min-h-[340px] lg:min-h-[390px] shrink-0">
        {/* Background Image */}
        <img
          src="/images/banner-bg.png"
          alt="Banner Background"
          className="absolute inset-0 w-full h-full object-cover z-0 animate-fade-in"
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

      {/* Flight Search Widget Card (Light Glassmorphic HeroUI Card) */}
      <Card className="backdrop-blur-xl bg-white/60 rounded-3xl p-5 md:p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] border border-white/80 -mt-24 md:-mt-36 lg:-mt-44 mx-2 md:mx-6 z-10 relative flex flex-col gap-4">
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
              <Select.Trigger className="bg-white/80 text-xs font-semibold text-slate-700 border border-slate-200/30 rounded-full px-3.5 py-1.5 backdrop-blur-md flex items-center justify-between gap-1 cursor-pointer hover:border-slate-200/80 transition-colors">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="border border-slate-200/60 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
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
              <Select.Trigger className="bg-white/80 text-xs font-semibold text-slate-700 border border-slate-200/30 rounded-full px-3.5 py-1.5 backdrop-blur-md flex items-center justify-between gap-1 cursor-pointer hover:border-slate-200/80 transition-colors">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="border border-slate-200/60 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
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

        {/* Input Fields Row aligned to the bottom for perfect consistency */}
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
                    if (isPlaceholder || state.selectedItems.length === 0) {
                      return defaultChildren;
                    }
                    const selectedItem = airports.find((airport) => airport.id === state.selectedItems[0]?.key);
                    return selectedItem ? (
                      <span className="font-bold text-slate-700">{selectedItem.name}</span>
                    ) : (
                      defaultChildren
                    );
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
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Autocomplete.Filter>
              </Autocomplete.Popover>
            </Autocomplete>
          </div>

          {/* Swap Button (Vertically centered relative to input triggers) */}
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
                    if (isPlaceholder || state.selectedItems.length === 0) {
                      return defaultChildren;
                    }
                    const selectedItem = airports.find((airport) => airport.id === state.selectedItems[0]?.key);
                    return selectedItem ? (
                      <span className="font-bold text-slate-700">{selectedItem.name}</span>
                    ) : (
                      defaultChildren
                    );
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
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Autocomplete.Filter>
              </Autocomplete.Popover>
            </Autocomplete>
          </div>

          {/* Departure Date (HeroUI DatePicker) */}
          <DatePicker
            value={departDate}
            onChange={setDepartDate}
            className="md:col-span-2 flex flex-col min-w-0"
            aria-label="Data de ida"
          >
            <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1 pl-3">Ida</Label>
            <DateField.Group className="bg-white border border-slate-200/40 rounded-2xl p-3 flex items-center justify-between w-full h-[52px] hover:border-slate-200/80 transition-all">
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
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

          {/* Return Date (HeroUI DatePicker) */}
          <DatePicker
            value={returnDate}
            onChange={setReturnDate}
            className="md:col-span-2 flex flex-col min-w-0"
            aria-label="Data de volta"
          >
            <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1 pl-3">Volta</Label>
            <DateField.Group className="bg-white border border-slate-200/40 rounded-2xl p-3 flex items-center justify-between w-full h-[52px] hover:border-slate-200/80 transition-all">
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
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

          {/* Search Button (HeroUI Button - perfectly matching input height) */}
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

      {/* Quick Filter Tag Buttons */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2.5 mt-1.5 custom-scrollbar -mx-2 px-2">
        <Button
          size="sm"
          className="bg-blue-50 border border-blue-100 text-blue-600 font-bold rounded-2xl text-xs flex items-center gap-2 shrink-0 transition-all shadow-xs h-9"
        >
          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">+</span>
          Voos
        </Button>
        {[
          { tag: "Histórico de voos", icon: "clock" },
          { tag: "Previsão do Clima", icon: "cloud-01" },
          { tag: "Al Roteamento", icon: "route" },
        ].map((item, idx) => (
          <Button
            key={idx}
            size="sm"
            variant="flat"
            className="bg-white/80 border border-slate-200/50 hover:border-slate-300 text-slate-500 hover:text-slate-800 rounded-2xl text-xs font-semibold shrink-0 transition-all shadow-xs flex items-center gap-2 h-9"
          >
            <SvgIcon name={item.icon} className="w-4 h-4 text-slate-400" />
            {item.tag}
          </Button>
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
                <Select.Popover className="border border-slate-200/60 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
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

          {/* Flight options cards container (HeroUI Card list) */}
          <Card className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] divide-y divide-slate-100/50 overflow-hidden">
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

                {/* Action Button (HeroUI Button) */}
                <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleSelectFlight(flight.code, `${flight.depCode} → ${flight.arrCode}`, flight.price)}
                      color="primary"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 h-9 rounded-xl transition-all shadow-xs active:scale-[0.97]"
                    >
                      Selecionar
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors hidden sm:flex items-center justify-center min-w-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Live Itinerary Preview (Right Column - HeroUI Card) */}
        <Card className="lg:col-span-4 backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-6">
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
                state: "completed" 
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

          {/* Complete Itinerary Link Button (HeroUI Button) */}
          <Button
            variant="flat"
            className="w-full border border-blue-100 hover:bg-blue-50/40 text-blue-600 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 bg-blue-50/10 active:scale-[0.98] h-11"
          >
            <span>Ver itinerário completo</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </Button>
        </Card>

      </div>
    </div>
  );
}
