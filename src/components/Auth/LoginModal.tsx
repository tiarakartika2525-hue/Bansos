import React, { useState } from 'react';
import { Modal } from '../UI/Modal';
import { useBansos } from '../../context/BansosContext';
import { Shield, UserCheck, Key, Lock, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login } = useBansos();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Harap masukkan username dan password');
      return;
    }

    // Demo credentials
    if (username.toLowerCase().includes('verifikator') || username.toLowerCase().includes('petugas')) {
      login(username, 'verifikator');
    } else {
      login(username, 'admin');
    }

    setError('');
    onClose();
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleQuickLogin = (role: 'admin' | 'verifikator') => {
    const user = role === 'admin' ? 'admin.metropusat' : 'petugas.kesra';
    login(user, role);
    setError('');
    onClose();
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login Petugas Kelurahan" maxWidth="md">
      <div className="space-y-5">
        <div className="text-center pb-2">
          <div className="inline-flex p-3 rounded-full bg-blue-100 text-blue-700 mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Halaman ini khusus untuk aparatur kelurahan dan petugas verifikator bansos resmi.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Username / NIP Petugas</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <UserCheck className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username atau NIP"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            Masuk ke Panel Petugas
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium">Atau Akses Cepat Demo</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="flex flex-col items-center p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition group text-left"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <Key className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800 text-center">Admin Kelurahan</span>
            <span className="text-[10px] text-slate-500 text-center">Kelola semua data & SK</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('verifikator')}
            className="flex flex-col items-center p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group text-left"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800 text-center">Petugas Verifikasi</span>
            <span className="text-[10px] text-slate-500 text-center">Survei & validasi berkas</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

