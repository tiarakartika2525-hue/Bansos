import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import type { Pengumuman } from '../../types';
import { Modal } from '../UI/Modal';
import { Bell, Calendar, User, Pin, ArrowRight, Search, FileText } from 'lucide-react';

export const PengumumanPublic: React.FC = () => {
  const { pengumuman } = useBansos();
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePengumuman, setActivePengumuman] = useState<Pengumuman | null>(null);

  const kategoriList = ['Semua', 'Penyaluran', 'Pendaftaran', 'Verifikasi', 'Umum'];

  const filtered = pengumuman.filter((p) => {
    const matchKat = selectedKategori === 'Semua' || p.kategori === selectedKategori;
    const matchSearch =
      p.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ringkasan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.isi.toLowerCase().includes(searchTerm.toLowerCase());
    return matchKat && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <Bell className="w-3.5 h-3.5" />
          <span>Pusat Informasi & Pengumuman Resmi</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Pengumuman & Agenda Bantuan Sosial
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Dapatkan pembaruan resmi terkait jadwal pencairan, jadwal survei lapangan, dan hasil musyawarah kelurahan.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {kategoriList.map((kat) => (
            <button
              key={kat}
              onClick={() => setSelectedKategori(kat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedKategori === kat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pengumuman..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Announcement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePengumuman(item)}
            className={`bg-white rounded-2xl p-6 border transition cursor-pointer flex flex-col justify-between hover:shadow-md ${
              item.isPinned ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    {item.kategori}
                  </span>
                  {item.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      <Pin className="w-3 h-3 rotate-45" />
                      Disematkan
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.tanggal}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition leading-snug">
                {item.judul}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.ringkasan}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Oleh: {item.penulis}</span>
              </span>
              <span className="font-bold text-blue-600 flex items-center gap-1">
                <span>Baca Pengumuman</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Tidak ada pengumuman yang sesuai</p>
          <p className="text-xs text-slate-500">Coba gunakan kata kunci pencarian atau kategori lain.</p>
        </div>
      )}

      {/* Detail Modal */}
      {activePengumuman && (
        <Modal
          isOpen={!!activePengumuman}
          onClose={() => setActivePengumuman(null)}
          title={activePengumuman.judul}
          subtitle={`Kategori: ${activePengumuman.kategori} • Tanggal: ${activePengumuman.tanggal} • Diterbitkan oleh: ${activePengumuman.penulis}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs leading-relaxed text-slate-700">
            <div className="p-3.5 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 font-medium">
              {activePengumuman.ringkasan}
            </div>

            <div className="whitespace-pre-line text-slate-800 space-y-2 leading-relaxed pt-2">
              {activePengumuman.isi}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActivePengumuman(null)}
                className="py-2 px-5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Tutup Pengumuman
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
