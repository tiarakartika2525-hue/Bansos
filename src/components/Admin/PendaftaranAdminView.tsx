import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import { formatRupiah } from '../../utils/formatters';
import {
  UserPlus,
  Search,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';

export const PendaftaranAdminView: React.FC = () => {
  const { dataWarga, programBansos, submitPengajuan, setAdminMenu } = useBansos();

  const [searchNik, setSearchNik] = useState('');
  const [formData, setFormData] = useState({
    programKode: 'PKH',
    nik: '',
    namaLengkap: '',
    noKk: '',
    alamat: '',
    rt: '01',
    rw: '01',
    pekerjaan: 'Buruh Harian Lepas',
    penghasilan: 1000000,
    jumlahAnggotaKeluarga: 3,
    alasanPengajuan: '',
    fileKtp: 'ktp_loket.pdf',
    fileKk: 'kk_loket.pdf',
    fileDokumenPendukung: 'sktm_loket.pdf',
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string; regNo?: string } | null>(null);

  // Auto-fill from Data Warga
  const handleAutoFill = () => {
    if (!searchNik.trim()) return;
    const found = dataWarga.find(
      (w) => w.nik === searchNik.trim() || w.namaLengkap.toLowerCase().includes(searchNik.toLowerCase())
    );

    if (found) {
      setFormData((prev) => ({
        ...prev,
        nik: found.nik,
        namaLengkap: found.namaLengkap,
        noKk: found.noKk,
        alamat: found.alamat,
        rt: found.rt,
        rw: found.rw,
        pekerjaan: found.pekerjaan,
        penghasilan: found.penghasilan,
        jumlahAnggotaKeluarga: found.jumlahTanggungan,
      }));
      setNotification({
        type: 'success',
        message: `Data warga ditemukan dan disinkronkan: ${found.namaLengkap} (${found.nik})`,
      });
    } else {
      setNotification({
        type: 'error',
        message: `Warga dengan NIK / nama "${searchNik}" tidak ditemukan di database warga. Anda dapat menginput manual di bawah.`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nik || formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      setNotification({ type: 'error', message: 'NIK harus berupa 16 digit angka.' });
      return;
    }
    if (!formData.noKk || formData.noKk.length !== 16 || !/^\d+$/.test(formData.noKk)) {
      setNotification({ type: 'error', message: 'Nomor Kartu Keluarga (KK) harus berupa 16 digit angka.' });
      return;
    }
    if (!formData.namaLengkap.trim()) {
      setNotification({ type: 'error', message: 'Nama lengkap pemohon wajib diisi.' });
      return;
    }
    if (!formData.alasanPengajuan.trim()) {
      setNotification({ type: 'error', message: 'Alasan pengajuan permohonan bansos wajib dicatat.' });
      return;
    }

    const prog = programBansos.find((p) => p.kode === formData.programKode);

    const regNo = submitPengajuan({
      programId: prog?.id || 'prog-1',
      programKode: formData.programKode,
      programNama: prog?.nama || formData.programKode,
      nik: formData.nik,
      namaLengkap: formData.namaLengkap,
      noKk: formData.noKk,
      alamat: formData.alamat,
      rt: formData.rt,
      rw: formData.rw,
      pekerjaan: formData.pekerjaan,
      penghasilan: formData.penghasilan,
      jumlahAnggotaKeluarga: formData.jumlahAnggotaKeluarga,
      alasanPengajuan: formData.alasanPengajuan,
      fileKtp: formData.fileKtp,
      fileKk: formData.fileKk,
      fileDokumenPendukung: formData.fileDokumenPendukung,
    });

    setNotification({
      type: 'success',
      message: `Pendaftaran calon penerima berhasil dicatat dengan Nomor Registrasi: ${regNo}. Data telah masuk ke antrean verifikasi!`,
      regNo,
    });

    // Reset
    setFormData({
      programKode: 'PKH',
      nik: '',
      namaLengkap: '',
      noKk: '',
      alamat: '',
      rt: '01',
      rw: '01',
      pekerjaan: 'Buruh Harian Lepas',
      penghasilan: 1000000,
      jumlahAnggotaKeluarga: 3,
      alasanPengajuan: '',
      fileKtp: 'ktp_loket.pdf',
      fileKk: 'kk_loket.pdf',
      fileDokumenPendukung: 'sktm_loket.pdf',
    });
    setSearchNik('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <span>Menu Pendaftaran Calon Penerima Bansos (Loket Pelayanan)</span>
        </h2>
        <p className="text-xs text-slate-500">
          Mencatat permohonan warga yang mendaftar langsung di loket pelayanan Kesejahteraan Sosial kantor kelurahan.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs border flex items-start gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <div className="space-y-1">
            <p className="font-semibold">{notification.message}</p>
            {notification.regNo && (
              <button
                onClick={() => setAdminMenu('verifikasi-pengajuan')}
                className="font-bold text-blue-700 underline text-xs pt-1 block"
              >
                Buka Menu Verifikasi Pengajuan untuk Meninjau Berkas Ini →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Auto-fill Helper Box */}
      <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span>Tarik Cepat dari Database Data Warga Terdaftar:</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchNik}
            onChange={(e) => setSearchNik(e.target.value)}
            placeholder="Ketik NIK atau Nama warga yang sudah ada di database..."
            className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tarik Data Warga</span>
          </button>
        </div>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Choice of program */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Pilih Program Bantuan Sosial yang Diajukan:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {programBansos
              .filter((p) => p.status === 'Aktif')
              .map((prog) => (
                <div
                  key={prog.id}
                  onClick={() => setFormData({ ...formData, programKode: prog.kode })}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    formData.programKode === prog.kode
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs">{prog.kode}</span>
                    {formData.programKode === prog.kode && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <span className="text-[11px] block mt-0.5 truncate">{prog.nama}</span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">{prog.nominal}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Identitas Pemohon */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Identitas Calon Penerima</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIK (16 Digit) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                placeholder="16 digit NIK"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Kartu Keluarga (KK) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={formData.noKk}
                onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                placeholder="16 digit Nomor KK"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Sesuai KTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.namaLengkap}
                onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                placeholder="Nama lengkap pemohon"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Jl. / Gang / No Rumah"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">RT</label>
              <select
                value={formData.rt}
                onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              >
                {['01', '02', '03', '04', '05', '06', '07', '08'].map((rt) => (
                  <option key={rt} value={rt}>
                    RT {rt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">RW</label>
              <select
                value={formData.rw}
                onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              >
                {['01', '02', '03', '04'].map((rw) => (
                  <option key={rw} value={rw}>
                    RW {rw}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan</label>
              <input
                type="text"
                value={formData.pekerjaan}
                onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Penghasilan per Bulan: <span className="text-blue-700">{formatRupiah(formData.penghasilan)}</span>
              </label>
              <input
                type="number"
                step="50000"
                value={formData.penghasilan}
                onChange={(e) => setFormData({ ...formData, penghasilan: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Anggota Keluarga</label>
              <input
                type="number"
                min="1"
                value={formData.jumlahAnggotaKeluarga}
                onChange={(e) => setFormData({ ...formData, jumlahAnggotaKeluarga: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alasan Pengajuan Permohonan Bansos <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.alasanPengajuan}
                onChange={(e) => setFormData({ ...formData, alasanPengajuan: e.target.value })}
                placeholder="Catat keterangan pemohon mengapa memerlukan bantuan sosial ini..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Upload Dokumen Pelayanan */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Dokumen Fisik yang Diterima di Loket
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800">Fotokopi e-KTP</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                ✓ Diterima
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800">Fotokopi KK</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                ✓ Diterima
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800">SKTM / Surat RT-RW</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                ✓ Diterima
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            Daftarkan Calon Penerima Bansos
          </button>
        </div>
      </form>
    </div>
  );
};

