import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import type { PenyaluranBantuan, StatusPenyaluran } from '../../types';
import { StatusPenyaluranBadge } from '../UI/Badges';
import { formatTanggal, maskNik } from '../../utils/formatters';
import { Modal } from '../UI/Modal';
import {
  Truck,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Building2,
} from 'lucide-react';

export const PenyaluranBantuanView: React.FC = () => {
  const { penyaluran, addPenyaluran, updatePenyaluran, deletePenyaluran, dataPenerima } = useBansos();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PenyaluranBantuan | null>(null);

  const initialForm: Omit<PenyaluranBantuan, 'id'> = {
    penerimaId: '',
    namaPenerima: '',
    nik: '',
    rt: '01',
    rw: '01',
    jenisBantuan: 'PKH (Tahap I - 2026)',
    periodePenyaluran: 'Februari 2026',
    tanggalPenyaluran: new Date().toISOString().slice(0, 10),
    statusPenyaluran: 'Sedang diproses',
    metodePenyaluran: 'Loket Kantor Kelurahan',
    keterangan: 'Penyaluran terjadwal bagi KPM.',
    buktiPenyaluranUrl: '',
  };

  const [formData, setFormData] = useState<Omit<PenyaluranBantuan, 'id'>>(initialForm);

  const statusList = ['Semua', 'Sudah disalurkan', 'Sedang diproses', 'Belum disalurkan', 'Gagal disalurkan'];

  const filtered = penyaluran.filter((item) => {
    const matchStatus = filterStatus === 'Semua' || item.statusPenyaluran === filterStatus;
    const matchSearch =
      item.namaPenerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenisBantuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.metodePenyaluran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PenyaluranBantuan) => {
    setEditingItem(item);
    setFormData({
      penerimaId: item.penerimaId,
      namaPenerima: item.namaPenerima,
      nik: item.nik,
      rt: item.rt,
      rw: item.rw,
      jenisBantuan: item.jenisBantuan,
      periodePenyaluran: item.periodePenyaluran,
      tanggalPenyaluran: item.tanggalPenyaluran,
      statusPenyaluran: item.statusPenyaluran,
      metodePenyaluran: item.metodePenyaluran,
      keterangan: item.keterangan,
      buktiPenyaluranUrl: item.buktiPenyaluranUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Hapus catatan penyaluran untuk ${nama}?`)) {
      deletePenyaluran(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      updatePenyaluran(editingItem.id, formData);
    } else {
      addPenyaluran(formData);
    }

    setIsModalOpen(false);
  };

  const handleSelectPenerima = (penerimaId: string) => {
    const found = dataPenerima.find((p) => p.id === penerimaId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        penerimaId: found.id,
        namaPenerima: found.namaLengkap,
        nik: found.nik,
        rt: found.rt,
        rw: found.rw,
        jenisBantuan: `${found.programKode} (${found.periodePenerimaan})`,
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <span>Menu Penyaluran Bantuan Sosial</span>
          </h2>
          <p className="text-xs text-slate-500">
            Mencatat proses distribusi, metode penyaluran, status pencairan, dan berita acara tanda terima.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Jadwal Penyaluran</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {statusList.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Penerima, NIK, Jenis Bantuan, Metode..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table Penyaluran */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Nama Penerima & NIK</th>
                <th className="py-3 px-3.5">Wilayah</th>
                <th className="py-3 px-3.5">Jenis Bantuan</th>
                <th className="py-3 px-3.5">Periode & Tanggal</th>
                <th className="py-3 px-3.5">Status Penyaluran</th>
                <th className="py-3 px-3.5">Metode & Keterangan</th>
                <th className="py-3 px-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3.5">
                    <span className="font-bold text-slate-900 block">{item.namaPenerima}</span>
                    <span className="text-[10px] text-slate-500 font-mono">NIK: {maskNik(item.nik)}</span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-700 font-medium">
                    RT {item.rt}/RW {item.rw}
                  </td>
                  <td className="py-3 px-3.5 font-bold text-slate-800">{item.jenisBantuan}</td>
                  <td className="py-3 px-3.5 text-slate-600">
                    <span className="font-semibold block">{item.periodePenyaluran}</span>
                    <span className="text-[10px] text-slate-500">{formatTanggal(item.tanggalPenyaluran)}</span>
                  </td>
                  <td className="py-3 px-3.5">
                    <StatusPenyaluranBadge status={item.statusPenyaluran} />
                  </td>
                  <td className="py-3 px-3.5 text-slate-700">
                    <span className="font-bold text-slate-900 block">{item.metodePenyaluran}</span>
                    <span className="text-[11px] text-slate-500">{item.keterangan}</span>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Update Penyaluran"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.namaPenerima)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            Tidak ada riwayat penyaluran pada filter yang dipilih.
          </div>
        )}
      </div>

      {/* Modal Edit / Add Penyaluran */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Update Status Penyaluran Bansos' : 'Catat Penyaluran Bantuan Baru'}
        subtitle="Kelola status distribusi dan keterangan tanda terima bansos"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingItem && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih dari Penerima Terdaftar (SK Penetapan)
              </label>
              <select
                onChange={(e) => handleSelectPenerima(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              >
                <option value="">-- Pilih Penerima --</option>
                {dataPenerima.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.namaLengkap} - {p.programKode} (RT {p.rt}/RW {p.rw})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Penerima</label>
              <input
                type="text"
                value={formData.namaPenerima}
                onChange={(e) => setFormData({ ...formData, namaPenerima: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIK</label>
              <input
                type="text"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Bantuan</label>
              <input
                type="text"
                value={formData.jenisBantuan}
                onChange={(e) => setFormData({ ...formData, jenisBantuan: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Periode Penyaluran</label>
              <input
                type="text"
                value={formData.periodePenyaluran}
                onChange={(e) => setFormData({ ...formData, periodePenyaluran: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Penyaluran</label>
              <input
                type="date"
                value={formData.tanggalPenyaluran}
                onChange={(e) => setFormData({ ...formData, tanggalPenyaluran: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Penyaluran</label>
              <select
                value={formData.statusPenyaluran}
                onChange={(e) =>
                  setFormData({ ...formData, statusPenyaluran: e.target.value as StatusPenyaluran })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold"
              >
                <option value="Belum disalurkan">⏱ Belum disalurkan</option>
                <option value="Sedang diproses">⏳ Sedang diproses</option>
                <option value="Sudah disalurkan">✓ Sudah disalurkan</option>
                <option value="Gagal disalurkan">✕ Gagal disalurkan</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Metode Penyaluran</label>
              <input
                type="text"
                value={formData.metodePenyaluran}
                onChange={(e) => setFormData({ ...formData, metodePenyaluran: e.target.value })}
                placeholder="Contoh: Balai Kelurahan / Transfer Bank BRI / PT Pos Indonesia"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keterangan / Berita Acara
              </label>
              <textarea
                rows={3}
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Catatan bukti serah terima atau kendala penyaluran..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2 px-4 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
            >
              Simpan Data Penyaluran
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
