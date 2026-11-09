import React from 'react';
import { BansosProvider, useBansos } from './context/BansosContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Beranda } from './components/Public/Beranda';
import { InformasiBansos } from './components/Public/InformasiBansos';
import { PersyaratanPenerima } from './components/Public/PersyaratanPenerima';
import { CaraPendaftaran } from './components/Public/CaraPendaftaran';
import { FormPendaftaranPublic } from './components/Public/FormPendaftaranPublic';
import { CekStatusPublic } from './components/Public/CekStatusPublic';
import { PengumumanPublic } from './components/Public/PengumumanPublic';

// Admin Views
import { AdminLayout } from './components/Admin/AdminLayout';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { DataWargaView } from './components/Admin/DataWargaView';
import { ProgramBansosView } from './components/Admin/ProgramBansosView';
import { PendaftaranAdminView } from './components/Admin/PendaftaranAdminView';
import { VerifikasiPengajuanView } from './components/Admin/VerifikasiPengajuanView';
import { DataPenerimaView } from './components/Admin/DataPenerimaView';
import { PenyaluranBantuanView } from './components/Admin/PenyaluranBantuanView';
import { LaporanView } from './components/Admin/LaporanView';
import { KelolaPengumumanView } from './components/Admin/KelolaPengumumanView';
import { PengaturanKelurahanView } from './components/Admin/PengaturanKelurahanView';

import { Shield, Lock, ArrowLeft, Key, UserCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, adminMenu, auth, login } = useBansos();

  // If activeTab is 'admin'
  if (activeTab === 'admin') {
    // If not logged in, show elegant login card
    if (!auth.isLoggedIn) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">Login Panel Kelurahan</h2>
              <p className="text-xs text-slate-500">
                Silakan masuk untuk mengakses pengelolaan Data Warga, Verifikasi, dan Laporan.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => login('admin.metropusat', 'admin')}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Masuk sebagai Administrator Kelurahan</span>
              </button>

              <button
                onClick={() => login('verifikator.kesra', 'verifikator')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Masuk sebagai Petugas Verifikasi Lapangan</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('beranda')}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition flex items-center justify-center gap-1.5 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Beranda Warga</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If logged in, render the Admin Backoffice
    return (
      <AdminLayout>
        {adminMenu === 'dashboard' && <AdminDashboard />}
        {adminMenu === 'data-warga' && <DataWargaView />}
        {adminMenu === 'program-bansos' && <ProgramBansosView />}
        {adminMenu === 'pendaftaran-calon' && <PendaftaranAdminView />}
        {adminMenu === 'verifikasi-pengajuan' && <VerifikasiPengajuanView />}
        {adminMenu === 'data-penerima' && <DataPenerimaView />}
        {adminMenu === 'penyaluran-bantuan' && <PenyaluranBantuanView />}
        {adminMenu === 'laporan' && <LaporanView />}
        {adminMenu === 'kelola-pengumuman' && <KelolaPengumumanView />}
        {adminMenu === 'pengaturan-kelurahan' && <PengaturanKelurahanView />}
      </AdminLayout>
    );
  }

  // Public View
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {activeTab === 'beranda' && <Beranda />}
        {activeTab === 'informasi-bansos' && <InformasiBansos />}
        {activeTab === 'persyaratan' && <PersyaratanPenerima />}
        {activeTab === 'cara-pendaftaran' && <CaraPendaftaran />}
        {activeTab === 'pendaftaran-online' && <FormPendaftaranPublic />}
        {activeTab === 'cek-status' && <CekStatusPublic />}
        {activeTab === 'pengumuman' && <PengumumanPublic />}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BansosProvider>
      <MainContent />
    </BansosProvider>
  );
}
