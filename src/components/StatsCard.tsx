import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "secondary" | "success" | "warning";
}

export default function StatsCard({ title, value, icon: Icon, trend, color = "primary" }: StatsCardProps) {
  const colorStyles = {
    primary: "from-primary-500/20 to-primary-600/10 text-primary-400 border-primary-500/20",
    secondary: "from-secondary-500/20 to-secondary-600/10 text-secondary-400 border-secondary-500/20",
    success: "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20",
    warning: "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className={`bg-gradient-to-br ${colorStyles[color]} backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && <p className="text-xs text-slate-400 mt-2">{trend}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-slate-900/30 backdrop-blur-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
