import React from 'react';
import type { StatusPengajuan, StatusPenyaluran, StatusPenerimaan, StatusProgram } from '../../types';

export const StatusPengajuanBadge: React.FC<{ status: StatusPengajuan }> = ({ status }) => {
  switch (status) {
    case 'Disetujui':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Disetujui
        </span>
      );
    case 'Menunggu Verifikasi':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Menunggu Verifikasi
        </span>
      );
    case 'Perlu Perbaikan':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Perlu Perbaikan
        </span>
      );
    case 'Ditolak':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Ditolak
        </span>
      );
    default:
      return <span className="text-xs text-slate-500">{status}</span>;
  }
};

export const StatusPenyaluranBadge: React.FC<{ status: StatusPenyaluran }> = ({ status }) => {
  switch (status) {
    case 'Sudah disalurkan':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          ✓ Sudah Disalurkan
        </span>
      );
    case 'Sedang diproses':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          ⏳ Sedang Diproses
        </span>
      );
    case 'Belum disalurkan':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          ⏱ Belum Disalurkan
        </span>
      );
    case 'Gagal disalurkan':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ✕ Gagal Disalurkan
        </span>
      );
    default:
      return <span className="text-xs text-slate-500">{status}</span>;
  }
};

export const StatusPenerimaBadge: React.FC<{ status: StatusPenerimaan }> = ({ status }) => {
  switch (status) {
    case 'Aktif':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">
          Aktif KPM
        </span>
      );
    case 'Non-Aktif':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
          Non-Aktif
        </span>
      );
    case 'Selesai / Tergraduasi':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">
          Graduasi Mandiri
        </span>
      );
    default:
      return <span className="text-xs">{status}</span>;
  }
};

export const StatusProgramBadge: React.FC<{ status: StatusProgram }> = ({ status }) => {
  return status === 'Aktif' ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
      Aktif
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
      Tidak Aktif
    </span>
  );
};
