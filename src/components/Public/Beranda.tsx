import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import { StatCard } from '../UI/StatCard';
import { SimpleBarChart, SimpleDonutChart } from '../UI/CustomChart';
import {
  Users,
  UserCheck,
  Award,
  Clock,
  XCircle,
  Search,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const Beranda: React.FC = () => {
  const { kelurahan, stats, programBansos, pengumuman, setActiveTab } = useBansos();
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;
    // Set query in session or trigger cek-status
    sessionStorage.setItem('quick_search_query', quickSearch.trim());
    setActiveTab('cek-status');
  };

  // Format data for chart
  const programChartData = stats.penerimaPerProgram.map((item) => ({
    label: item.kode,
    sublabel: item.nama.slice(0, 18) + (item.nama.length > 18 ? '...' : ''),
    value: item.jumlah,
  }));

  const rtRwChartData = stats.penerimaPerRtRw.map((item) => ({
    label: item.rtRw,
    value: item.jumlah,
    color: '#3b82f6',
  }));

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white py-14 sm:py-20 px-4 sm:px-6 rounded-b-3xl shadow-xl">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Portal Resmi Bansos Kelurahan {kelurahan.namaKelurahan} Tahun 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight">
            Transparansi & Kemudahan Akses <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300">
              Bantuan Sosial untuk Masyarakat
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Periksa status kelayakan, pantau penyaluran secara terbuka, dan ajukan diri sebagai calon penerima
            bantuan sosial terverifikasi secara daring tanpa perantara.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <form onSubmit={handleQuickSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Masukkan 16 Digit NIK atau No. Pendaftaran (REG-XXXX)..."
                className="w-full pl-5 pr-32 py-3.5 text-sm rounded-2xl bg-white text-slate-800 placeholder-slate-400 shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/50"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cek Status</span>
              </button>
            </form>
            <p className="text-[11px] text-slate-400 mt-2">
              Contoh NIK demo: <span className="text-blue-300 font-mono">3201011503780001</span> atau No Reg:{' '}
              <span className="text-blue-300 font-mono">REG-2026-0101</span>
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('pendaftaran-online')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
            >
              <span>Daftar Calon Penerima</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('cara-pendaftaran')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition border border-white/20 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Panduan & Syarat</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* STATISTIK CARDS - 5 MANDATORY METRICS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Statistik Data Pengelolaan Bansos</h2>
              <p className="text-xs text-slate-500">
                Pembaruan data real-time terintegrasi di Kelurahan {kelurahan.namaKelurahan}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              ● Data Terverifikasi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Data Warga"
              value={stats.totalWarga.toLocaleString('id-ID')}
              subtitle="Tercatat di Kelurahan"
              icon={<Users className="w-5 h-5" />}
              colorScheme="blue"
            />
            <StatCard
              title="Calon Penerima"
              value={stats.totalCalonPenerima}
              subtitle="Mengajukan Bansos"
              icon={<UserCheck className="w-5 h-5" />}
              colorScheme="indigo"
            />
            <StatCard
              title="Penerima Bansos"
              value={stats.totalPenerimaBansos}
              subtitle="SK Penetapan Aktif"
              icon={<Award className="w-5 h-5" />}
              colorScheme="emerald"
            />
            <StatCard
              title="Menunggu Verifikasi"
              value={stats.totalMenungguVerifikasi}
              subtitle="Proses Berkas & Survei"
              icon={<Clock className="w-5 h-5" />}
              colorScheme="amber"
            />
            <StatCard
              title="Pengajuan Ditolak"
              value={stats.totalDitolak}
              subtitle="Tidak Memenuhi Syarat"
              icon={<XCircle className="w-5 h-5" />}
              colorScheme="rose"
            />
          </div>
        </section>

        {/* GRAFIK - 2 MANDATORY CHARTS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Visualisasi & Grafik Distribusi</h2>
              <p className="text-xs text-slate-500">
                Grafik jumlah penerima bantuan sosial berdasarkan jenis program dan sebaran wilayah RT/RW
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Jumlah Penerima Berdasarkan Program */}
            <div className="lg:col-span-7 flex flex-col">
              <SimpleBarChart
                title="Grafik Jumlah Penerima Berdasarkan Jenis Program Bantuan"
                data={programChartData}
                height={260}
                valueSuffix=" KPM"
              />
            </div>

            {/* Donut Chart Program breakdown */}
            <div className="lg:col-span-5 flex flex-col">
              <SimpleDonutChart
                title="Proporsi Penerima Bantuan Aktif"
                data={programChartData.map((d) => ({
                  label: d.label,
                  value: d.value,
                }))}
                centerText={String(stats.totalPenerimaBansos)}
                centerSubtext="KPM Terdaftar"
              />
            </div>

            {/* Chart 2: Penerima Berdasarkan Wilayah RT/RW */}
            <div className="lg:col-span-12">
              <SimpleBarChart
                title="Grafik Penerima Bantuan Sosial Berdasarkan Wilayah RT / RW"
                data={rtRwChartData}
                height={230}
                valueSuffix=" Penerima"
              />
            </div>
          </div>
        </section>

        {/* PROGRAM BANSOS SHOWCASE */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Daftar Program Bantuan Sosial</h2>
              <p className="text-xs text-slate-500">Program perlindungan sosial yang sedang aktif di kelurahan</p>
            </div>
            <button
              onClick={() => setActiveTab('informasi-bansos')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Lihat Detail Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programBansos.slice(0, 3).map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                      {prog.kode}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      ● {prog.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{prog.nama}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{prog.keterangan}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Nominal:</span>
                    <span className="font-bold text-emerald-700">{prog.nominal}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Periode:</span>
                    <span className="font-medium text-slate-700">{prog.periode}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('pendaftaran-online')}
                    className="w-full mt-2 py-2 px-3 bg-slate-50 hover:bg-blue-50 text-blue-700 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 border border-slate-200"
                  >
                    <span>Ajukan Program Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PENGUMUMAN TERBARU */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pengumuman & Agenda Penting</h2>
              <p className="text-xs text-slate-500">Informasi resmi penyaluran dan jadwal kegiatan bansos</p>
            </div>
            <button
              onClick={() => setActiveTab('pengumuman')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Semua Pengumuman</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pengumuman.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveTab('pengumuman')}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {item.kategori}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.tanggal}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition">
                    {item.judul}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.ringkasan}</p>
                </div>
                <div className="mt-3 pt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                  <span>Baca selengkapnya</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* IMPORTANT NOTICE / DISCLAIMER BANNER */}
        <section className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
            <p className="font-bold text-sm text-amber-950">Catatan Penting Pelayanan Bansos Kelurahan:</p>
            <p>
              Status pengajuan atau pencatatan dalam website kelurahan berfungsi sebagai media pendataan, verifikasi
              awal, dan transparansi publik. Status ini tidak otomatis menentukan kelayakan mutlak atau menggantikan
              keputusan resmi dari Kementerian Sosial RI maupun instansi vertikal berwenang lainnya.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

