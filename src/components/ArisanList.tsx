"use client";

import { useState } from "react";
import { ArisanPeriod, Winner } from "@prisma/client";
import { Edit, Trash2, Plus, CheckCircle, Trophy, PlayCircle } from "lucide-react";
import Modal from "./Modal";
import { addArisanPeriod, updateArisanPeriod, deleteArisanPeriod, closeArisanPeriod, drawWinner } from "@/app/actions";

type ArisanWithWinners = Omit<ArisanPeriod, 'amount'> & {
  amount: number;
  winners: Winner[];
  _count: { winners: number };
};

export default function ArisanList({ initialPeriods }: { initialPeriods: ArisanWithWinners[] }) {
  const [periods, setPeriods] = useState(initialPeriods);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<(Omit<ArisanPeriod, 'amount'> & { amount: number }) | null>(null);

  if (initialPeriods !== periods) {
    setPeriods(initialPeriods);
  }

  async function handleSubmit(formData: FormData) {
    if (editingPeriod) {
      await updateArisanPeriod(editingPeriod.id, formData);
    } else {
      await addArisanPeriod(formData);
    }
    setIsModalOpen(false);
    setEditingPeriod(null);
  }

  async function handleDraw(id: number) {
    if (confirm("Apakah Anda yakin ingin mengundi pemenang untuk periode ini?")) {
      try {
        await drawWinner(id);
        alert("Pemenang berhasil diundi!");
      } catch (e: any) {
        alert(e.message);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingPeriod(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Periode Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {periods.map((period) => {
          const progress = Math.min((period._count.winners / period.durationMonths) * 100, 100);
          
          return (
            <div key={period.id} className="bg-dark-surface border border-dark-border rounded-2xl p-6 hover:border-primary-500/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-3 rounded-xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  period.status === 'active' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {period.status === 'active' ? 'AKTIF' : 'SELESAI'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{period.name}</h3>
              
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Progres</span>
                  <span>{period._count.winners} / {period.durationMonths} Pemenang</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Jumlah</span>
                  <span className="text-white font-medium">
                    Rp {Number(period.amount).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi</span>
                  <span className="text-white font-medium">{period.durationMonths} Bulan</span>
                </div>
              </div>

              <div className="flex gap-2">
                {period.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleDraw(period.id)}
                      className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Undi
                    </button>
                    <button
                      onClick={() => {
                        setEditingPeriod(period);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if(confirm('Tutup periode ini?')) closeArisanPeriod(period.id);
                      }}
                      className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                      title="Tutup Periode"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    if(confirm('Hapus periode ini?')) deleteArisanPeriod(period.id);
                  }}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPeriod ? "Edit Periode" : "Periode Arisan Baru"}
      >
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Periode</label>
            <input
              name="name"
              defaultValue={editingPeriod?.name}
              required
              placeholder="e.g. Arisan Gold 2024"
              className="w-full bg-slate-900/50 border border-dark-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Jumlah Bulanan (Rp)</label>
            <input
              name="amount"
              type="number"
              defaultValue={editingPeriod ? Number(editingPeriod.amount) : ""}
              required
              className="w-full bg-slate-900/50 border border-dark-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Durasi (Bulan)</label>
            <input
              name="durationMonths"
              type="number"
              defaultValue={editingPeriod?.durationMonths}
              required
              className="w-full bg-slate-900/50 border border-dark-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
            >
              Simpan Periode
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
