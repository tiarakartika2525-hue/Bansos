import React from 'react';
import { useBansos } from '../../context/BansosContext';
import { StatCard } from '../UI/StatCard';
import { SimpleBarChart, SimpleDonutChart } from '../UI/CustomChart';
import { StatusPengajuanBadge } from '../UI/Badges';
import {
  Users,
  UserCheck,
  Award,
  Clock,
  XCircle,
  ArrowRight,
  ClipboardCheck,
  AlertCircle,
  Truck,
  PlusCircle,
} from 'lucide-react';
import { formatTanggal, maskNik } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const { stats, pengajuan, penyaluran, setAdminMenu } = useBansos();

  const pendingList = pengajuan.filter((p) => p.status === 'Menunggu Verifikasi').slice(0, 5);

  const programChartData = stats.penerimaPerProgram.map((item) => ({
    label: item.kode,
    sublabel: item.nama.slice(0, 15) + (item.nama.length > 15 ? '...' : ''),
    value: item.jumlah,
  }));

  const rtRwChartData = stats.penerimaPerRtRw.map((item) => ({
    label: item.rtRw,
    value: item.jumlah,
    color: '#2563eb',
  }));

  const totalDisalurkan = penyaluran.filter((d) => d.statusPenyaluran === 'Sudah disalurkan').length;
  const totalSedangProses = penyaluran.filter((d) => d.statusPenyaluran === 'Sedang diproses').length;
  const totalBelumDisalurkan = penyaluran.filter((d) => d.statusPenyaluran === 'Belum disalurkan').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-2xl p-6 text-white shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Dashboard Pengelolaan Bantuan Sosial</h2>
          <p className="text-xs text-blue-100 mt-1">
            Ringkasan kependudukan, calon penerima, verifikasi faktual, dan penetapan bansos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminMenu('data-warga')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-xs transition border border-white/20 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Warga</span>
          </button>
          <button
            onClick={() => setAdminMenu('verifikasi-pengajuan')}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Verifikasi Pengajuan</span>
          </button>
        </div>
      </div>

      {/* 5 MANDATORY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Data Warga"
          value={stats.totalWarga}
          subtitle="Identitas terdaftar"
          icon={<Users className="w-5 h-5" />}
          colorScheme="blue"
          onClick={() => setAdminMenu('data-warga')}
        />
        <StatCard
          title="Calon Penerima"
          value={stats.totalCalonPenerima}
          subtitle="Pengajuan masuk"
          icon={<UserCheck className="w-5 h-5" />}
          colorScheme="indigo"
          onClick={() => setAdminMenu('pendaftaran-calon')}
        />
        <StatCard
          title="Penerima Bansos"
          value={stats.totalPenerimaBansos}
          subtitle="Ditetapkan SK"
          icon={<Award className="w-5 h-5" />}
          colorScheme="emerald"
          onClick={() => setAdminMenu('data-penerima')}
        />
        <StatCard
          title="Menunggu Verifikasi"
          value={stats.totalMenungguVerifikasi}
          subtitle="Perlu ditinjau"
          icon={<Clock className="w-5 h-5" />}
          colorScheme="amber"
          onClick={() => setAdminMenu('verifikasi-pengajuan')}
        />
        <StatCard
          title="Pengajuan Ditolak"
          value={stats.totalDitolak}
          subtitle="Tidak lolos syarat"
          icon={<XCircle className="w-5 h-5" />}
          colorScheme="rose"
          onClick={() => setAdminMenu('verifikasi-pengajuan')}
        />
      </div>

      {/* 2 MANDATORY CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <SimpleBarChart
            title="Grafik Jumlah Penerima Bantuan (Per Program Bansos)"
            data={programChartData}
            height={250}
            valueSuffix=" KPM"
          />
        </div>

        <div className="lg:col-span-5">
          <SimpleDonutChart
            title="Proporsi Penerima Bantuan Berdasarkan Program"
            data={programChartData.map((d) => ({ label: d.label, value: d.value }))}
            centerText={String(stats.totalPenerimaBansos)}
            centerSubtext="KPM Ditetapkan"
          />
        </div>

        <div className="lg:col-span-12">
          <SimpleBarChart
            title="Grafik Penerima Bantuan Berdasarkan Wilayah RT/RW"
            data={rtRwChartData}
            height={230}
            valueSuffix=" Penerima"
          />
        </div>
      </div>

      {/* 2 Bottom Widgets: Pending Approvals & Penyaluran Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending list */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-800">Antrean Pengajuan Menunggu Verifikasi</h3>
            </div>
            <button
              onClick={() => setAdminMenu('verifikasi-pengajuan')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Lihat Semua ({stats.totalMenungguVerifikasi})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">No Reg</th>
                    <th className="py-2.5 px-3">Nama Pemohon</th>
                    <th className="py-2.5 px-3">Program</th>
                    <th className="py-2.5 px-3">Wilayah</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-blue-600 font-semibold">{item.noPendaftaran}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{item.namaLengkap}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{item.programKode}</td>
                      <td className="py-2.5 px-3 text-slate-600">RT {item.rt}/RW {item.rw}</td>
                      <td className="py-2.5 px-3 text-slate-500">{formatTanggal(item.tanggalPengajuan)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setAdminMenu('verifikasi-pengajuan')}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-md font-semibold text-[11px] transition"
                        >
                          Tinjau
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              <AlertCircle className="w-6 h-6 mx-auto mb-1 text-slate-300" />
              Tidak ada antrean pengajuan yang menunggu verifikasi saat ini.
            </div>
          )}
        </div>

        {/* Penyaluran Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-800">Status Penyaluran</h3>
              </div>
              <button
                onClick={() => setAdminMenu('penyaluran-bantuan')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Detail
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="font-semibold text-emerald-800">✓ Sudah Disalurkan</span>
                <span className="font-bold text-emerald-900 text-sm">{totalDisalurkan} KPM</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                <span className="font-semibold text-blue-800">⏳ Sedang Diproses</span>
                <span className="font-bold text-blue-900 text-sm">{totalSedangProses} KPM</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                <span className="font-semibold text-amber-800">⏱ Belum Disalurkan</span>
                <span className="font-bold text-amber-900 text-sm">{totalBelumDisalurkan} KPM</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAdminMenu('penyaluran-bantuan')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <span>Buka Menu Penyaluran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

