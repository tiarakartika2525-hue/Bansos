import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import type { PengajuanBansos, StatusPengajuan, SurveiLapangan } from '../../types';
import { Modal } from '../UI/Modal';
import { StatusPengajuanBadge } from '../UI/Badges';
import { formatRupiah, formatTanggal } from '../../utils/formatters';
import {
  ClipboardCheck,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Home,
  FileText,
  User,
  Clock,
  ShieldAlert,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const VerifikasiPengajuanView: React.FC = () => {
  const { pengajuan, updateVerifikasiPengajuan, saveSurveiLapangan, auth } = useBansos();

  const [activeTabStatus, setActiveTabStatus] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected pengajuan for detail/verification modal
  const [selectedPengajuan, setSelectedPengajuan] = useState<PengajuanBansos | null>(null);
  const [modalMode, setModalMode] = useState<'detail' | 'survei' | 'action'>('detail');

  // Action decision state
  const [targetStatus, setTargetStatus] = useState<StatusPengajuan>('Disetujui');
  const [alasanPenolakan, setAlasanPenolakan] = useState('');
  const [catatanPerbaikan, setCatatanPerbaikan] = useState('');

  // Survei form state
  const [surveiForm, setSurveiForm] = useState<SurveiLapangan>({
    disurvei: true,
    tanggalSurvei: new Date().toISOString().slice(0, 10),
    petugasSurvei: auth.namaLengkap || 'Petugas Kesra',
    kondisiDinding: 'Tembok bata belum diaci / triplek',
    kondisiLantai: 'Semen kasar / plester',
    kondisiAtap: 'Asbes / genteng lama',
    sumberAir: 'Sumur gali terlindung / bersama',
    dayaListrik: '450 VA',
    penilaianKelayakan: 'Layak',
    catatanSurvei: 'Memenuhi kriteria kemiskinan dan kelayakan bantuan sosial.',
  });

  const statusOptions = ['Semua', 'Menunggu Verifikasi', 'Disetujui', 'Ditolak', 'Perlu Perbaikan'];

  const filtered = pengajuan.filter((p) => {
    const matchStatus = activeTabStatus === 'Semua' || p.status === activeTabStatus;
    const matchSearch =
      p.noPendaftaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.programKode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleOpenDetail = (p: PengajuanBansos) => {
    setSelectedPengajuan(p);
    setModalMode('detail');
    setTargetStatus(p.status);
    setAlasanPenolakan(p.alasanPenolakan || '');
    setCatatanPerbaikan(p.catatanPerbaikan || '');

    if (p.survei.disurvei) {
      setSurveiForm(p.survei);
    } else {
      setSurveiForm({
        disurvei: true,
        tanggalSurvei: new Date().toISOString().slice(0, 10),
        petugasSurvei: auth.namaLengkap || 'Petugas Kesra',
        kondisiDinding: 'Tembok bata belum diaci / triplek',
        kondisiLantai: 'Semen kasar / plester',
        kondisiAtap: 'Asbes / genteng tanah liat',
        sumberAir: 'Sumur gali / mata air komunal',
        dayaListrik: '450 VA',
        penilaianKelayakan: 'Layak',
        catatanSurvei: 'Kondisi riil memenuhi syarat penerima bansos.',
      });
    }
  };

  const handleSaveDecision = () => {
    if (!selectedPengajuan) return;

    if (targetStatus === 'Ditolak' && !alasanPenolakan.trim()) {
      alert('Mohon masukkan alasan penolakan.');
      return;
    }
    if (targetStatus === 'Perlu Perbaikan' && !catatanPerbaikan.trim()) {
      alert('Mohon masukkan catatan berkas yang perlu diperbaiki.');
      return;
    }

    updateVerifikasiPengajuan(selectedPengajuan.id, targetStatus, auth.namaLengkap || 'Petugas Verifikator', {
      alasanPenolakan,
      catatanPerbaikan,
    });

    setSelectedPengajuan(null);
  };

  const handleSaveSurvei = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPengajuan) return;

    saveSurveiLapangan(selectedPengajuan.id, surveiForm);
    alert('Hasil survei lapangan berhasil disimpan!');
    setModalMode('detail');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            <span>Menu Verifikasi Pengajuan Calon Penerima</span>
          </h2>
          <p className="text-xs text-slate-500">
            Periksa kelengkapan dokumen, tinjau hasil survei lapangan, dan putuskan status pengajuan bansos.
          </p>
        </div>
      </div>

      {/* Filter and Tab Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {statusOptions.map((st) => (
            <button
              key={st}
              onClick={() => setActiveTabStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTabStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
              {st === 'Menunggu Verifikasi' && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
                  {pengajuan.filter((p) => p.status === 'Menunggu Verifikasi').length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari No Registrasi, Nama Pemohon, NIK, Wilayah RT/RW..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table Pengajuan */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">No Reg & Tanggal</th>
                <th className="py-3 px-3.5">Calon Penerima</th>
                <th className="py-3 px-3.5">Program</th>
                <th className="py-3 px-3.5">Wilayah</th>
                <th className="py-3 px-3.5">Penghasilan & Tanggungan</th>
                <th className="py-3 px-3.5">Survei Lapangan</th>
                <th className="py-3 px-3.5">Status Pengajuan</th>
                <th className="py-3 px-3.5 text-center">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3.5">
                    <span className="font-mono font-bold text-blue-700 block">{item.noPendaftaran}</span>
                    <span className="text-[10px] text-slate-500">{formatTanggal(item.tanggalPengajuan)}</span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="font-bold text-slate-900 block">{item.namaLengkap}</span>
                    <span className="text-[10px] text-slate-500 font-mono">NIK: {item.nik}</span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-blue-100 text-blue-800">
                      {item.programKode}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-700">
                    <span className="block font-medium truncate max-w-[140px]">{item.alamat}</span>
                    <span className="text-[10px] text-blue-700 font-semibold">
                      RT {item.rt}/RW {item.rw}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="font-bold text-slate-900 block">{formatRupiah(item.penghasilan)}</span>
                    <span className="text-[10px] text-slate-500">{item.jumlahAnggotaKeluarga} anggota kel.</span>
                  </td>
                  <td className="py-3 px-3.5">
                    {item.survei.disurvei ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ Disurvei ({item.survei.penilaianKelayakan})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        ⏱ Belum Disurvei
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <StatusPengajuanBadge status={item.status} />
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <button
                      onClick={() => handleOpenDetail(item)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition flex items-center justify-center gap-1 mx-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Verifikasi</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            Tidak ada pengajuan bansos yang sesuai dengan kriteria filter.
          </div>
        )}
      </div>

      {/* DETAIL / VERIFIKASI MODAL */}
      {selectedPengajuan && (
        <Modal
          isOpen={!!selectedPengajuan}
          onClose={() => setSelectedPengajuan(null)}
          title={`Verifikasi Pengajuan: ${selectedPengajuan.noPendaftaran}`}
          subtitle={`Pemohon: ${selectedPengajuan.namaLengkap} • Program: ${selectedPengajuan.programNama}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Modal Subtabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setModalMode('detail')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  modalMode === 'detail' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                1. Detail Berkas & Data
              </button>
              <button
                onClick={() => setModalMode('survei')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  modalMode === 'survei' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                2. Form Survei Lapangan
              </button>
              <button
                onClick={() => setModalMode('action')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  modalMode === 'action' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                3. Keputusan Verifikasi
              </button>
            </div>

            {/* TAB 1: DETAIL BERKAS */}
            {modalMode === 'detail' && (
              <div className="space-y-5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Data identitas */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider pb-1 border-b border-slate-200">
                      Identitas Kependudukan
                    </h4>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-slate-500">NIK:</span>
                      <span className="col-span-2 font-mono font-bold text-slate-800">{selectedPengajuan.nik}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-slate-500">Nomor KK:</span>
                      <span className="col-span-2 font-mono font-semibold text-slate-800">{selectedPengajuan.noKk}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-slate-500">Nama Pemohon:</span>
                      <span className="col-span-2 font-bold text-slate-900">{selectedPengajuan.namaLengkap}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-slate-500">Alamat:</span>
                      <span className="col-span-2 text-slate-700">
                        {selectedPengajuan.alamat} (RT {selectedPengajuan.rt}/RW {selectedPengajuan.rw})
                      </span>
                    </div>
                  </div>

                  {/* Kondisi sosial ekonomi */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider pb-1 border-b border-slate-200">
                      Kondisi Sosial Ekonomi
                    </h4>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-slate-500">Pekerjaan:</span>
                      <span className="col-span-2 font-semibold text-slate-800">{selectedPengajuan.pekerjaan}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-slate-500">Penghasilan:</span>
                      <span className="col-span-2 font-bold text-emerald-700">
                        {formatRupiah(selectedPengajuan.penghasilan)} / bulan
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-slate-500">Tanggungan:</span>
                      <span className="col-span-2 font-semibold text-slate-800">
                        {selectedPengajuan.jumlahAnggotaKeluarga} Orang
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-slate-500">Status Saat Ini:</span>
                      <span className="col-span-2">
                        <StatusPengajuanBadge status={selectedPengajuan.status} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alasan pengajuan */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                  <span className="font-bold text-blue-900 block mb-1">Alasan Pengajuan Pemohon:</span>
                  <p className="text-slate-700 leading-relaxed italic">"{selectedPengajuan.alasanPengajuan}"</p>
                </div>

                {/* Dokumen Viewer */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                    Kelengkapan Berkas Dokumen:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px]">KTP Elektronik</span>
                          <span className="text-[10px] text-slate-400">{selectedPengajuan.fileKtp}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ Ada
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px]">Kartu Keluarga</span>
                          <span className="text-[10px] text-slate-400">{selectedPengajuan.fileKk}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ Ada
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px]">Dokumen Pendukung</span>
                          <span className="text-[10px] text-slate-400">{selectedPengajuan.fileDokumenPendukung}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ Ada
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setModalMode('survei')}
                    className="py-2 px-4 rounded-xl bg-slate-800 text-white font-semibold text-xs"
                  >
                    Lanjut ke Formulir Survei Lapangan →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SURVEI LAPANGAN */}
            {modalMode === 'survei' && (
              <form onSubmit={handleSaveSurvei} className="space-y-4 text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-amber-900">
                  <Home className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    Formulir ini mencatat hasil peninjauan fisik langsung ke tempat tinggal calon penerima bansos.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tanggal Kunjungan Survei</label>
                    <input
                      type="date"
                      value={surveiForm.tanggalSurvei}
                      onChange={(e) => setSurveiForm({ ...surveiForm, tanggalSurvei: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Petugas Surveyor</label>
                    <input
                      type="text"
                      value={surveiForm.petugasSurvei}
                      onChange={(e) => setSurveiForm({ ...surveiForm, petugasSurvei: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kondisi Dinding Rumah</label>
                    <input
                      type="text"
                      value={surveiForm.kondisiDinding}
                      onChange={(e) => setSurveiForm({ ...surveiForm, kondisiDinding: e.target.value })}
                      placeholder="Contoh: Triplek / Bilik bambu / Bata tanpa plester"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kondisi Lantai</label>
                    <input
                      type="text"
                      value={surveiForm.kondisiLantai}
                      onChange={(e) => setSurveiForm({ ...surveiForm, kondisiLantai: e.target.value })}
                      placeholder="Contoh: Semen kasar berdebu / Tanah / Keramik retak"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kondisi Atap</label>
                    <input
                      type="text"
                      value={surveiForm.kondisiAtap}
                      onChange={(e) => setSurveiForm({ ...surveiForm, kondisiAtap: e.target.value })}
                      placeholder="Contoh: Seng berkarat bocor / Asbes"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Daya Listrik (VA)</label>
                    <select
                      value={surveiForm.dayaListrik}
                      onChange={(e) => setSurveiForm({ ...surveiForm, dayaListrik: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="450 VA">450 VA (Subsidi)</option>
                      <option value="900 VA">900 VA (Subsidi)</option>
                      <option value="900 VA Non-Subsidi">900 VA (Non-Subsidi)</option>
                      <option value="1300 VA">1300 VA</option>
                      <option value="Menumpang / Tanpa Meteran">Menumpang / Tanpa Meteran</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sumber Air Minum & MCK</label>
                    <input
                      type="text"
                      value={surveiForm.sumberAir}
                      onChange={(e) => setSurveiForm({ ...surveiForm, sumberAir: e.target.value })}
                      placeholder="Contoh: Sumur timba / Mata air bersama"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Penilaian Kelayakan Lapangan</label>
                    <select
                      value={surveiForm.penilaianKelayakan}
                      onChange={(e) =>
                        setSurveiForm({
                          ...surveiForm,
                          penilaianKelayakan: e.target.value as SurveiLapangan['penilaianKelayakan'],
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                    >
                      <option value="Sangat Layak">Sangat Layak (Prioritas Tinggi)</option>
                      <option value="Layak">Layak (Memenuhi Kriteria)</option>
                      <option value="Cukup Layak">Cukup Layak (Batas Ambang)</option>
                      <option value="Tidak Layak">Tidak Layak (Mampu / Desil Tinggi)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Catatan & Rekomendasi Hasil Survei
                    </label>
                    <textarea
                      rows={3}
                      value={surveiForm.catatanSurvei}
                      onChange={(e) => setSurveiForm({ ...surveiForm, catatanSurvei: e.target.value })}
                      placeholder="Tuliskan catatan kondisi nyata ekonomi keluarga hasil kunjungan..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="submit"
                    className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                  >
                    Simpan Catatan Survei Lapangan
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode('action')}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                  >
                    Lanjut ke Keputusan Verifikasi →
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: KEPUTUSAN VERIFIKASI */}
            {modalMode === 'action' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="block font-bold text-slate-800 uppercase tracking-wider">
                    Pilih Keputusan Status Verifikasi:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      onClick={() => setTargetStatus('Disetujui')}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                        targetStatus === 'Disetujui'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <span className="block text-sm">Disetujui</span>
                        <span className="text-[10px] font-normal text-slate-500">
                          Lolos verifikasi & terbitkan SK
                        </span>
                      </div>
                    </div>

                    <div
                      onClick={() => setTargetStatus('Ditolak')}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                        targetStatus === 'Ditolak'
                          ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      <div>
                        <span className="block text-sm">Ditolak</span>
                        <span className="text-[10px] font-normal text-slate-500">
                          Tidak memenuhi syarat desil
                        </span>
                      </div>
                    </div>

                    <div
                      onClick={() => setTargetStatus('Perlu Perbaikan')}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                        targetStatus === 'Perlu Perbaikan'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <span className="block text-sm">Perlu Perbaikan</span>
                        <span className="text-[10px] font-normal text-slate-500">
                          Berkas KK/KTP buram/kurang
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {targetStatus === 'Ditolak' && (
                  <div className="space-y-2 p-4 bg-rose-50 rounded-xl border border-rose-200">
                    <label className="block font-bold text-rose-900">
                      Alasan Penolakan Pengajuan (Wajib diisi):
                    </label>
                    <textarea
                      rows={3}
                      value={alasanPenolakan}
                      onChange={(e) => setAlasanPenolakan(e.target.value)}
                      placeholder="Contoh: Penghasilan kepala keluarga di atas UMR Kota Metro dan kondisi tempat tinggal permanen sangat layak."
                      className="w-full px-3 py-2 border border-rose-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                )}

                {targetStatus === 'Perlu Perbaikan' && (
                  <div className="space-y-2 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <label className="block font-bold text-blue-900">
                      Catatan Berkas yang Perlu Diperbaiki Pemohon:
                    </label>
                    <textarea
                      rows={3}
                      value={catatanPerbaikan}
                      onChange={(e) => setCatatanPerbaikan(e.target.value)}
                      placeholder="Contoh: Foto Kartu Keluarga (KK) terpotong dan nomor KK tidak terbaca. Harap unggah ulang salinan KK yang jelas."
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                )}

                {targetStatus === 'Disetujui' && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                    <span className="font-bold block">Konsekuensi Penetapan Disetujui:</span>
                    <p className="leading-relaxed">
                      Warga atas nama <strong>{selectedPengajuan.namaLengkap}</strong> akan otomatis ditambahkan ke
                      dalam <strong>Menu Data Penerima Bansos (SK Penetapan)</strong> dan antrean jadwal penyaluran
                      bantuan.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setSelectedPengajuan(null)}
                    className="py-2 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveDecision}
                    className="py-2.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                  >
                    Terapkan Keputusan Verifikasi
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
