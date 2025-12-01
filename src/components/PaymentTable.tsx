"use client";

import { useState } from "react";
import { Payment, Member, ArisanPeriod } from "@prisma/client";
import { Trash2, Plus, Search, Filter } from "lucide-react";
import Modal from "./Modal";
import { addPayment, deletePayment } from "@/app/actions";

type PaymentWithRelations = Omit<Payment, 'amount'> & {
  amount: number;
  member: Member;
  arisan: Omit<ArisanPeriod, 'amount'> & { amount: number };
};

interface PaymentTableProps {
  initialPayments: PaymentWithRelations[];
  members: Member[];
  arisanPeriods: (Omit<ArisanPeriod, 'amount'> & { amount: number })[];
}

export default function PaymentTable({ initialPayments, members, arisanPeriods }: PaymentTableProps) {
  const [payments, setPayments] = useState(initialPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterArisan, setFilterArisan] = useState("");

  if (initialPayments !== payments) {
    setPayments(initialPayments);
  }

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.member.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterArisan ? p.arisanId === Number(filterArisan) : true;
    return matchesSearch && matchesFilter;
  });

  async function handleSubmit(formData: FormData) {
    try {
      await addPayment(formData);
      setIsModalOpen(false);
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Hapus catatan pembayaran ini?")) {
      await deletePayment(id);
    }
  }


  const [selectedArisanId, setSelectedArisanId] = useState("");
  const selectedArisan = arisanPeriods.find(a => a.id === Number(selectedArisanId));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama anggota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={filterArisan}
            onChange={(e) => setFilterArisan(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-500 appearance-none"
          >
            <option value="">Semua Periode</option>
            {arisanPeriods.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Catat Pembayaran
        </button>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50 border-b border-dark-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Anggota</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Periode</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Jumlah</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Tanggal</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-400">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{payment.member.name}</div>
                    <div className="text-xs text-slate-500">{payment.member.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{payment.arisan.name}</td>
                  <td className="px-6 py-4 text-emerald-400 font-medium">
                    Rp {Number(payment.amount).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {new Date(payment.paymentDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                      Lunas
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada pembayaran ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Pembayaran Baru"
      >
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Anggota</label>
            <select
              name="memberId"
              required
              className="w-full bg-slate-900/50 border border-dark-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 appearance-none"
            >
              <option value="">Pilih Anggota</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Periode Arisan</label>
            <select
              name="arisanId"
              required
              value={selectedArisanId}
              onChange={(e) => setSelectedArisanId(e.target.value)}
              className="w-full bg-slate-900/50 border border-dark-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 appearance-none"
            >
              <option value="">Pilih Periode</option>
              {arisanPeriods.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Jumlah</label>
            <input
              name="amount"
              type="number"
              readOnly
              value={selectedArisan ? Number(selectedArisan.amount) : ""}
              className="w-full bg-slate-900/20 border border-dark-border rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tanggal Pembayaran</label>
            <input
              name="paymentDate"
              type="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
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
              Simpan Pembayaran
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
