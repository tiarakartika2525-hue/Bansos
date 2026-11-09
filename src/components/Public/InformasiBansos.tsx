import React from 'react';
import { useBansos } from '../../context/BansosContext';
import type { ProgramBansos } from '../../types';
import { StatusProgramBadge } from '../UI/Badges';
import { Layers, CheckCircle2, Clock, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export const InformasiBansos: React.FC = () => {
  const { programBansos, setActiveTab } = useBansos();

  const handleAjukan = (kode: string) => {
    sessionStorage.setItem('selected_program_kode', kode);
    setActiveTab('pendaftaran-online');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Katalog Program Perlindungan Sosial</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Informasi Program Bantuan Sosial Kelurahan
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Pemerintah menyediakan beragam skema bantuan sosial bersyarat dan non-tunai untuk membantu meringankan
          beban hidup keluarga rentan dan prasejahtera.
        </p>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programBansos.map((prog: ProgramBansos) => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-blue-600 text-white shadow-xs">
                  {prog.kode}
                </span>
                <StatusProgramBadge status={prog.status} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{prog.nama}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{prog.keterangan}</p>
              </div>

              {/* Meta items */}
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Periode Bantuan:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{prog.periode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Kuota Penerima:</span>
                  </span>
                  <span className="font-bold text-slate-800">{prog.kuota} KPM</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">Besaran Bantuan:</span>
                  <span className="font-extrabold text-emerald-700">{prog.nominal}</span>
                </div>
              </div>

              {/* Persyaratan list */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Persyaratan Utama:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {prog.persyaratan.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Action */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-100">
              <button
                onClick={() => handleAjukan(prog.kode)}
                disabled={prog.status !== 'Aktif'}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Daftar Calon Penerima {prog.kode}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
