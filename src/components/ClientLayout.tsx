"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark-bg text-white overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
