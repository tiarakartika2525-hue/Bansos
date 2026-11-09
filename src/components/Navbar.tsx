import React, { useState } from 'react';
import { useBansos } from '../context/BansosContext';
import {
  Building2,
  Home,
  Info,
  CheckCircle2,
  HelpCircle,
  Search,
  Bell,
  Lock,
  LogOut,
  Menu,
  X,
  UserPlus,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { LoginModal } from './Auth/LoginModal';

export const Navbar: React.FC = () => {
  const { kelurahan, auth, activeTab, setActiveTab, setAdminMenu, logout } = useBansos();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: <Home className="w-4 h-4" /> },
    { id: 'informasi-bansos', label: 'Informasi Bansos', icon: <Info className="w-4 h-4" /> },
    { id: 'persyaratan', label: 'Persyaratan Penerima', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'cara-pendaftaran', label: 'Cara Pendaftaran', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'pendaftaran-online', label: 'Pendaftaran Bansos', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'cek-status', label: 'Cek Status Penerima', icon: <Search className="w-4 h-4" /> },
    { id: 'pengumuman', label: 'Pengumuman', icon: <Bell className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToAdmin = () => {
    setActiveTab('admin');
    setAdminMenu('dashboard');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        {/* Top Info Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-[11px] py-1 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium tracking-wide">
                Pemerintah {kelurahan.kotaKabupaten} • Kecamatan {kelurahan.kecamatan}
              </span>
              <span className="hidden md:inline text-blue-200">|</span>
              <span className="hidden md:inline text-blue-100">
                Layanan Terpadu Bantuan Sosial Terintegrasi DTKS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Portal Resmi
              </span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18">
            {/* Logo and Kelurahan Name */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavClick('beranda')}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                    KELURAHAN {kelurahan.namaKelurahan.toUpperCase()}
                  </h1>
                </div>
                <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">
                  Sistem Informasi & Pengelolaan Bantuan Sosial
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Action Button: Admin / Petugas */}
            <div className="hidden sm:flex items-center gap-2">
              {auth.isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGoToAdmin}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs ${
                      activeTab === 'admin'
                        ? 'bg-blue-700 text-white shadow-blue-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Panel Petugas</span>
                  </button>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Login Admin</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {auth.isLoggedIn ? (
                <>
                  <button
                    onClick={handleGoToAdmin}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-blue-600 text-white font-semibold text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Masuk ke Panel Petugas</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg border border-red-200 text-red-600 font-semibold text-xs hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar (Logout)</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-slate-900 text-white font-semibold text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login Admin / Petugas</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => {
          setActiveTab('admin');
          setAdminMenu('dashboard');
        }}
      />
    </>
  );
};

