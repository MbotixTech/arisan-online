import StatsCard from "@/components/StatsCard";
import { Users, CircleDollarSign, Trophy, TrendingUp, ArrowRight } from "lucide-react";
import { getDashboardStats } from "@/app/actions";
import Link from "next/link";

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Ringkasan Dashboard</h1>
        <p className="text-slate-400">Selamat datang kembali di Sistem Arisan MbotixTECH.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Anggota"
          value={stats.totalMembers.toString()}
          icon={Users}
          color="primary"
        />
        <StatsCard
          title="Arisan Aktif"
          value={stats.activeArisan.toString()}
          icon={CircleDollarSign}
          color="secondary"
        />
        <StatsCard
          title="Total Pemenang"
          value={stats.totalWinners.toString()}
          icon={Trophy}
          color="warning"
        />
        <StatsCard
          title="Total Terkumpul"
          value={`Rp ${(Number(stats.totalCollected) / 1000000).toFixed(1)}M`}
          icon={TrendingUp}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Periode Arisan Aktif</h2>
            <Link href="/arisan" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.activeArisanList.map((arisan) => (
              <div key={arisan.id} className="bg-slate-900/50 rounded-xl p-4 border border-dark-border hover:border-primary-500/30 transition-colors flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{arisan.name}</h3>
                  <p className="text-sm text-slate-400">
                    Rp {Number(arisan.amount).toLocaleString('id-ID')} / bulan
                  </p>
                </div>
                <Link href="/arisan" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors">
                  Kelola
                </Link>
              </div>
            ))}
            {stats.activeArisanList.length === 0 && (
              <p className="text-center text-slate-400 py-4">Tidak ada periode arisan aktif.</p>
            )}
          </div>
        </div>


        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Pemenang Terbaru</h2>
            <Link href="/winners" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentWinners.map((winner) => (
              <div key={winner.id} className="bg-slate-900/50 rounded-xl p-4 border border-dark-border hover:border-secondary-500/30 transition-colors flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{winner.member.name}</h3>
                  <p className="text-sm text-slate-400">{winner.arisan.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">
                    {new Date(winner.drawDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
            {stats.recentWinners.length === 0 && (
              <p className="text-center text-slate-400 py-4">Belum ada pemenang.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
