"use client";

import { useState } from "react";
import { Member } from "@prisma/client";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import Modal from "./Modal";
import { addMember, updateMember, deleteMember } from "@/app/actions";

export default function MemberTable({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [search, setSearch] = useState("");


  if (initialMembers !== members) {
    setMembers(initialMembers);
  }

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );

  async function handleSubmit(formData: FormData) {
    if (editingMember) {
      await updateMember(editingMember.id, formData);
    } else {
      await addMember(formData);
    }
    setIsModalOpen(false);
    setEditingMember(null);
  }

  async function handleDelete(id: number) {
    if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      await deleteMember(id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari anggota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Anggota
        </button>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50 border-b border-dark-border">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Nama</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Telepon</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Alamat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Bergabung</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-medium text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{member.phone}</td>
                  <td className="px-6 py-4 text-slate-300">{member.address}</td>
                  <td className="px-6 py-4 text-slate-300">
                    {new Date(member.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingMember(member);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada anggota ditemukan.
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
        title={editingMember ? "Edit Anggota" : "Tambah Anggota Baru"}
      >
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
            <input
              name="name"
              defaultValue={editingMember?.name}
              required
              className="w-full bg-slate-900/50 border border-dark-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nomor Telepon</label>
            <input
              name="phone"
              defaultValue={editingMember?.phone}
              required
              className="w-full bg-slate-900/50 border border-dark-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Alamat</label>
            <textarea
              name="address"
              defaultValue={editingMember?.address || ""}
              className="w-full bg-slate-900/50 border border-dark-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500"
              rows={3}
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
              Simpan Anggota
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
