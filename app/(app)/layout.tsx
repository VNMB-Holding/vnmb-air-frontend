import Image from "next/image";
import { Sidebar } from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Background Image Layer (Matching Login Page) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/airplane_wing.svg"
          alt="Airplane wing over clouds"
          fill
          priority
          className="object-cover object-center scale-x-[-1]"
        />
        {/* Soft gradient overlay for readability without making it too dark */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-transparent" />
      </div>


      {/* Sidebar (left side) */}
      <div className="relative z-10 h-full flex flex-col">
        <Sidebar activeItem="Calendário" />
      </div>

      {/* Main Content Pane (right side) */}
      <main className="relative z-10 flex-grow h-full overflow-y-auto custom-scrollbar flex flex-col">
        <div className="flex-grow p-6 lg:p-8 max-w-[1600px] w-full mx-auto flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}

