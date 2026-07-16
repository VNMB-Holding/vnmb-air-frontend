"use client";

import React, { useState } from "react";
import { Card, Switch, Select, ListBox, Label, Button, toast, Separator } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";
import type { Key } from "@heroui/react";

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [flightAlerts, setFlightAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [crewAlerts, setCrewAlerts] = useState(false);

  const [language, setLanguage] = useState<Key>("pt-BR");
  const [timezone, setTimezone] = useState<Key>("UTC-3");
  const [units, setUnits] = useState<Key>("metric");
  const [dateFormat, setDateFormat] = useState<Key>("dd/mm/yyyy");

  const handleSave = () => {
    toast.success("Configurações salvas!", {
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Configurações</h1>
          <p className="text-slate-400 text-xs font-light mt-1">
            Gerencie notificações, preferências de exibição e segurança da conta.
          </p>
        </div>
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-xs text-xs"
          onPress={handleSave}
        >
          <SvgIcon name="save-01" className="w-3.5 h-3.5" />
          Salvar Configurações
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="p-5 bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100/50">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center">
                <SvgIcon name="bell-02" className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Notificações</h3>
                <p className="text-[10px] text-slate-400">Configure como deseja receber alertas e atualizações.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/80 transition-all">
                <div className="flex items-center gap-3">
                  <SvgIcon name="mail-01" className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-700">Notificações por Email</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Receber resumos e alertas no seu email.</p>
                  </div>
                </div>
                <Switch isSelected={emailNotifs} onChange={setEmailNotifs}>
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/80 transition-all">
                <div className="flex items-center gap-3">
                  <SvgIcon name="bell-ringing-01" className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-700">Notificações Push</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Alertas em tempo real no navegador.</p>
                  </div>
                </div>
                <Switch isSelected={pushNotifs} onChange={setPushNotifs}>
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/80 transition-all">
                <div className="flex items-center gap-3">
                  <SvgIcon name="plane" className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-700">Alertas de Voo</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Decolagens, pousos, atrasos e mudanças de rota.</p>
                  </div>
                </div>
                <Switch isSelected={flightAlerts} onChange={setFlightAlerts}>
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/80 transition-all">
                <div className="flex items-center gap-3">
                  <SvgIcon name="cloud-01" className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-700">Alertas Meteorológicos</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Condições climáticas adversas nos destinos.</p>
                  </div>
                </div>
                <Switch isSelected={weatherAlerts} onChange={setWeatherAlerts}>
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/80 transition-all">
                <div className="flex items-center gap-3">
                  <SvgIcon name="user-01" className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-700">Alertas de Tripulação</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Vencimento de certificações e escalas.</p>
                  </div>
                </div>
                <Switch isSelected={crewAlerts} onChange={setCrewAlerts}>
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100/50">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100/50 flex items-center justify-center">
                <SvgIcon name="shield-tick" className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Segurança</h3>
                <p className="text-[10px] text-slate-400">Gerencie a segurança da sua conta.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/50">
                <div className="flex items-center gap-3">
                  <SvgIcon name="lock-01" className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-700">Alterar Senha</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Última alteração: há 30 dias.</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs font-bold rounded-xl px-4"
                  onPress={() => toast("Funcionalidade em breve!", { description: "Alteração de senha será disponibilizada na próxima versão." })}
                >
                  Alterar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/50">
                <div className="flex items-center gap-3">
                  <SvgIcon name="fingerprint-01" className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-700">Autenticação em Dois Fatores</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Segurança adicional para o login.</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs font-bold rounded-xl px-4"
                  onPress={() => toast.success("2FA ativado!", { description: "Autenticação em dois fatores habilitada com sucesso." })}
                >
                  Ativar
                </Button>
              </div>

              <Separator className="my-1" />

              <div className="flex items-center justify-between p-3 rounded-2xl bg-red-50/30 border border-red-100/40">
                <div className="flex items-center gap-3">
                  <SvgIcon name="alert-triangle" className="w-4 h-4 text-red-400" />
                  <div>
                    <span className="text-xs font-bold text-red-600">Zona de Perigo</span>
                    <p className="text-[10px] text-red-400 mt-0.5">Encerrar sessão em todos os dispositivos.</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs font-bold rounded-xl px-4 text-red-600 hover:bg-red-50"
                  onPress={() => toast("Sessões encerradas!", { description: "Todas as sessões ativas foram desconectadas." })}
                >
                  Encerrar Tudo
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="p-5 bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100/50">
              <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100/50 flex items-center justify-center">
                <SvgIcon name="settings-01" className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Preferências de Exibição</h3>
                <p className="text-[10px] text-slate-400">Personalize a interface do sistema.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Select
                selectedKey={language}
                onSelectionChange={(key) => key && setLanguage(key)}
                className="w-full"
                aria-label="Idioma"
              >
                <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Idioma</Label>
                <Select.Trigger className="bg-white border border-slate-200/40 rounded-2xl p-3 flex items-center justify-between w-full hover:border-slate-200/80 transition-all text-xs font-semibold text-slate-700">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                  <ListBox>
                    <ListBox.Item id="pt-BR" textValue="Português (Brasil)">Português (Brasil)</ListBox.Item>
                    <ListBox.Item id="en-US" textValue="English (US)">English (US)</ListBox.Item>
                    <ListBox.Item id="es-ES" textValue="Español">Español</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <Select
                selectedKey={timezone}
                onSelectionChange={(key) => key && setTimezone(key)}
                className="w-full"
                aria-label="Fuso Horário"
              >
                <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Fuso Horário</Label>
                <Select.Trigger className="bg-white border border-slate-200/40 rounded-2xl p-3 flex items-center justify-between w-full hover:border-slate-200/80 transition-all text-xs font-semibold text-slate-700">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                  <ListBox>
                    <ListBox.Item id="UTC-3" textValue="Brasília (UTC-3)">Brasília (UTC-3)</ListBox.Item>
                    <ListBox.Item id="UTC-5" textValue="Miami (UTC-5)">Miami (UTC-5)</ListBox.Item>
                    <ListBox.Item id="UTC+0" textValue="Lisboa (UTC+0)">Lisboa (UTC+0)</ListBox.Item>
                    <ListBox.Item id="UTC+1" textValue="Paris (UTC+1)">Paris (UTC+1)</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <Select
                selectedKey={units}
                onSelectionChange={(key) => key && setUnits(key)}
                className="w-full"
                aria-label="Unidades de Medida"
              >
                <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Unidades de Medida</Label>
                <Select.Trigger className="bg-white border border-slate-200/40 rounded-2xl p-3 flex items-center justify-between w-full hover:border-slate-200/80 transition-all text-xs font-semibold text-slate-700">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                  <ListBox>
                    <ListBox.Item id="metric" textValue="Métrico (km, °C, L)">Métrico (km, °C, L)</ListBox.Item>
                    <ListBox.Item id="imperial" textValue="Imperial (mi, °F, gal)">Imperial (mi, °F, gal)</ListBox.Item>
                    <ListBox.Item id="aviation" textValue="Aviação (NM, kt, ft)">Aviação (NM, kt, ft)</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <Select
                selectedKey={dateFormat}
                onSelectionChange={(key) => key && setDateFormat(key)}
                className="w-full"
                aria-label="Formato de Data"
              >
                <Label className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Formato de Data</Label>
                <Select.Trigger className="bg-white border border-slate-200/40 rounded-2xl p-3 flex items-center justify-between w-full hover:border-slate-200/80 transition-all text-xs font-semibold text-slate-700">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                  <ListBox>
                    <ListBox.Item id="dd/mm/yyyy" textValue="DD/MM/AAAA">DD/MM/AAAA</ListBox.Item>
                    <ListBox.Item id="mm/dd/yyyy" textValue="MM/DD/AAAA">MM/DD/AAAA</ListBox.Item>
                    <ListBox.Item id="yyyy-mm-dd" textValue="AAAA-MM-DD (ISO)">AAAA-MM-DD (ISO)</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
          </Card>

          <Card className="p-5 bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-2">
              <SvgIcon name="info-circle" className="w-4 h-4 text-blue-600" />
              Informações do Sistema
            </h3>

            <div className="flex flex-col gap-2.5">
              {[
                { label: "Versão", value: "VNMB Air v2.4.1" },
                { label: "Ambiente", value: "Produção" },
                { label: "Última Sincronização", value: "Há 2 minutos" },
                { label: "Conectividade API", value: "Operacional" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
                  <span className="text-xs font-medium text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
