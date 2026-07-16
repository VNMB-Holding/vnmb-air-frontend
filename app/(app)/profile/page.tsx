"use client";

import React from "react";
import { Card, Avatar, Chip, Button, toast } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";

export default function ProfilePage() {
  const profile = {
    name: "Breno Souza",
    initials: "BS",
    role: "Gerente de Operações",
    email: "breno@vnmb.com.br",
    phone: "+55 (11) 98765-4321",
    base: "São Paulo (GRU)",
    department: "Operações Aéreas",
    employeeId: "VNMB-0042",
    joinDate: "15/03/2023",
  };

  const certifications = [
    { id: "1", name: "Gestão de Operações Aéreas", issuer: "ANAC", expiry: "20/08/2027", status: "Válido", statusColor: "success" },
    { id: "2", name: "Segurança de Aviação Executiva", issuer: "ICAO", expiry: "10/11/2026", status: "Válido", statusColor: "success" },
    { id: "3", name: "Despacho de Voo (DOV)", issuer: "ANAC", expiry: "05/04/2027", status: "Válido", statusColor: "success" },
  ];

  const stats = [
    { label: "Voos Gerenciados", value: "342", icon: "plane" },
    { label: "Horas Supervisionadas", value: "2.860h", icon: "clock" },
    { label: "Operações no Mês", value: "28", icon: "calendar" },
    { label: "Taxa de Eficiência", value: "99.2%", icon: "bar-chart-02" },
  ];

  const recentActivity = [
    { id: "1", action: "Aprovou plano de voo VA-102 (GRU → GIG)", time: "Há 2 horas", icon: "clipboard-check" },
    { id: "2", action: "Escalou Capt. Carlos Silva para voo VA-205", time: "Há 5 horas", icon: "user-01" },
    { id: "3", action: "Validou inspeção da aeronave PR-VNM", time: "Ontem, 16:45", icon: "check-circle" },
    { id: "4", action: "Atualizou rota otimizada GRU → MIA", time: "Ontem, 10:30", icon: "route" },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Meu Perfil</h1>
          <p className="text-slate-400 text-xs font-light mt-1">
            Informações pessoais, certificações e atividade recente.
          </p>
        </div>
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-xs text-xs"
          onPress={() => toast.success("Perfil salvo com sucesso!")}
        >
          <SvgIcon name="save-01" className="w-3.5 h-3.5" />
          Salvar Alterações
        </Button>
      </header>

      {/* Profile Card + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Profile Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-6 bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20 text-2xl font-bold border-2 border-slate-200/60 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700">
              <Avatar.Image src="/images/avatar.jpg" />
              <Avatar.Fallback>{profile.initials}</Avatar.Fallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-800">{profile.name}</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{profile.role}</p>
              <Chip color="accent" variant="soft" size="sm" className="font-bold text-[9px] uppercase mt-2">
                Ativo
              </Chip>
            </div>

            <div className="w-full border-t border-slate-100/50 pt-4 flex flex-col gap-3">
              {[
                { label: "Email", value: profile.email, icon: "mail-01" },
                { label: "Telefone", value: profile.phone, icon: "phone-01" },
                { label: "Base", value: profile.base, icon: "marker-pin-01" },
                { label: "Departamento", value: profile.department, icon: "building-01" },
                { label: "ID Funcionário", value: profile.employeeId, icon: "badge" },
                { label: "Desde", value: profile.joinDate, icon: "calendar" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100/50 flex items-center justify-center shrink-0">
                    <SvgIcon name={item.icon} className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
                    <span className="text-xs font-medium text-slate-700 truncate">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Stats + Certifications + Activity */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-4 bg-white/60 border border-white/80 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(79,119,186,0.04)] flex flex-col items-center gap-2 text-center">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center">
                  <SvgIcon name={stat.icon} className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xl font-extrabold text-slate-800">{stat.value}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
              </Card>
            ))}
          </div>

          {/* Certifications */}
          <Card className="p-5 bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-2">
                <SvgIcon name="certificate-01" className="w-4 h-4 text-blue-600" />
                Certificações e Licenças
              </h3>
              <Chip color="accent" variant="soft" size="sm" className="font-bold text-[9px]">
                {certifications.length} ativas
              </Chip>
            </div>

            <div className="flex flex-col gap-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/40 border border-white/50 hover:bg-white/80 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center shrink-0">
                      <SvgIcon name="shield-tick" className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-700">{cert.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Emissor: {cert.issuer} • Validade: {cert.expiry}
                      </span>
                    </div>
                  </div>
                  <Chip
                    color={cert.statusColor as "success"}
                    variant="soft"
                    size="sm"
                    className="font-bold text-[9px] uppercase shrink-0"
                  >
                    {cert.status}
                  </Chip>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-5 bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-2">
              <SvgIcon name="activity" className="w-4 h-4 text-blue-600" />
              Atividade Recente
            </h3>

            <div className="flex flex-col gap-2">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/40 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center shrink-0 mt-0.5">
                    <SvgIcon name={activity.icon} className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-slate-700 leading-snug">{activity.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
