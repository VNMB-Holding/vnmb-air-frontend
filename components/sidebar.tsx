"use client";

import React, { useState } from "react";
import Image from "next/image";

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const menuItems = [
  {
    id: "Calendário",
    label: "Calendário",
    badge: null as string | null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2.5" ry="2.5" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "Aeronaves",
    label: "Aeronaves",
    badge: null as string | null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: "Voos",
    label: "Voos",
    badge: "4" as string | null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M22 2L11 13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  },
  {
    id: "Tripulações",
    label: "Tripulações",
    badge: null as string | null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "Pilotos",
    label: "Pilotos",
    badge: null as string | null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "Manutenção",
    label: "Manutenção",
    badge: "2" as string | null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: "Relatórios",
    label: "Relatórios",
    badge: null as string | null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

const bottomItems = [
  {
    id: "Configurações",
    label: "Configurações",
    badge: null as string | null,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

type MenuItem = {
  id: string;
  label: string;
  badge: string | null;
  icon: React.ReactNode;
};

function NavItem({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
      className={[
        "group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
        "transition-all duration-200 text-left text-sm",
        isCollapsed ? "justify-center" : "",
        isActive
          ? "bg-white/[0.12] border border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          : "text-white/50 hover:text-white/80 hover:bg-white/[0.06] border border-transparent",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Active accent bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-white/70 -ml-px" />
      )}

      {/* Icon */}
      <span
        className={`shrink-0 transition-colors duration-200 ${
          isActive ? "text-white" : "text-white/50 group-hover:text-white/75"
        }`}
      >
        {item.icon}
      </span>

      {/* Label + Badge (expanded) */}
      {!isCollapsed && (
        <>
          <span className={`flex-1 font-light tracking-wide ${isActive ? "font-medium" : ""}`}>
            {item.label}
          </span>
          {item.badge && (
            <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-white/15 text-white/80">
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Collapsed badge dot */}
      {isCollapsed && item.badge && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white/60" />
      )}

      {/* Tooltip on collapsed */}
      {isCollapsed && (
        <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-white/10 backdrop-blur-xl border border-white/15 px-3 py-1.5 text-xs text-white/90 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl">
          {item.label}
        </span>
      )}
    </button>
  );
}

function SidebarContent({
  isCollapsed,
  activeItem,
  onItemClick,
  onToggleCollapse,
}: {
  isCollapsed: boolean;
  activeItem: string;
  onItemClick: (id: string) => void;
  onToggleCollapse?: () => void;
}) {
  const [logoHovered, setLogoHovered] = useState(false);
  return (
    <div
      className={[
        "relative flex flex-col h-full py-5 overflow-hidden",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "px-2.5" : "px-4",
      ].join(" ")}
    >
      {/* Subtle inner glow at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

      {/* Logo + Toggle */}
      <div
        className={`flex items-center mb-6 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {isCollapsed ? (
          /* Collapsed: single clickable zone — logo cross-fades into arrow on hover */
          <button
            onClick={onToggleCollapse}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            title="Expandir sidebar"
            className="hidden md:flex relative w-10 h-10 items-center justify-center rounded-xl transition-colors duration-300 hover:bg-white/[0.08]"
          >
            {/* Logo layer */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out"
              style={{ opacity: logoHovered ? 0 : 1 }}
            >
              <div className="relative w-12 h-12">
                <Image
                  src="/images/VNMB-AIR_logo.svg"
                  alt="VNMB Air Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            {/* Arrow layer */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out"
              style={{ opacity: logoHovered ? 1 : 0 }}
            >
              <svg
                className="w-4 h-4 text-white/70 rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
          </button>
        ) : (
          /* Expanded: logo on the left, collapse button on the right */
          <>
            <div className="relative h-8 w-[145px]">
              <Image
                src="/images/VNMB-AIR_logo.svg"
                alt="VNMB Air Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title="Colapsar sidebar"
                className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all duration-200 border border-transparent hover:border-white/10 shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* Section label */}
      {!isCollapsed && (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 px-2 mb-2">
          Menu
        </p>
      )}

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto custom-scrollbar pr-0.5">
        {menuItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            isCollapsed={isCollapsed}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="my-4 h-px bg-white/[0.08] mx-1" />

      {/* Bottom Items */}
      <div className="flex flex-col gap-1">
        {bottomItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            isCollapsed={isCollapsed}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </div>

    </div>
  );
}

export function Sidebar({ activeItem = "Calendário", onItemClick }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (id: string) => {
    onItemClick?.(id);
    setMobileOpen(false);
  };

  const glassStyle: React.CSSProperties = {
    backdropFilter: "blur(72px) saturate(180%)",
    WebkitBackdropFilter: "blur(72px) saturate(180%)",
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.08] border border-white/15 backdrop-blur-xl text-white/70 hover:text-white transition-colors shadow-lg"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Abrir menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={[
          "hidden md:block relative h-full shrink-0",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-[72px]" : "w-64",
          "border-r border-white/[0.08]",
        ].join(" ")}
        style={{ ...glassStyle, background: "rgba(255,255,255,0.05)" }}
      >
        <SidebarContent
          isCollapsed={collapsed}
          activeItem={activeItem}
          onItemClick={handleClick}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={[
          "md:hidden fixed top-0 left-0 z-40 h-full w-64",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "border-r border-white/[0.08]",
        ].join(" ")}
        style={{ ...glassStyle, background: "rgba(10,10,30,0.65)" }}
      >
        <SidebarContent
          isCollapsed={false}
          activeItem={activeItem}
          onItemClick={handleClick}
        />
      </aside>
    </>
  );
}
