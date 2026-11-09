import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import { exportReportToExcel } from '../../utils/exportExcel';
import { generateKelurahanPdf } from '../../utils/exportPdf';
import { formatRupiah, formatTanggal, maskNik } from '../../utils/formatters';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Printer,
  Filter,
  Calendar,
  Building2,
  CheckCircle,
  Users,
  Award,
  Truck,
  Layers,
} from 'lucide-react';

export const LaporanView: React.FC = () => {
  const { kelurahan, dataWarga, pengajuan, dataPenerima, penyaluran, programBansos } = useBansos();

  const [jenisLaporan, setJenisLaporan] = useState<string>('laporan-warga');
  const [filterPeriode, setFilterPeriode] = useState('Semua');
  const [filterRt, setFilterRt] = useState('Semua');
  const [filterProgram, setFilterProgram] = useState('Semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const daftarLaporan = [
    { id: 'laporan-warga', label: '1. Laporan Data Warga', icon: <Users className="w-4 h-4" /> },
    { id: 'laporan-calon', label: '2. Laporan Calon Penerima', icon: <FileText className="w-4 h-4" /> },
    { id: 'laporan-penerima', label: '3. Laporan Penerima Bansos', icon: <Award className="w-4 h-4" /> },
    { id: 'laporan-verifikasi', label: '4. Laporan Hasil Verifikasi', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'laporan-penyaluran', label: '5. Laporan Penyaluran Bantuan', icon: <Truck className="w-4 h-4" /> },
    { id: 'laporan-rtrw', label: '6. Laporan Berdasarkan RT/RW', icon: <Building2 className="w-4 h-4" /> },
    { id: 'laporan-jenis-bansos', label: '7. Laporan Berdasarkan Jenis Bantuan', icon: <Layers className="w-4 h-4" /> },
  ];

  // Generate table headers & rows based on selected report
  const getReportData = () => {
    switch (jenisLaporan) {
      case 'laporan-warga': {
        const filtered = dataWarga.filter((w) => filterRt === 'Semua' || w.rt === filterRt);
        const headers = ['No', 'NIK', 'No KK', 'Nama Lengkap', 'JK', 'Alamat', 'RT/RW', 'Pekerjaan', 'Penghasilan', 'Tanggungan', 'Status Rumah'];
        const rows = filtered.map((w, idx) => [
          idx + 1,
          w.nik,
          w.noKk,
          w.namaLengkap,
          w.jenisKelamin,
          w.alamat,
          `RT ${w.rt}/RW ${w.rw}`,
          w.pekerjaan,
          formatRupiah(w.penghasilan),
          `${w.jumlahTanggungan} Jiwa`,
          w.statusTempatTinggal,
        ]);
        return {
          title: `Laporan Data Identitas Warga Kelurahan ${kelurahan.namaKelurahan}`,
          headers,
          rows,
          rawCount: filtered.length,
          summary: [
            { label: 'Total Warga Terdata', value: `${filtered.length} Jiwa` },
            { label: 'Filter RT', value: filterRt },
          ],
        };
      }

      case 'laporan-calon': {
        const filtered = pengajuan.filter((p) => {
          const matchProg = filterProgram === 'Semua' || p.programKode === filterProgram;
          const matchRt = filterRt === 'Semua' || p.rt === filterRt;
          return matchProg && matchRt;
        });
        const headers = ['No', 'No Registrasi', 'NIK', 'Nama Pemohon', 'Program', 'Wilayah', 'Pekerjaan', 'Penghasilan', 'Tgl Daftar', 'Status'];
        const rows = filtered.map((p, idx) => [
          idx + 1,
          p.noPendaftaran,
          maskNik(p.nik),
          p.namaLengkap,
          p.programKode,
          `RT ${p.rt}/RW ${p.rw}`,
          p.pekerjaan,
          formatRupiah(p.penghasilan),
          formatTanggal(p.tanggalPengajuan),
          p.status,
        ]);
        return {
          title: `Laporan Calon Penerima Bantuan Sosial Kelurahan ${kelurahan.namaKelurahan}`,
          headers,
          rows,
          rawCount: filtered.length,
          summary: [
            { label: 'Total Berkas Calon Penerima', value: `${filtered.length} Berkas` },
            { label: 'Program Filter', value: filterProgram },
          ],
        };
      }

      case 'laporan-penerima': {
        const filtered = dataPenerima.filter((p) => {
          const matchProg = filterProgram === 'Semua' || p.programKode === filterProgram;
          const matchRt = filterRt === 'Semua' || p.rt === filterRt;
          return matchProg && matchRt;
        });
        const headers = ['No', 'NIK', 'Nama Penerima', 'Wilayah', 'Program', 'Nominal', 'Periode', 'Status KPM', 'No SK Penetapan', 'Tgl SK'];
        const rows = filtered.map((p, idx) => [
          idx + 1,
          maskNik(p.nik),
          p.namaLengkap,
          `RT ${p.rt}/RW ${p.rw}`,
          p.programKode,
          p.nominalBantuan,
          p.periodePenerimaan,
          p.statusPenerimaan,
          p.noSkPenetapan,
          formatTanggal(p.tanggalPenetapan),
        ]);
        return {
          title: `Laporan Penetapan Penerima Bantuan Sosial Kelurahan ${kelurahan.namaKelurahan}`,
          headers,
          rows,
          rawCount: filtered.length,
          summary: [
            { label: 'Total Penerima Ditetapkan', value: `${filtered.length} KPM` },
            { label: 'Filter Program', value: filterProgram },
          ],
        };
      }

      case 'laporan-verifikasi': {
        const filtered = pengajuan.filter((p) => p.status !== 'Menunggu Verifikasi');
        const headers = ['No', 'No Reg', 'Nama Pemohon', 'Program', 'Wilayah', 'Survei Kelayakan', 'Keputusan', 'Tgl Verifikasi', 'Catatan / Alasan'];
        const rows = filtered.map((p, idx) => [
          idx + 1,
          p.noPendaftaran,
          p.namaLengkap,
          p.programKode,
          `RT ${p.rt}/RW ${p.rw}`,
          p.survei.penilaianKelayakan || 'Belum',
          p.status,
          formatTanggal(p.tanggalVerifikasi || p.tanggalPengajuan),
          p.alasanPenolakan || p.catatanPerbaikan || p.survei.catatanSurvei || 'Lolos kriteria',
        ]);
        return {
          title: `Laporan Hasil Verifikasi & Validasi Pengajuan Bansos Kelurahan ${kelurahan.namaKelurahan}`,
          headers,
          rows,
          rawCount: filtered.length,
          summary: [
            { label: 'Total Pengajuan Terverifikasi', value: `${filtered.length} Berkas` },
            { label: 'Disetujui', value: filtered.filter((p) => p.status === 'Disetujui').length },
            { label: 'Ditolak', value: filtered.filter((p) => p.status === 'Ditolak').length },
          ],
        };
      }

      case 'laporan-penyaluran': {
        const headers = ['No', 'Nama Penerima', 'NIK', 'Jenis Bantuan', 'Periode', 'Tanggal Distribusi', 'Status Penyaluran', 'Metode Penyaluran', 'Keterangan'];
        const rows = penyaluran.map((d, idx) => [
          idx + 1,
          d.namaPenerima,
          maskNik(d.nik),
          d.jenisBantuan,
          d.periodePenyaluran,
          formatTanggal(d.tanggalPenyaluran),
          d.statusPenyaluran,
          d.metodePenyaluran,
          d.keterangan,
        ]);
        return {
          title: `Laporan Penyaluran & Distribusi Bantuan Sosial Kelurahan ${kelurahan.namaKelurahan}`,
          headers,
          rows,
          rawCount: penyaluran.length,
          summary: [
            { label: 'Total Alokasi Penyaluran', value: `${penyaluran.length} Transaksi` },
            { label: 'Sudah Tersalurkan', value: penyaluran.filter((d) => d.statusPenyaluran === 'Sudah disalurkan').length },
            { label: 'Sedang Proses', value: penyaluran.filter((d) => d.statusPenyaluran === 'Sedang diproses').length },
          ],
        };
      }

      case 'laporan-rtrw': {
        const map = new Map<string, { totalWarga: number; penerimaBansos: number; calonPenerima: number }>();
        // Group by RT/RW
        ['01', '02', '03', '04', '05', '06', '07', '08'].forEach((rt) => {
          const key = `RT ${rt}`;
          const wCount = dataWarga.filter((w) => w.rt === rt).length;
          const pCount = dataPenerima.filter((p) => p.rt === rt).length;
          const cCount = pengajuan.filter((c) => c.rt === rt).length;
          map.set(key, { totalWarga: wCount, penerimaBansos: pCount, calonPenerima: cCount });
        });

        const headers = ['No', 'Wilayah Rukun Tetangga (RT)', 'Total Warga Terdata', 'Calon Penerima', 'Penerima Bansos Aktif (KPM)', 'Rasio Penerima'];
        const rows = Array.from(map.entries()).map(([wilayah, stat], idx) => {
          const ratio = stat.totalWarga > 0 ? Math.round((stat.penerimaBansos / stat.totalWarga) * 100) : 0;
          return [
            idx + 1,
            wilayah,
            `${stat.totalWarga} Jiwa`,
            `${stat.calonPenerima} Pengajuan`,
            `${stat.penerimaBansos} KPM`,
            `${ratio}%`,
          ];
        });

        return {
          title: `Laporan Rekapitulasi Bansos Berdasarkan Wilayah RT/RW Kelurahan ${kelurahan.namaKelurahan}`,
          headers,
          rows,
          rawCount: rows.length,
          summary: [
            { label: 'Total Wilayah RT', value: '8 RT (RW 01 - RW 04)' },
            { label: 'Total KPM Keseluruhan', value: `${dataPenerima.length} KPM` },
          ],
        };
      }

      case 'laporan-jenis-bansos': {
        const headers = ['No', 'Kode Program', 'Nama Program Bantuan', 'Alokasi Kuota', 'Realisasi Penerima (KPM)', 'Sisa Kuota', 'Nominal Bantuan', 'Status Program'];
        const rows = programBansos.map((prog, idx) => {
          const realisasi = dataPenerima.filter((p) => p.programKode === prog.kode).length;
          const sisa = Math.max(prog.kuota - realisasi, 0);
          return [
            idx + 1,
            prog.kode,
            prog.nama,
            `${prog.kuota} KPM`,
            `${realisasi} KPM`,
            `${sisa} KPM`,
            prog.nominal,
            prog.status,
          ];
        });

        return {
          title: `Laporan Realisasi Berdasarkan Jenis Program Bantuan Sosial Kelurahan ${kelurahan.namaKelurahan}`,
          headers,
          rows,
          rawCount: rows.length,
          summary: [
            { label: 'Total Program Aktif', value: `${programBansos.filter((p) => p.status === 'Aktif').length} Program` },
            { label: 'Total Penerima Terdaftar', value: `${dataPenerima.length} KPM` },
          ],
        };
      }

      default:
        return { title: 'Laporan', headers: [], rows: [], rawCount: 0, summary: [] };
    }
  };

  const report = getReportData();

  const handleExportExcel = () => {
    exportReportToExcel(
      report.title,
      report.headers,
      report.rows,
      `${jenisLaporan}_${kelurahan.namaKelurahan}`
    );
  };

  const handleExportPdf = () => {
    generateKelurahanPdf({
      title: report.title,
      subtitle: `Sistem Informasi Pengelolaan Bansos Kelurahan ${kelurahan.namaKelurahan}`,
      periode: filterPeriode !== 'Semua' ? filterPeriode : 'Tahun Anggaran 2026',
      kelurahan,
      headers: report.headers,
      data: report.rows as any,
      orientation: 'landscape',
      summary: report.summary,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <span>Menu Laporan Pengelolaan Bantuan Sosial</span>
          </h2>
          <p className="text-xs text-slate-500">
            Pusat pembuatan dan pencetakan 7 kategori laporan resmi kelurahan dalam format Excel (.xlsx) dan PDF ber-kop surat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-300 shadow-2xs transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF Resmi</span>
          </button>
        </div>
      </div>

      {/* Navigation of 7 Report Types */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 bg-slate-200/70 p-1.5 rounded-2xl">
        {daftarLaporan.map((item) => (
          <button
            key={item.id}
            onClick={() => setJenisLaporan(item.id)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold transition text-center flex flex-col items-center justify-center gap-1 leading-tight ${
              jenisLaporan === item.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />

          {/* RT Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Filter RT:</span>
            <select
              value={filterRt}
              onChange={(e) => setFilterRt(e.target.value)}
              className="py-1 px-2.5 border border-slate-300 rounded-lg text-xs"
            >
              <option value="Semua">Semua RT</option>
              {['01', '02', '03', '04', '05', '06', '07', '08'].map((rt) => (
                <option key={rt} value={rt}>
                  RT {rt}
                </option>
              ))}
            </select>
          </div>

          {/* Program Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Program:</span>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="py-1 px-2.5 border border-slate-300 rounded-lg text-xs"
            >
              <option value="Semua">Semua Program</option>
              {programBansos.map((prog) => (
                <option key={prog.id} value={prog.kode}>
                  {prog.kode}
                </option>
              ))}
            </select>
          </div>

          {/* Periode Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Periode:</span>
            <select
              value={filterPeriode}
              onChange={(e) => setFilterPeriode(e.target.value)}
              className="py-1 px-2.5 border border-slate-300 rounded-lg text-xs"
            >
              <option value="Semua">Tahun 2026 (Semua)</option>
              <option value="Tahap I - 2026">Tahap I - 2026</option>
              <option value="Tahap II - 2026">Tahap II - 2026</option>
              <option value="Triwulan I - 2026">Triwulan I - 2026</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Jumlah Baris:</span>
          <span className="font-bold text-slate-800">{report.rawCount} Data</span>
        </div>
      </div>

      {/* Report Preview Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Document Header Preview (Simulated Kop Surat) */}
        <div className="text-center pb-4 border-b-2 border-slate-800 space-y-0.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            PEMERINTAH KOTA / KABUPATEN {kelurahan.kotaKabupaten.toUpperCase()}
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            KECAMATAN {kelurahan.kecamatan.toUpperCase()}
          </p>
          <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
            KANTOR KELURAHAN {kelurahan.namaKelurahan.toUpperCase()}
          </h3>
          <p className="text-[11px] text-slate-500">
            {kelurahan.alamatKantor} • Telp: {kelurahan.telepon} • Pos: {kelurahan.kodePos} • Email: {kelurahan.email}
          </p>
        </div>

        {/* Report Title */}
        <div className="text-center space-y-1">
          <h4 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
            {report.title}
          </h4>
          <p className="text-xs text-slate-500">
            Dicetak pada: {new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date())}
          </p>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-white font-semibold">
              <tr>
                {report.headers.map((h, i) => (
                  <th key={i} className="py-2.5 px-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2.5 px-3 text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Box */}
        {report.summary.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-6 text-xs">
            <span className="font-bold text-slate-800">Ringkasan Rekapitulasi:</span>
            {report.summary.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-slate-500">{item.label}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Signature Preview */}
        <div className="pt-6 grid grid-cols-2 text-xs text-slate-800">
          <div className="space-y-1">
            <p>Mengetahui,</p>
            <p className="font-bold">Lurah {kelurahan.namaKelurahan}</p>
            <div className="h-16"></div>
            <p className="font-bold underline">{kelurahan.namaLurah}</p>
            <p className="text-[11px] text-slate-500">NIP. {kelurahan.nipLurah}</p>
          </div>
          <div className="space-y-1 text-right">
            <p>{kelurahan.kotaKabupaten}, {formatTanggal(new Date().toISOString().slice(0, 10))}</p>
            <p className="font-bold">Kasi Kesejahteraan Sosial</p>
            <div className="h-16"></div>
            <p className="font-bold underline">{kelurahan.namaKasiKesra}</p>
            <p className="text-[11px] text-slate-500">NIP. {kelurahan.nipKasiKesra}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

