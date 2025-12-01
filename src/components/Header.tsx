"use client";

import { User, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-dark-border bg-slate-900/50 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        

      </div>

      <div className="flex items-center gap-2 md:gap-4">

        
        <div className="h-8 w-px bg-dark-border mx-2 hidden md:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <User className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
