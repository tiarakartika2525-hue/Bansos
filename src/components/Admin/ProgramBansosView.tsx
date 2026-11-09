import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import type { ProgramBansos, StatusProgram } from '../../types';
import { Modal } from '../UI/Modal';
import { StatusProgramBadge } from '../UI/Badges';
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  DollarSign,
} from 'lucide-react';

export const ProgramBansosView: React.FC = () => {
  const { programBansos, addProgram, editProgram, deleteProgram } = useBansos();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramBansos | null>(null);

  const initialForm: Omit<ProgramBansos, 'id'> = {
    kode: '',
    nama: '',
    keterangan: '',
    periode: 'Tahap I - 2026',
    nominal: 'Rp 600.000 / Tahap',
    kuota: 100,
    persyaratan: ['Terdaftar dalam DTKS', 'Membawa e-KTP dan KK Asli'],
    status: 'Aktif',
  };

  const [formData, setFormData] = useState<Omit<ProgramBansos, 'id'>>(initialForm);
  const [rawPersyaratan, setRawPersyaratan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenAdd = () => {
    setEditingProgram(null);
    setFormData(initialForm);
    setRawPersyaratan(initialForm.persyaratan.join('\n'));
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prog: ProgramBansos) => {
    setEditingProgram(prog);
    setFormData({
      kode: prog.kode,
      nama: prog.nama,
      keterangan: prog.keterangan,
      periode: prog.periode,
      nominal: prog.nominal,
      kuota: prog.kuota,
      persyaratan: prog.persyaratan,
      status: prog.status,
    });
    setRawPersyaratan(prog.persyaratan.join('\n'));
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus program "${nama}"?`)) {
      deleteProgram(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kode.trim() || !formData.nama.trim()) {
      setErrorMsg('Kode dan nama program bantuan wajib diisi.');
      return;
    }

    const cleanPersyaratan = rawPersyaratan
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      persyaratan: cleanPersyaratan.length > 0 ? cleanPersyaratan : ['Terdaftar dalam DTKS'],
    };

    if (editingProgram) {
      editProgram(editingProgram.id, payload);
    } else {
      addProgram(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Menu Program / Jenis Bantuan Sosial</span>
          </h2>
          <p className="text-xs text-slate-500">
            Mengelola jenis bantuan sosial yang tersedia (PKH, BPNT, BLT, PBI-JK, dll.) beserta syarat dan kuotanya.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Program Bansos</span>
        </button>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programBansos.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-blue-600 text-white shadow-2xs">
                  {prog.kode}
                </span>
                <StatusProgramBadge status={prog.status} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{prog.nama}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{prog.keterangan}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Periode:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{prog.periode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Alokasi Kuota:</span>
                  </span>
                  <span className="font-bold text-slate-800">{prog.kuota} KPM</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                    <span>Besaran:</span>
                  </span>
                  <span className="font-extrabold text-emerald-700">{prog.nominal}</span>
                </div>
              </div>

              {/* Syarat preview */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                  Persyaratan ({prog.persyaratan.length}):
                </span>
                <ul className="space-y-1 text-slate-600">
                  {prog.persyaratan.slice(0, 3).map((req, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{req}</span>
                    </li>
                  ))}
                  {prog.persyaratan.length > 3 && (
                    <li className="text-[10px] text-slate-400 pl-4">+{prog.persyaratan.length - 3} syarat lainnya...</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() =>
                  editProgram(prog.id, { status: prog.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif' })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  prog.status === 'Aktif'
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {prog.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(prog)}
                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition"
                  title="Edit Program"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(prog.id, prog.nama)}
                  className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-white rounded-lg transition"
                  title="Hapus Program"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Program */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProgram ? 'Edit Program Bantuan Sosial' : 'Tambah Program Bansos Baru'}
        subtitle="Konfigurasi kode program, nominal, kuota, periode, dan syarat kelayakan"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kode Program (Singkatan) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.kode}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                placeholder="Misal: PKH, BPNT, BLT"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Program</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusProgram })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Program <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Misal: Program Keluarga Harapan"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan / Deskripsi</label>
              <textarea
                rows={2}
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Penjelasan ringkas tujuan bantuan"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Periode Bantuan</label>
              <input
                type="text"
                value={formData.periode}
                onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                placeholder="Contoh: Tahap I - 2026"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Besaran / Nominal Bantuan</label>
              <input
                type="text"
                value={formData.nominal}
                onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                placeholder="Contoh: Rp 750.000 / Tahap"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alokasi Kuota (KPM)</label>
              <input
                type="number"
                min="1"
                value={formData.kuota}
                onChange={(e) => setFormData({ ...formData, kuota: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kriteria & Persyaratan (1 baris per syarat)
              </label>
              <textarea
                rows={4}
                value={rawPersyaratan}
                onChange={(e) => setRawPersyaratan(e.target.value)}
                placeholder="Contoh:&#10;Terdaftar dalam DTKS&#10;Penghasilan di bawah garis kemiskinan&#10;Membawa KTP asli dan Kartu Keluarga"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2 px-4 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
            >
              Simpan Program
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
