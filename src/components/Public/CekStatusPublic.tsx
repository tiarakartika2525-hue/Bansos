import React, { useState, useEffect } from 'react';
import { useBansos } from '../../context/BansosContext';
import { maskNik, maskNama, formatTanggal } from '../../utils/formatters';
import { StatusPengajuanBadge, StatusPenyaluranBadge, StatusPenerimaBadge } from '../UI/Badges';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Home,
  FileText,
  Calendar,
  AlertTriangle,
  Info,
  PackageCheck,
  Send,
} from 'lucide-react';

export const CekStatusPublic: React.FC = () => {
  const { findStatusByNikOrReg, kelurahan } = useBansos();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<ReturnType<typeof findStatusByNikOrReg> | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('quick_search_query');
    if (saved) {
      setQuery(saved);
      const res = findStatusByNikOrReg(saved);
      setSearchResult(res);
      setHasSearched(true);
      sessionStorage.removeItem('quick_search_query');
    }
  }, [findStatusByNikOrReg]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = findStatusByNikOrReg(query.trim());
    setSearchResult(res);
    setHasSearched(true);
  };

  const handleQuickDemo = (sample: string) => {
    setQuery(sample);
    const res = findStatusByNikOrReg(sample);
    setSearchResult(res);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <Search className="w-3.5 h-3.5" />
          <span>Layanan Cek Status Penerima & Pengajuan Bansos</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Cek Status Bantuan Sosial Anda
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Masukkan 16 digit NIK atau Nomor Registrasi Pendaftaran Anda untuk melacak status verifikasi berkas, survei
          lapangan, dan pencairan bantuan.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Nomor Induk Kependudukan (NIK) atau Nomor Registrasi:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Contoh: 3201011503780001 atau REG-2026-0101"
                className="w-full pl-11 pr-4 py-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Cari Data</span>
            </button>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
            <span>Contoh Demo Cepat:</span>
            <button
              type="button"
              onClick={() => handleQuickDemo('REG-2026-0101')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-blue-700 font-mono text-[11px] border border-slate-200"
            >
              REG-2026-0101 (Disetujui/PKH)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('REG-2026-0105')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-50 text-amber-700 font-mono text-[11px] border border-slate-200"
            >
              REG-2026-0105 (Menunggu)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('REG-2026-0108')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-rose-50 text-rose-700 font-mono text-[11px] border border-slate-200"
            >
              REG-2026-0108 (Ditolak)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('REG-2026-0109')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-blue-700 font-mono text-[11px] border border-slate-200"
            >
              REG-2026-0109 (Perbaikan)
            </button>
          </div>
        </form>
      </div>

      {/* RESULTS DISPLAY */}
      {hasSearched && (
        <div className="space-y-6 animate-fade-in">
          {searchResult ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
              {/* Header result */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-blue-200 font-medium tracking-wide">
                      Hasil Pengecekan Sistem Bansos
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">
                      {searchResult.pengajuan?.namaLengkap
                        ? maskNama(searchResult.pengajuan.namaLengkap)
                        : searchResult.warga?.namaLengkap
                        ? maskNama(searchResult.warga.namaLengkap)
                        : searchResult.penerima?.namaLengkap
                        ? maskNama(searchResult.penerima.namaLengkap)
                        : 'Pemohon Terdata'}
                    </h3>
                  </div>
                  {searchResult.pengajuan && <StatusPengajuanBadge status={searchResult.pengajuan.status} />}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-800/80 text-xs">
                  <div>
                    <span className="text-blue-300 block">NIK Terdaftar</span>
                    <span className="font-mono font-semibold text-white text-sm">
                      {maskNik(
                        searchResult.pengajuan?.nik ||
                          searchResult.penerima?.nik ||
                          searchResult.warga?.nik ||
                          ''
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-300 block">Nomor Registrasi</span>
                    <span className="font-mono font-semibold text-amber-300 text-sm">
                      {searchResult.pengajuan?.noPendaftaran || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-300 block">Program Bansos</span>
                    <span className="font-bold text-white text-sm">
                      {searchResult.pengajuan?.programKode || searchResult.penerima?.programKode || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-300 block">Periode</span>
                    <span className="font-semibold text-white text-sm">
                      {searchResult.penerima?.periodePenerimaan || 'Periode 2026'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body result */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* 1. Status Tindak Lanjut & Keterangan Petugas */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>Informasi Status & Catatan Tindak Lanjut</span>
                  </h4>

                  {searchResult.pengajuan?.status === 'Disetujui' && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Pengajuan Anda TELAH DISETUJUI & Ditetapkan</span>
                      </div>
                      <p className="leading-relaxed">
                        Selamat, data permohonan Anda telah melalui verifikasi dokumen dan survei kelayakan lapangan.
                        SK Penetapan telah diterbitkan oleh Lurah {kelurahan.namaKelurahan}.
                      </p>
                      {searchResult.penerima?.noSkPenetapan && (
                        <p className="font-semibold text-emerald-800">
                          Nomor SK: {searchResult.penerima.noSkPenetapan} | Tanggal Penetapan:{' '}
                          {formatTanggal(searchResult.penerima.tanggalPenetapan)}
                        </p>
                      )}
                    </div>
                  )}

                  {searchResult.pengajuan?.status === 'Menunggu Verifikasi' && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Menunggu Proses Verifikasi & Survei Lapangan</span>
                      </div>
                      <p className="leading-relaxed">
                        Berkas Anda sedang dalam antrean verifikasi Seksi Kesejahteraan Sosial. Petugas verifikator
                        kelurahan akan melakukan peninjauan berkas serta konfirmasi kunjungan survei lapangan.
                      </p>
                      <p className="text-[11px] text-amber-800">
                        Diajukan pada tanggal: {formatTanggal(searchResult.pengajuan.tanggalPengajuan)}
                      </p>
                    </div>
                  )}

                  {searchResult.pengajuan?.status === 'Perlu Perbaikan' && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-blue-950">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                        <span>Catatan Perbaikan Berkas Administrasi</span>
                      </div>
                      <p className="leading-relaxed font-semibold">
                        Catatan Petugas Verifikasi:{' '}
                        <span className="font-normal text-slate-800">
                          "{searchResult.pengajuan.catatanPerbaikan || 'Mohon melengkapi kembali berkas yang kurang jelas.'}"
                        </span>
                      </p>
                      <p className="text-[11px] text-blue-800">
                        Silakan hubungi loket Kesra Kelurahan atau kirimkan ulang berkas perbaikan sesuai arahan.
                      </p>
                    </div>
                  )}

                  {searchResult.pengajuan?.status === 'Ditolak' && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-rose-950">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Pengajuan Tidak Memenuhi Kriteria Kelayakan</span>
                      </div>
                      <p className="leading-relaxed font-semibold">
                        Alasan Penolakan:{' '}
                        <span className="font-normal text-slate-800">
                          "{searchResult.pengajuan.alasanPenolakan || 'Kriteria ekonomi tidak sesuai parameter desil kemiskinan DTKS.'}"
                        </span>
                      </p>
                      <p className="text-[11px] text-rose-800">
                        Diverifikasi pada tanggal: {formatTanggal(searchResult.pengajuan.tanggalVerifikasi || '')} oleh{' '}
                        {searchResult.pengajuan.petugasVerifikator || 'Tim Verifikator'}
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Visual Tracking Timeline */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Tahapan Perkembangan Pengajuan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">1. Pengajuan</span>
                        <span className="text-[10px] text-slate-500">Berkas Diterima</span>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                        searchResult.pengajuan?.tanggalVerifikasi
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-amber-50/60 border-amber-200'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          searchResult.pengajuan?.tanggalVerifikasi
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 text-white animate-pulse'
                        }`}
                      >
                        {searchResult.pengajuan?.tanggalVerifikasi ? '✓' : '2'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">2. Verifikasi</span>
                        <span className="text-[10px] text-slate-500">Pemeriksaan Berkas</span>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                        searchResult.pengajuan?.survei.disurvei
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-slate-50/50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          searchResult.pengajuan?.survei.disurvei
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        {searchResult.pengajuan?.survei.disurvei ? '✓' : '3'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">3. Survei Rumah</span>
                        <span className="text-[10px] text-slate-500">
                          {searchResult.pengajuan?.survei.disurvei ? 'Selesai Survei' : 'Menunggu'}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                        searchResult.pengajuan?.status === 'Disetujui'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : searchResult.pengajuan?.status === 'Ditolak'
                          ? 'bg-rose-50 border-rose-300 text-rose-900'
                          : 'bg-slate-50/50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          searchResult.pengajuan?.status === 'Disetujui'
                            ? 'bg-emerald-600 text-white'
                            : searchResult.pengajuan?.status === 'Ditolak'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-300 text-slate-600'
                        }`}
                      >
                        {searchResult.pengajuan?.status === 'Disetujui'
                          ? '✓'
                          : searchResult.pengajuan?.status === 'Ditolak'
                          ? '✕'
                          : '4'}
                      </div>
                      <div>
                        <span className="font-bold block">4. Keputusan Akhir</span>
                        <span className="text-[10px]">
                          {searchResult.pengajuan?.status || 'Proses Berjalan'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Riwayat Penyaluran Bantuan */}
                {searchResult.penyaluranList && searchResult.penyaluranList.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <PackageCheck className="w-4 h-4 text-emerald-600" />
                      <span>Riwayat Penyaluran Bantuan Sosial</span>
                    </h4>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Jenis Bantuan</th>
                            <th className="py-2.5 px-3">Periode</th>
                            <th className="py-2.5 px-3">Tanggal</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Metode & Keterangan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {searchResult.penyaluranList.map((dist) => (
                            <tr key={dist.id} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-semibold text-slate-800">{dist.jenisBantuan}</td>
                              <td className="py-2.5 px-3 text-slate-600">{dist.periodePenyaluran}</td>
                              <td className="py-2.5 px-3 text-slate-600">{formatTanggal(dist.tanggalPenyaluran)}</td>
                              <td className="py-2.5 px-3">
                                <StatusPenyaluranBadge status={dist.statusPenyaluran} />
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">
                                <div>
                                  <span className="font-medium text-slate-800">{dist.metodePenyaluran}</span>
                                  <p className="text-[11px] text-slate-500">{dist.keterangan}</p>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-md text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">Data Tidak Ditemukan</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Tidak ditemukan berkas pendaftaran atau data penerima bansos dengan NIK atau Nomor Registrasi "
                  <span className="font-semibold text-slate-700">{query}</span>". Pastikan NIK atau kode pendaftaran yang
                  Anda masukkan sudah benar.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MANDATORY LEGAL DISCLAIMER */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 flex items-start gap-3.5 text-xs text-slate-600 leading-relaxed">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 block mb-0.5">Ketentuan dan Penjelasan Resmi:</span>
          <p>
            Perlu diperhatikan, status dalam website kelurahan ini tidak otomatis menentukan kelayakan mutlak atau
            menggantikan keputusan resmi instansi yang berwenang (Kementerian Sosial / Dinas Sosial). Seluruh keputusan
            akhir didasarkan pada regulasi perundang-undangan dan ketersediaan alokasi kuota anggaran pemerintah.
          </p>
        </div>
      </div>
    </div>
  );
};

