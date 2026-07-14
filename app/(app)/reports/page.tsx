"use client";

import React from "react";
import { Card, toast } from "@heroui/react";
import { SvgIcon } from "@/components/SvgIcon";

export default function ReportsPage() {
  const metrics = [
    {
      id: "1",
      title: "Total de Voos (Mês)",
      value: "142",
      change: "+12.4%",
      changeType: "up",
      icon: "ticket-01",
    },
    {
      id: "2",
      title: "Uso da Frota",
      value: "78.5%",
      change: "+5.2%",
      changeType: "up",
      icon: "plane",
    },
    {
      id: "3",
      title: "Consumo Médio",
      value: "1.240 L/h",
      change: "-3.1%",
      changeType: "down",
      icon: "bar-chart-02",
    },
  ];

  const recentReports = [
    { id: "r1", title: "Consumo de Combustível - Junho 2026", size: "2.4 MB", date: "02/07/2026" },
    { id: "r2", title: "Relatório Operacional de Fretamentos Q2", size: "5.8 MB", date: "30/06/2026" },
    { id: "r3", title: "Escala e Aproveitamento de Tripulação", size: "1.1 MB", date: "28/06/2026" },
  ];

  const handleDownload = (title: string) => {
    toast.success("Download iniciado", {
      description: `O arquivo "${title}" está sendo baixado.`,
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-slate-800 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/40">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">Relatórios e Análise</h1>
          <p className="text-slate-400 text-xs font-light mt-1">
            Métricas de desempenho da frota, relatórios operacionais e estatísticas.
          </p>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card
            key={metric.id}
            className="bg-white/60 border border-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_12px_40px_-8px_rgba(79,119,186,0.06)] flex flex-row items-center justify-between gap-4"
          >
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-semibold tracking-wide">{metric.title}</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-2">{metric.value}</span>
              <span
                className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${metric.changeType === "up" ? "text-emerald-600" : "text-rose-600"
                  }`}
              >
                {metric.changeType === "up" ? "↑" : "↓"} {metric.change}
                <span className="text-slate-400 font-light ml-0.5">vs. mês passado</span>
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50/50 text-blue-600 border border-blue-100/50 shrink-0">
              <SvgIcon name={metric.icon} className="w-6 h-6" />
            </div>
          </Card>
        ))}
      </div>

      {/* Reports Section */}
      <div className="flex flex-col gap-3 mt-2">
        <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
          <SvgIcon name="bar-chart-02" className="w-4 h-4 text-blue-600" />
          Relatórios Recentes para Download
        </h3>

        <div className="flex flex-col gap-3">
          {recentReports.map((report) => (
            <div
              key={report.id}
              className="bg-white/60 border border-white/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/90 hover:border-slate-200 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500 border border-slate-200/50 shrink-0">
                  <SvgIcon name="file-01" className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{report.title}</h4>
                  <div className="text-[10px] text-slate-400 font-light mt-1 flex items-center gap-3">
                    <span>Tamanho: {report.size}</span>
                    <span>Gerado em: {report.date}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(report.title)}
                className="text-xs text-blue-600 hover:text-blue-700 bg-blue-50/50 border border-blue-100/40 hover:bg-blue-100 px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 self-end sm:self-center"
              >
                <SvgIcon name="download-01" className="w-3.5 h-3.5" />
                Baixar PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
