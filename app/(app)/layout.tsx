"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { SvgIcon } from "@/components/SvgIcon";
import { Tabs, Avatar, Badge } from "@heroui/react";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", icon: "home-01", path: "/" },
    { id: "calendar", label: "Calendário", icon: "calendar", path: "/calendar" },
    { id: "aircraft", label: "Aeronaves", icon: "plane", path: "/aircraft" },
    { id: "pilots", label: "Pilotos", icon: "user-01", path: "/pilots" },
    { id: "reports", label: "Relatórios", icon: "bar-chart-02", path: "/reports" },
  ];

  // Active tab selection based on current route pathname
  const activeItem = menuItems.find(
    (item) => pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path + "/"))
  );
  const currentTab = activeItem ? activeItem.id : "home";

  const handleTabClick = (tabId: string) => {
    const item = menuItems.find((i) => i.id === tabId);
    if (item) {
      router.push(item.path);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans text-slate-800 bg-gradient-to-br from-[#F4F8FF] via-[#E1EDFF] to-[#C5DCFF]">
      {/* Main Content Pane (Sticky navbar + scrolling content) */}
      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">

        {/* Horizontal Navigation Header (Light Glass styling) */}
        <header className="w-full py-1.5 px-6 md:px-12 flex items-center justify-between shrink-0 z-20">
          {/* Logo with App Icon */}
          <Link href="/" className="flex items-center gap-3" onClick={() => router.push("/")}>
            <Image
              src="/images/vnmb-air-logo-type.png"
              alt="VNMB Air Logo"
              width={480}
              height={270}
              priority
              className="object-contain h-16 sm:h-17 w-auto"
            />
          </Link>

          {/* Navigation Items (Desktop) */}
          <Tabs
            selectedKey={currentTab}
            onSelectionChange={(key) => handleTabClick(key as string)}
            className="hidden xl:flex"
          >
            <Tabs.ListContainer>
              <Tabs.List
                aria-label="Menu principal"
                className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-1 rounded-full flex items-center gap-1 relative"
              >
                {menuItems.map((item) => (
                  <Tabs.Tab
                    key={item.id}
                    id={item.id}
                    className="group relative px-4 py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-colors duration-300 flex items-center gap-1.5 active:scale-95 z-10 text-slate-600 data-[selected=true]:text-white"
                  >
                    <SvgIcon
                      name={item.icon}
                      className="w-4 h-4 transition-colors duration-300 text-slate-400 group-data-[selected=true]:text-white group-hover:text-[#003184]"
                    />
                    <span>{item.label}</span>
                    <Tabs.Indicator className="bg-[#003184] rounded-full shadow-md shadow-[#003184]/20 z-[-1]" />
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>

          {/* Right Section: Search, Notification, Profile */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notification Bell */}
            <Badge.Anchor>
              <button className="bg-white/50 relative p-2 rounded-full text-slate-500 transition-colors flex items-center justify-center">
                <SvgIcon name="bell-02" className="w-5 h-5" />
              </button>
              <Badge color="danger" size="sm" />
            </Badge.Anchor>

            <div className="flex items-center gap-2 border-l border-slate-200/50 pl-4 ml-2">
              <Avatar className="w-9 h-9">
                <Avatar.Image src="/images/avatar.jpg" />
                <Avatar.Fallback className="bg-white text-slate-700 font-bold text-xs border border-slate-200/60 shadow-xs">
                  JS
                </Avatar.Fallback>
              </Avatar>
            </div>
          </div>

          {/* Hamburger (Mobile/Tablet) */}
          <div className="flex xl:hidden items-center gap-3">
            {/* Notification Indicator (compact) */}
            <button className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full bg-white/30 flex items-center justify-center">
              <SvgIcon name="bell-02" className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-800 rounded-full bg-white/30 border border-slate-200/50 transition-colors"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute top-[80px] left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-slate-200 shadow-lg z-50 py-4 px-6 flex flex-col gap-2 xl:hidden animate-fade-in">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${currentTab === item.id
                  ? "bg-[#003184] text-white"
                  : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <SvgIcon name={item.icon} className="w-4.5 h-4.5" />
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Main Scrolling Pane (using custom scrollbar) */}
        <main className="flex-grow overflow-y-auto light-scrollbar flex flex-col relative">
          <div className="flex-grow p-6 md:p-10 lg:p-12 w-full max-w-[1600px] mx-auto flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen flex items-center justify-center bg-[#F5F8FD]">
        <div className="animate-pulse text-slate-400 font-light text-sm">Carregando painel...</div>
      </div>
    }>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
