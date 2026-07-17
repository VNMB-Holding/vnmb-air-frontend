"use client";

import React, { useState, useEffect } from "react";
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
  Spinner,
  Modal,
  TextField,
  Input,
  Separator,
  TextArea
} from "@heroui/react";
import type { Key } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";
import { CalendarDateTime } from "@internationalized/date";

import { getAircrafts } from "@/services/aircraft";
import { getPilots } from "@/services/pilots";
import { getFlights, scheduleFlight } from "@/services/flights";
import { getAlerts } from "@/services/notifications";
import { getTopAirports } from "@/services/airports";
import { getHubWeather, type WeatherData } from "@/services/weather";


const aircraftFleet = [
  { id: "g650", name: "Gulfstream G650ER", range: 13900 },
  { id: "global7500", name: "Bombardier Global 7500", range: 14260 },
  { id: "phenom300", name: "Embraer Phenom 300E", range: 3720 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("voos");
  const [originKey, setOriginKey] = useState<Key | null>("GRU");
  const [destinationKey, setDestinationKey] = useState<Key | null>("MIA");
  const [departDate, setDepartDate] = useState<CalendarDateTime | null>(new CalendarDateTime(2026, 3, 24, 9, 0));
  const [returnDate, setReturnDate] = useState<CalendarDateTime | null>(new CalendarDateTime(2026, 3, 28, 18, 0));
  const [tripType, setTripType] = useState("round");
  const [sortBy, setSortBy] = useState<Key>("Recomendados");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingLoading, setIsSearchingLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [fleet, setFleet] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);

  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [airports, setAirports] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    
    async function fetchDashboardData() {
      try {
        const [acData, pData, fData, notifData, airpData] = await Promise.all([
          getAircrafts(),
          getPilots(),
          getFlights(),
          getAlerts(),
          getTopAirports()
        ]);
        if (acData) setFleet(acData);
        if (pData) setCrew(pData);
        if (fData) setFlights(fData);
        if (notifData) setAlerts(notifData);
        if (airpData && airpData.success && airpData.data && airpData.data.length > 0) {
          const formattedAirports = airpData.data.map((a: any) => ({
            id: a.ident,
            name: `${a.name} (${a.iataCode || a.ident})`,
            code: a.iataCode || a.ident,
            city: a.municipality || "Desconhecido",
            country: a.isoCountry
          }));
          setAirports(formattedAirports);
        } else {
          // Fallback se o banco ainda não foi populado pelo Seed
          setAirports([
            { id: "GRU", name: "São Paulo (GRU)", code: "GRU", city: "São Paulo", country: "Brasil" },
            { id: "MIA", name: "Miami (MIA)", code: "MIA", city: "Miami", country: "Estados Unidos" },
            { id: "GIG", name: "Rio de Janeiro (GIG)", code: "GIG", city: "Rio de Janeiro", country: "Brasil" },
            { id: "MCO", name: "Orlando (MCO)", code: "MCO", city: "Orlando", country: "Estados Unidos" },
            { id: "BSB", name: "Brasília (BSB)", code: "BSB", city: "Brasília", country: "Brasil" },
            { id: "VCP", name: "Campinas (VCP)", code: "VCP", city: "Campinas", country: "Brasil" },
            { id: "JFK", name: "New York (JFK)", code: "JFK", city: "New York", country: "Estados Unidos" },
            { id: "LIS", name: "Lisboa (LIS)", code: "LIS", city: "Lisboa", country: "Portugal" },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsDashboardLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "clima" && weatherData.length === 0 && !isWeatherLoading) {
      setIsWeatherLoading(true);
      getHubWeather()
        .then(results => {
          setWeatherData(results);
          setIsWeatherLoading(false);
        })
        .catch(() => {
          setIsWeatherLoading(false);
        });
    }
  }, [activeTab]);

  const [routeOrigin, setRouteOrigin] = useState<Key | null>("GRU");
  const [routeDest, setRouteDest] = useState<Key | null>("MIA");
  const [routeAircraft, setRouteAircraft] = useState<Key | null>("phenom300");
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<any>(null);

  const calculateProgress = (dep?: string, arr?: string) => {
    if (!dep || !arr) return 0;
    const now = new Date().getTime();
    const start = new Date(dep).getTime();
    const end = new Date(arr).getTime();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    if (total <= 0) return 100;
    
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const { contains } = useFilter({ sensitivity: "base" });

  const handleSwapAirports = () => {
    const temp = originKey;
    setOriginKey(destinationKey);
    setDestinationKey(temp);
  };

  const [isOpenModalCadastro, setIsOpenModalCadastro] = useState(false);
  const [cadastroPiloto, setCadastroPiloto] = useState<Key>("carlos");
  const [cadastroAeronave, setCadastroAeronave] = useState<Key>("g650");
  const [cadastroObs, setCadastroObs] = useState("");
  const [isCadastroLoading, setIsCadastroLoading] = useState(false);

  const handleSelectFlight = (flightCode: string, route: string, price: string) => {
    toast.success("Voo selecionado!", {
      description: `Voo ${flightCode} (${route}) adicionado ao seu rascunho por ${price}.`,
    });
  };

  const handleCadastrarViagem = async () => {
    setIsCadastroLoading(true);
    const flightData = {
      origin: String(originKey),
      destination: String(destinationKey),
      aircraftId: String(cadastroAeronave),
      pilotId: String(cadastroPiloto),
      departureTime: departDate ? new Date(departDate.toString()).toISOString() : new Date().toISOString(),
    };
    
    const res = await scheduleFlight(flightData);
    setIsCadastroLoading(false);
    
    if (res?.success) {
      toast.success("Viagem cadastrada com sucesso!", {
        description: `Voo registrado no sistema.`,
      });
      setIsOpenModalCadastro(false);
      // optionally refresh flights
    } else {
      toast("Erro ao cadastrar voo", {
        description: res?.error || "Verifique os dados e tente novamente."
      });
    }
  };



  return (
    <div className="w-full flex flex-col gap-6 pb-8 text-slate-800 animate-fade-in">
      <div className="rounded-[24px] px-8 pt-8 md:pt-12 pb-12 md:pb-24 relative overflow-hidden flex flex-col justify-start min-h-[220px] md:min-h-[280px] shrink-0 shadow-sm">
        <img
          src="/images/banner-bg.png"
          alt="Banner Background"
          className="absolute inset-0 w-full h-full object-cover z-0 animate-fade-in filter brightness-95"
        />

        <div className="z-10 flex flex-col justify-start max-w-[60%]">
          <span className="text-[10px] md:text-xs font-bold text-blue-700 tracking-widest uppercase">
            {new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())}
          </span>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-wide text-slate-900 uppercase leading-tight mt-1.5">
            Portal Executivo VNMB
          </h1>
          <p className="text-[10px] md:text-xs text-slate-700 font-semibold mt-2 max-w-sm hidden sm:block">
            Gerenciamento de frota corporativa, rotas otimizadas por IA e monitoramento meteorológico em tempo real.
          </p>
        </div>
      </div>

      <Card className="backdrop-blur-xl bg-white/60 rounded-3xl p-5 md:p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] border border-white/80 -mt-16 md:-mt-24 mx-2 md:mx-6 z-10 relative flex flex-col gap-4">
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
          {(isSearching || isSearchingLoading) && (
            <Button
              size="sm"
              variant="ghost"
              className="border-none text-slate-400 hover:text-blue-500 text-xs font-bold"
              onClick={() => { setIsSearching(false); setIsSearchingLoading(false); }}
            >
              Limpar Busca
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
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

          <div className="md:col-span-1 justify-self-center z-10 shrink-0 flex items-center justify-center h-[52px] mt-3 md:mt-0" title="Inverter aeroportos">
            <Button
              isIconOnly
              onClick={handleSwapAirports}
              variant="ghost"
              className="border border-slate-200/40 text-slate-400 hover:text-blue-500 hover:bg-slate-50 hover:border-slate-200/80 w-11 h-11 rounded-full transition-all flex items-center justify-center min-w-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L17.5 12M21 7.5H7.5" />
              </svg>
            </Button>
          </div>

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

          {isMounted ? (
            <DatePicker
              value={departDate}
              onChange={setDepartDate}
              granularity="minute"
              className={`${tripType === "one-way" ? "md:col-span-4" : "md:col-span-2"} flex flex-col min-w-0`}
              aria-label="Data de ida"
            >
              <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1 pl-3">Ida</Label>
              <DateField.Group className="bg-white border border-slate-200/40 rounded-2xl px-2 py-1 flex items-center justify-between w-full h-[52px] hover:border-slate-200/80 transition-all">
                <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                <DateField.Suffix>
                  <DatePicker.Trigger>
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
          ) : (
            <div className={`${tripType === "one-way" ? "md:col-span-4" : "md:col-span-2"} flex flex-col min-w-0`}>
              <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1 pl-3">Ida</Label>
              <div className="bg-white border border-slate-200/40 rounded-2xl w-full h-[52px]" />
            </div>
          )}

          {tripType === "round" && (
            isMounted ? (
              <DatePicker
                value={returnDate}
                onChange={setReturnDate}
                granularity="minute"
                className="md:col-span-2 flex flex-col min-w-0 animate-fade-in"
                aria-label="Data de volta"
              >
                <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1 pl-3">Volta</Label>
                <DateField.Group className="bg-white border border-slate-200/40 rounded-2xl px-2 py-1 flex items-center justify-between w-full h-[52px] hover:border-slate-200/80 transition-all">
                  <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                  <DateField.Suffix>
                    <DatePicker.Trigger>
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
            ) : (
              <div className="md:col-span-2 flex flex-col min-w-0">
                <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1 pl-3">Volta</Label>
                <div className="bg-white border border-slate-200/40 rounded-2xl w-full h-[52px]" />
              </div>
            )
          )}

          <div className="md:col-span-1 flex md:justify-end mt-4 md:mt-0" title="Cadastrar nova viagem">
            <Button
              onPress={() => setIsOpenModalCadastro(true)}
              className="w-[52px] h-[52px] bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0 min-w-0"
            >
              <SvgIcon name="plus" className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </Card>

      <Modal>
        <Modal.Backdrop isOpen={isOpenModalCadastro} onOpenChange={setIsOpenModalCadastro} className="bg-slate-900/40 backdrop-blur-md">
          <Modal.Container placement="center">
            <Modal.Dialog aria-label="Cadastrar Viagem" className="sm:max-w-lg bg-white/90 backdrop-blur-2xl border border-white/80 rounded-[32px] p-6 shadow-2xl animate-fade-in flex flex-col gap-5">
              <Modal.CloseTrigger className="absolute right-6 top-6 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" />
              <Modal.Header className="flex gap-3.5 items-center">
                <Modal.Icon className="bg-blue-50 text-blue-600 border border-blue-100/50 rounded-2xl w-11 h-11 flex items-center justify-center shrink-0">
                  <SvgIcon name="plane" className="size-5 rotate-45" />
                </Modal.Icon>
                <div className="flex flex-col">
                  <Modal.Heading className="text-base font-extrabold text-slate-800 leading-tight">Cadastrar Viagem Executiva</Modal.Heading>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Preencha os detalhes operacionais adicionais para a frota VNMB.
                  </p>
                </div>
              </Modal.Header>
              <Modal.Body className="py-2 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/70 border border-slate-100/80 p-3 rounded-2xl">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Origem</span>
                    <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">
                      {airports.find(a => a.id === originKey)?.name || "Não definida"}
                    </p>
                  </div>
                  <div className="bg-slate-50/70 border border-slate-100/80 p-3 rounded-2xl">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Destino</span>
                    <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">
                      {airports.find(a => a.id === destinationKey)?.name || "Não definido"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/70 border border-slate-100/80 p-3 rounded-2xl">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Partida</span>
                    <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">
                      {departDate ? departDate.toString() : "Não definida"}
                    </p>
                  </div>
                  <div className="bg-slate-50/70 border border-slate-100/80 p-3 rounded-2xl">
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Tipo de Viagem</span>
                    <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">
                      {tripType === "round" ? "Ida e Volta" : "Somente Ida"}
                    </p>
                  </div>
                </div>

                <Separator className="my-1 bg-slate-100/80" />

                <div className="w-full flex flex-col">
                  <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 pl-1">Piloto em Comando</Label>
                  <Select
                    selectedKey={cadastroPiloto}
                    onSelectionChange={(key) => key && setCadastroPiloto(key)}
                    className="w-full"
                    aria-label="Tripulação (Piloto)"
                  >
                    <Select.Trigger className="bg-white border border-slate-200/40 rounded-full px-4 py-2.5 flex items-center justify-between w-full h-[46px] hover:border-slate-200/80 hover:bg-slate-50/30 transition-all text-xs font-semibold text-slate-700">
                      <Select.Value />
                      <Select.Indicator className="text-slate-400" />
                    </Select.Trigger>
                    <Select.Popover className="border border-slate-200/60 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                      <ListBox className="p-1">
                        {crew.map((pilot) => (
                          <ListBox.Item key={pilot.id} id={pilot.id} textValue={pilot.name} className="px-3 py-2 rounded-xl text-xs hover:bg-blue-50/50 cursor-pointer transition-all font-semibold text-slate-700">{pilot.name}</ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="w-full flex flex-col">
                  <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 pl-1">Aeronave Alocada</Label>
                  <Select
                    selectedKey={cadastroAeronave}
                    onSelectionChange={(key) => key && setCadastroAeronave(key)}
                    className="w-full"
                    aria-label="Aeronave Alocada"
                  >
                    <Select.Trigger className="bg-white border border-slate-200/40 rounded-full px-4 py-2.5 flex items-center justify-between w-full h-[46px] hover:border-slate-200/80 hover:bg-slate-50/30 transition-all text-xs font-semibold text-slate-700">
                      <Select.Value />
                      <Select.Indicator className="text-slate-400" />
                    </Select.Trigger>
                    <Select.Popover className="border border-slate-200/60 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                      <ListBox className="p-1">
                        {fleet.map((ac) => (
                          <ListBox.Item key={ac.id} id={ac.id} textValue={ac.model} className="px-3 py-2 rounded-xl text-xs hover:bg-blue-50/50 cursor-pointer transition-all font-semibold text-slate-700">{ac.model}</ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="w-full flex flex-col">
                  <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 pl-1">Observações da Operação</Label>
                  <TextField className="w-full" name="observations" variant="secondary" value={cadastroObs} onChange={setCadastroObs}>
                    <TextArea placeholder="Ex: Voo com diretoria, catering especial, rota meteorológica prioritária..." rows={3} className="text-xs bg-white border border-slate-200/40 rounded-2xl p-3 hover:border-slate-200/80 focus:border-blue-500 outline-none w-full transition-all text-slate-700 resize-none" />
                  </TextField>
                </div>
              </Modal.Body>
              <Modal.Footer className="flex items-center justify-end gap-3 mt-2">
                <Button slot="close" variant="secondary" className="rounded-full px-6 py-2.5 h-10 text-xs font-bold border border-slate-200/60 hover:bg-slate-50 text-slate-600 cursor-pointer active:scale-95 transition-all">
                  Cancelar
                </Button>
                <Button 
                  isPending={isCadastroLoading}
                  onPress={handleCadastrarViagem} 
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-2.5 h-10 text-xs font-bold cursor-pointer active:scale-95 shadow-md shadow-blue-500/10 transition-all"
                >
                  {({ isPending }) => (
                    <>
                      {isPending ? <Spinner color="current" size="sm" /> : null}
                      Confirmar Cadastro
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
        <div className="lg:col-span-8 flex flex-col gap-6">
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

              {isSearchingLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Spinner size="lg" color="accent" />
                  <span className="text-sm font-semibold text-slate-500 animate-pulse">Buscando as melhores rotas...</span>
                </div>
              ) : isSearching ? (
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
                      <div className="flex items-center gap-4 md:w-1/4">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/50 flex items-center justify-center shrink-0">
                          <SvgIcon name="plane" className="w-5 h-5 rotate-45" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-800 truncate">{flight.carrier}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{flight.code} • {flight.ac}</span>
                        </div>
                      </div>

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
                <div className="flex flex-col gap-4">
                  {flights.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 text-sm">Nenhum voo encontrado.</div>
                  ) : flights.map((flight) => (
                    <Card
                      key={flight.id}
                      className="bg-white/60 border border-white/80 rounded-2xl p-5 hover:bg-white/85 transition-all shadow-[0_4px_24px_-4px_rgba(79,119,186,0.04)] flex flex-col gap-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-100/50">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/40">
                            {flight.flightCode || "VNM-000"}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{fleet.find(a => String(a.id) === String(flight.aircraftId))?.model || "Aeronave"}</span>
                        </div>
                        <Chip
                          color={flight.status === "Scheduled" ? "warning" : "accent"}
                          variant="soft"
                          size="sm"
                          className="font-bold text-[10px] uppercase h-5 min-w-0"
                        >
                          {flight.status || "Agendado"}
                        </Chip>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rota</span>
                          <span className="text-sm font-extrabold text-slate-700 mt-0.5">{flight.origin} → {flight.destination}</span>
                          <span className="text-[11px] text-slate-500 font-light mt-1 flex items-center gap-1">
                            <SvgIcon name="user-01" className="w-3.5 h-3.5 text-slate-400" />
                            {crew.find(p => String(p.id) === String(flight.pilotId))?.name || "Piloto"}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Horários Previstos</span>
                          <span className="text-sm font-extrabold text-slate-700 mt-0.5">{flight.departureTime ? new Date(flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"} → {flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--:--"}</span>
                          <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                            <SvgIcon name="clock" className="w-3.5 h-3.5 text-slate-400" />
                            Hora Local UTC-3
                          </span>
                        </div>

                        <div className="flex flex-col bg-slate-50/60 border border-slate-100 rounded-xl p-2.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Meteorologia Destino</span>
                          <span className="text-xs font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                            <SvgIcon name="cloud-01" className="w-3.5 h-3.5 text-blue-500" />
                            N/A
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium mt-1 truncate">Dados em tempo real indisp.</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 mt-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                          <span>Status da Preparação / Rota</span>
                          <span>{calculateProgress(flight.departureTime, flight.arrivalTime)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/10">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress(flight.departureTime, flight.arrivalTime)}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

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
                {flights.filter(f => f.status === "Completed").length === 0 ? (
                  <div className="text-center p-8 text-slate-500 text-sm">Nenhum voo no histórico.</div>
                ) : flights.filter(f => f.status === "Completed").map((log) => (
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
                          <span className="text-sm font-bold text-slate-800">{log.origin} → {log.destination}</span>
                          <span className="text-[9px] bg-slate-100 border border-slate-200/50 text-slate-500 font-mono px-1.5 py-0.5 rounded">
                            {log.flightCode || log.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                          <span>{log.departureTime ? new Date(log.departureTime).toLocaleDateString() : "--"}</span>
                          <span>•</span>
                          <span>Aeronave: {fleet.find(a => String(a.id) === String(log.aircraftId))?.model || "Aeronave"}</span>
                          <span>•</span>
                          <span>Piloto: {crew.find(p => String(p.id) === String(log.pilotId))?.name || "Piloto"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-100/50 pt-3 sm:pt-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700">Concluído</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip color="success" size="sm" variant="soft" className="font-bold text-[9px] h-5 min-w-0">
                          {log.status}
                        </Chip>
                        <div title="Baixar relatório de voo">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="ghost" 
                            className="border-none text-slate-400 hover:text-blue-500 rounded-lg min-w-0 w-8 h-8"
                            onClick={() => {
                              const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
                              fetch(`https://vnmb-air-backend.onrender.com/api/flights/${log.id}/report`, {
                                headers: {
                                  'Authorization': `Bearer ${token}`
                                }
                              })
                              .then(res => res.blob())
                              .then(blob => {
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `manifesto-${log.flightCode}.pdf`;
                                a.click();
                                window.URL.revokeObjectURL(url);
                              })
                              .catch(err => console.error("Erro ao baixar PDF:", err));
                            }}
                          >
                            <SvgIcon name="download-01" className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "clima" && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/40">
                <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Monitor Meteorológico - Hubs de Aviação
                </h2>
                <span className="text-xs text-slate-500 font-medium">Dados reais via Open-Meteo</span>
              </div>

              {isWeatherLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Spinner size="lg" color="accent" />
                  <span className="text-sm font-semibold text-slate-500 animate-pulse">Consultando satélites meteorológicos...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weatherData.map((weather, idx) => (
                    <Card
                      key={idx}
                      className="bg-white/60 border border-white/80 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-[0_4px_24px_-4px_rgba(79,119,186,0.02)]"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">{weather.hub}</h3>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">METAR Ativo</p>
                        </div>
                        <Chip color={weather.impactColor as "success" | "warning" | "default"} variant="soft" size="sm" className="font-bold text-[9px] h-5 min-w-0">
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
              )}
            </div>
          )}




        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="backdrop-blur-xl bg-white/60 border border-white/80 rounded-3xl p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100/40">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <SvgIcon name="activity" className="w-4 h-4 text-blue-600 animate-pulse" />
                Central de Controle Operacional
              </h3>
              <Chip
                color="success"
                variant="soft"
                size="sm"
                className="font-bold text-[9px] border border-emerald-100/50 h-5"
              >
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping mr-1" />
                  ATIVO
                </div>
              </Chip>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { title: "Frota Ativa", value: `${fleet.length} Aeronaves`, desc: "100% da frota operacional", icon: "plane" },
                { title: "Pilotos Escalados", value: `${crew.length} Operacionais`, desc: "Nenhuma pendência médica", icon: "user-01" },
                { title: "Voos Agendados", value: `${flights.length} Registros`, desc: "Integrado ao painel", icon: "activity" },
                { title: "Próximo Voo", value: flights.length > 0 && flights[0].departureTime ? `${new Date(flights[0].departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${flights[0].origin}` : "--", desc: flights.length > 0 ? (flights[0].flightCode || "VA-000") : "Sem voos", icon: "clock" },
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

