import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import type { Pengumuman } from '../../types';
import { Modal } from '../UI/Modal';
import { Bell, PlusCircle, Edit2, Trash2, Pin, Calendar, User, Search } from 'lucide-react';

export const KelolaPengumumanView: React.FC = () => {
  const { pengumuman, addPengumuman, editPengumuman, deletePengumuman, auth } = useBansos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pengumuman | null>(null);

  const initialForm: Omit<Pengumuman, 'id'> = {
    judul: '',
    kategori: 'Penyaluran',
    tanggal: new Date().toISOString().slice(0, 10),
    ringkasan: '',
    isi: '',
    penulis: auth.namaLengkap || 'Seksi Kesra',
    isPinned: false,
  };

  const [formData, setFormData] = useState<Omit<Pengumuman, 'id'>>(initialForm);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Pengumuman) => {
    setEditingItem(p);
    setFormData({
      judul: p.judul,
      kategori: p.kategori,
      tanggal: p.tanggal,
      ringkasan: p.ringkasan,
      isi: p.isi,
      penulis: p.penulis,
      isPinned: p.isPinned || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, judul: string) => {
    if (window.confirm(`Hapus pengumuman "${judul}"?`)) {
      deletePengumuman(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      editPengumuman(editingItem.id, formData);
    } else {
      addPengumuman(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>Kelola Pengumuman & Jadwal Kelurahan</span>
          </h2>
          <p className="text-xs text-slate-500">
            Publikasikan pengumuman jadwal pencairan bansos, agenda verifikasi, dan sosialisasi kepada warga.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pengumuman.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-5 border shadow-2xs flex flex-col justify-between ${
              item.isPinned ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200'
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {item.kategori}
                  </span>
                  {item.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      <Pin className="w-3 h-3 rotate-45" /> Disematkan
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">{item.tanggal}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.judul}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.ringkasan}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Oleh: {item.penulis}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.judul)}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-50 rounded-lg"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Judul Pengumuman</label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="Penyaluran">Penyaluran</option>
                <option value="Pendaftaran">Pendaftaran</option>
                <option value="Verifikasi">Verifikasi</option>
                <option value="Umum">Umum</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Publikasi</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ringkasan Pengumuman (Lead Text)</label>
            <textarea
              rows={2}
              value={formData.ringkasan}
              onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Isi Lengkap Pengumuman</label>
            <textarea
              rows={5}
              value={formData.isi}
              onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pin"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="rounded text-blue-600"
            />
            <label htmlFor="pin" className="text-slate-700 font-semibold cursor-pointer">
              Sematkan pengumuman ini di bagian paling atas (Pinned)
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold"
            >
              Batal
            </button>
            <button type="submit" className="py-2 px-5 rounded-lg bg-blue-600 text-white font-bold">
              Simpan Pengumuman
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
