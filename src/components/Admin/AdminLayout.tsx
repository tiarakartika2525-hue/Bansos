import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import {
  LayoutDashboard,
  Users,
  Layers,
  UserPlus,
  ClipboardCheck,
  Award,
  Truck,
  FileSpreadsheet,
  Bell,
  Settings,
  LogOut,
  ExternalLink,
  RotateCcw,
  Menu,
  X,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { kelurahan, auth, adminMenu, setAdminMenu, setActiveTab, logout, stats, resetToDefaultData } =
    useBansos();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard & Statistik', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'data-warga',
      label: '3. Data Warga',
      icon: <Users className="w-4 h-4" />,
      badge: stats.totalWarga,
    },
    { id: 'program-bansos', label: '4. Program Bansos', icon: <Layers className="w-4 h-4" /> },
    { id: 'pendaftaran-calon', label: '5. Pendaftaran Calon', icon: <UserPlus className="w-4 h-4" /> },
    {
      id: 'verifikasi-pengajuan',
      label: '6. Verifikasi Pengajuan',
      icon: <ClipboardCheck className="w-4 h-4" />,
      badge: stats.totalMenungguVerifikasi > 0 ? stats.totalMenungguVerifikasi : undefined,
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'data-penerima',
      label: '7. Penerima Bansos (SK)',
      icon: <Award className="w-4 h-4" />,
      badge: stats.totalPenerimaBansos,
    },
    { id: 'penyaluran-bantuan', label: '8. Penyaluran Bantuan', icon: <Truck className="w-4 h-4" /> },
    { id: 'laporan', label: '10. Laporan Pengelolaan', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'kelola-pengumuman', label: 'Kelola Pengumuman', icon: <Bell className="w-4 h-4" /> },
    { id: 'pengaturan-kelurahan', label: 'Pengaturan Kelurahan', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelectMenu = (id: string) => {
    setAdminMenu(id);
    setMobileSidebarOpen(false);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh database ke contoh data awal?')) {
      resetToDefaultData();
      alert('Data sistem telah berhasil direset ke data default.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm sm:text-base text-slate-800 leading-none">
                  KELURAHAN {kelurahan.namaKelurahan.toUpperCase()}
                </h2>
                <span className="text-[11px] text-slate-500 font-medium">Panel Pengelolaan Bansos</span>
              </div>
            </div>
          </div>

          {/* User profile & switches */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('beranda')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition border border-blue-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website Publik</span>
            </button>

            <button
              onClick={handleReset}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
              title="Reset Database ke Seed Awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Data Demo</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-800">{auth.namaLengkap || 'Aparatur Kelurahan'}</p>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {auth.role === 'admin' ? 'Administrator' : 'Verifikator'}
                </span>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 p-4 justify-between border-r border-slate-800 flex-shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Navigasi
            </div>
            {menuItems.map((item) => {
              const isActive = adminMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectMenu(item.id)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        item.badgeColor || 'bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sistem Aktif</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Kelurahan {kelurahan.namaKelurahan} • Server Lokal Aktif
            </p>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-slate-900/60" onClick={() => setMobileSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-300 p-4 flex flex-col justify-between shadow-2xl z-50">
              <div className="space-y-1 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">Menu Kelurahan</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {menuItems.map((item) => {
                  const isActive = adminMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectMenu(item.id)}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-700 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('beranda');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 bg-blue-700 text-white rounded-lg text-xs font-bold"
                >
                  Lihat Website Warga
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Reset Data Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

