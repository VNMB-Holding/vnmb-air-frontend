"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { SvgIcon } from "@/components/SvgIcon";
import { Tabs, Avatar, Badge, Dropdown, Label, Popover, Separator, toast, Spinner } from "@heroui/react";
import { ArrowRightFromSquare, Gear, Person } from "@gravity-ui/icons";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(";").shift() || "");
  return null;
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userName, setUserName] = useState("Usuário");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("US");

  useEffect(() => {
    const name = getCookie("user_name") || "Usuário";
    const email = getCookie("user_email") || "";
    setUserName(name);
    setUserEmail(email);

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
    setUserInitials(initials || "US");
  }, [pathname]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 400); 

    return () => clearTimeout(timer);
  }, [pathname]);

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    import("@/services/notifications").then((m) => {
      m.getAlerts().then((data) => {
        if (data) {
          const mapped = data.map((alert: any) => ({
            id: alert.id,
            title: alert.title,
            desc: alert.message,
            time: new Date(alert.createdAt).toLocaleDateString("pt-BR"),
            type: alert.type === "INFO" ? "info" : alert.type === "WARNING" ? "warning" : "success",
            icon: alert.type === "WARNING" ? "alert-triangle" : alert.type === "INFO" ? "info-circle" : "bell-02"
          }));
          setNotifications(mapped);
        }
      });
    });
  }, []);

  const menuItems = [
    { id: "home", label: "Home", icon: "home-01", path: "/" },
    { id: "calendar", label: "Calendário", icon: "calendar", path: "/calendar" },
    { id: "aircraft", label: "Aeronaves", icon: "plane", path: "/aircraft" },
    { id: "pilots", label: "Pilotos", icon: "user-01", path: "/pilots" },
    { id: "reports", label: "Relatórios", icon: "bar-chart-02", path: "/reports" },
  ];

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
      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">

        <header className="w-full py-1.5 px-6 md:px-12 flex items-center justify-between shrink-0 z-20">
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

          <div className="hidden xl:flex items-center gap-4">
            <Popover>
              <Badge.Anchor>
                <Popover.Trigger className="bg-white/50 relative p-2 rounded-full text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center active:scale-95 cursor-pointer">
                  <SvgIcon name="bell-02" className="w-5 h-5" />
                </Popover.Trigger>
                {notifications.length > 0 && <Badge color="danger" size="sm" />}
              </Badge.Anchor>
              <Popover.Content placement="bottom end" className="w-80 bg-white/95 border border-slate-200/60 backdrop-blur-2xl rounded-3xl p-0 shadow-xl z-50">
                <Popover.Dialog className="outline-none p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100/50">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notificações</span>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline">
                      Limpar
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex gap-3 p-2 rounded-2xl hover:bg-slate-50/60 transition-colors cursor-pointer">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${n.type === "success"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                            : n.type === "warning"
                              ? "bg-amber-50 text-amber-600 border-amber-100/50"
                              : "bg-blue-50 text-blue-600 border-blue-100/50"
                          }`}>
                          <SvgIcon name={n.icon} className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-700 leading-snug">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-light mt-0.5 leading-relaxed">{n.desc}</span>
                          <span className="text-[9px] text-slate-500 font-mono mt-1">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Popover.Dialog>
              </Popover.Content>
            </Popover>

            <div className="flex items-center gap-2 border-l border-slate-200/50 pl-4 ml-2">
               <Dropdown>
                 <Dropdown.Trigger className="rounded-full cursor-pointer">
                   <Avatar className="w-9 h-9">
                     <Avatar.Fallback className="bg-[#C5DCFF] text-[#003184] font-bold text-xs border border-slate-200/60 shadow-xs">
                       {userInitials}
                     </Avatar.Fallback>
                   </Avatar>
                 </Dropdown.Trigger>
                 <Dropdown.Popover className="border border-slate-200 shadow-lg rounded-2xl bg-white/95 backdrop-blur-xl">
                   <div className="px-3 pt-3 pb-1">
                     <div className="flex items-center gap-2">
                       <Avatar size="sm">
                         <Avatar.Fallback className="bg-[#C5DCFF] text-[#003184] font-bold text-xs border border-slate-200/60 shadow-xs">
                           {userInitials}
                         </Avatar.Fallback>
                       </Avatar>
                       <div className="flex flex-col gap-0">
                         <p className="text-sm leading-5 font-medium text-slate-800">{userName}</p>
                         <p className="text-xs leading-none text-slate-400">{userEmail}</p>
                       </div>
                     </div>
                   </div>
                   <Dropdown.Menu
                     className="p-1"
                     onAction={(key) => {
                       switch (key) {
                         case "dashboard":
                           router.push("/");
                           break;
                         case "settings":
                           router.push("/settings");
                           break;
                         case "logout": {
                           const authToken = getCookie("auth_token");
                           const refreshToken = getCookie("refresh_token");

                           document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                           document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                           document.cookie = "user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                           document.cookie = "user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

                           if (authToken && refreshToken) {
                             fetch("https://vnmb-identity-api.onrender.com/api/auth/logout", {
                               method: "POST",
                               headers: {
                                 "Content-Type": "application/json",
                                 "Authorization": `Bearer ${authToken}`
                               },
                               body: JSON.stringify({ refresh_token: refreshToken })
                             }).catch((err) => console.error("Erro ao invalidar sessão na API:", err));
                           }

                           router.push("/login");
                           break;
                         }
                       }
                     }}
                   >
                    <Dropdown.Item id="dashboard" textValue="Painel" className="px-3 py-2 rounded-xl text-xs hover:bg-blue-50/50 cursor-pointer transition-all">
                      <div className="flex w-full items-center justify-between gap-2">
                        <Label className="cursor-pointer text-slate-700">Painel Operacional</Label>
                        <SvgIcon name="home-01" className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item id="settings" textValue="Configurações" className="px-3 py-2 rounded-xl text-xs hover:bg-blue-50/50 cursor-pointer transition-all">
                      <div className="flex w-full items-center justify-between gap-2">
                        <Label className="cursor-pointer text-slate-700">Configurações</Label>
                        <Gear className="size-3.5 text-slate-400" />
                      </div>
                    </Dropdown.Item>
                    <Separator className="my-1" />
                    <Dropdown.Item id="logout" textValue="Sair" variant="danger" className="px-3 py-2 rounded-xl text-xs hover:bg-red-50/50 cursor-pointer transition-all">
                      <div className="flex w-full items-center justify-between gap-2">
                        <Label className="cursor-pointer text-red-600">Sair</Label>
                        <ArrowRightFromSquare className="size-3.5 text-red-600" />
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          </div>

          <div className="flex xl:hidden items-center gap-3">
            <Popover>
              <Popover.Trigger className="relative p-2 text-slate-500 hover:text-slate-800 rounded-full bg-white/30 flex items-center justify-center active:scale-95 cursor-pointer">
                <SvgIcon name="bell-02" className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
              </Popover.Trigger>
              <Popover.Content placement="bottom end" className="w-76 bg-white/95 border border-slate-200/60 backdrop-blur-2xl rounded-3xl p-0 shadow-xl z-50">
                <Popover.Dialog className="outline-none p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100/50">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notificações</span>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline">
                      Limpar
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex gap-3 p-2 rounded-2xl hover:bg-slate-50/60 transition-colors cursor-pointer">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${n.type === "success"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                            : n.type === "warning"
                              ? "bg-amber-50 text-amber-600 border-amber-100/50"
                              : "bg-blue-50 text-blue-600 border-blue-100/50"
                          }`}>
                          <SvgIcon name={n.icon} className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-700 leading-snug">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-light mt-0.5 leading-relaxed">{n.desc}</span>
                          <span className="text-[9px] text-slate-500 font-mono mt-1">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Popover.Dialog>
              </Popover.Content>
            </Popover>

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

        <main className="flex-grow overflow-y-auto light-scrollbar flex flex-col relative">
          {isTransitioning ? (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-blue-900/10 backdrop-blur-md animate-fade-in transition-all">
              <Spinner size="lg" color="current" className="text-blue-900" />
              <span className="font-semibold text-blue-900 text-xs">Carregando dados...</span>
            </div>
          ) : null}
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
    <Suspense fallback={null}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
