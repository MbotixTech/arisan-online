"use client";

import { Winner, Member, ArisanPeriod } from "@prisma/client";
import { Trophy, Calendar } from "lucide-react";

type WinnerWithRelations = Winner & {
  member: Member;
  arisan: Omit<ArisanPeriod, 'amount'> & { amount: number };
};

export default function WinnerList({ winners }: { winners: WinnerWithRelations[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {winners.map((winner) => (
        <div key={winner.id} className="bg-dark-surface border border-dark-border rounded-2xl p-6 hover:border-amber-500/30 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{winner.member.name}</h3>
              <p className="text-sm text-slate-400">{winner.member.phone}</p>
            </div>
          </div>
          
          <div className="space-y-2 pt-4 border-t border-dark-border">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Periode Arisan</span>
              <span className="text-white font-medium">{winner.arisan.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Tanggal Undian</span>
              <span className="text-white font-medium flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {new Date(winner.drawDate).toLocaleDateString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {winners.length === 0 && (
        <div className="col-span-full py-12 text-center text-slate-400 bg-dark-surface border border-dark-border rounded-2xl">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Belum ada pemenang.</p>
        </div>
      )}
    </div>
  );
}
