"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CircleDollarSign, Trophy, CreditCard, LogOut, X } from "lucide-react";
import { logoutAction } from "@/app/auth-actions";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Anggota", href: "/members" },
  { icon: CircleDollarSign, label: "Periode Arisan", href: "/arisan" },
  { icon: Trophy, label: "Pemenang", href: "/winners" },
  { icon: CreditCard, label: "Pembayaran", href: "/payments" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-dark-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
              M
            </div>
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight">MbotixTECH</h1>
              <p className="text-xs text-slate-400 font-medium">Arisan System</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-border">
          <button 
            onClick={() => logoutAction()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
