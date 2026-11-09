import React from 'react';
import { useBansos } from '../../context/BansosContext';
import {
  FileText,
  Home,
  AlertTriangle,
  FileCheck2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const PersyaratanPenerima: React.FC = () => {
  const { kelurahan, setActiveTab } = useBansos();

  const dokumenWajib = [
    {
      title: 'KTP Elektronik (e-KTP)',
      desc: 'e-KTP asli dan fotokopi jelas dari Kepala Keluarga atau anggota keluarga bersangkutan dengan NIK terdaftar di Disdukcapil.',
    },
    {
      title: 'Kartu Keluarga (KK) Terbaru',
      desc: 'Salinan Kartu Keluarga yang telah diperbarui dengan barcode Dukcapil aktif dan seluruh anggota keluarga tertera lengkap.',
    },
    {
      title: 'Surat Keterangan Tidak Mampu (SKTM)',
      desc: 'Surat pengantar rekomendasi dari Ketua RT dan RW setempat yang menerangkan kondisi riil ekonomi keluarga.',
    },
    {
      title: 'Foto Kondisi Tempat Tinggal',
      desc: 'Foto tampak depan rumah, ruang keluarga, dapur, serta lantai/dinding sebagai bukti pendukung survei kelayakan.',
    },
    {
      title: 'Bukti Pendukung Tambahan',
      desc: 'Surat keterangan sakit menahun / surat keterangan disabilitas (jika ada komponen difabel), atau slip penghasilan tidak tetap.',
    },
  ];

  const kriteriaDTKS = [
    'Luas lantai tempat tinggal kurang dari 8 m² per anggota keluarga.',
    'Jenis lantai tempat tinggal terbuat dari tanah, ubin pudar, atau semen kasar berdebu.',
    'Jenis dinding tempat tinggal berupa bilik bambu, papan kayu lapuk, atau tembok tanpa plesteran.',
    'Tidak memiliki fasilitas sanitasi (jamban) sendiri atau menggunakan jamban umum bersama.',
    'Sumber penerangan rumah tangga menggunakan daya listrik 450 VA bersubsidi atau menumpang.',
    'Sumber air minum berasal dari sumur gali tak terlindung, mata air komunal, atau tadah air hujan.',
    'Pendapatan kepala keluarga di bawah upah minimum regional dan tidak memiliki tabungan bernilai tinggi.',
  ];

  const pihakDilarang = [
    'Aparatur Sipil Negara (PNS / PPPK)',
    'Anggota Tentara Nasional Indonesia (TNI)',
    'Anggota Kepolisian Republik Indonesia (POLRI)',
    'Pejabat Negara / Anggota Legislatif (DPR/DPRD)',
    'Karyawan BUMN / BUMD aktif atau pensiunan tetap',
    'Kepala Desa, Perangkat Desa, atau Perangkat Kelurahan yang berpenghasilan tetap',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Pedoman Standar Kelayakan Kemensos RI</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Persyaratan & Kriteria Penerima Bantuan Sosial
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Ketahui parameter kelayakan, dokumen yang harus disiapkan, serta kriteria seleksi yang digunakan tim
          verifikator Kelurahan {kelurahan.namaKelurahan}.
        </p>
      </div>

      {/* Grid: Dokumen Wajib & Kriteria DTKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dokumen Persyaratan */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Dokumen Persyaratan Administrasi</h3>
              <p className="text-xs text-slate-500">Berkas wajib diunggah saat pendaftaran online atau diserahkan ke loket</p>
            </div>
          </div>

          <div className="space-y-3">
            {dokumenWajib.map((doc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{doc.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{doc.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kriteria Kemiskinan Faktual */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Indikator Survei Kelayakan Lapangan</h3>
              <p className="text-xs text-slate-500">Parameter DTKS yang dinilai petugas verifikasi saat kunjungan rumah</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-3.5">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Calon penerima harus memenuhi sekurang-kurangnya 4 (empat) dari indikator kemiskinan faktual berikut:
            </p>
            <ul className="space-y-2.5">
              {kriteriaDTKS.map((kriteria, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{kriteria}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Larangan / Pihak yang tidak berhak */}
          <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2.5">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Pihak yang TIDAK BERHAK Menerima Bantuan Sosial:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-900/80">
              {pihakDilarang.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold">Merasa Memenuhi Kriteria di Atas?</h3>
          <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
            Ajukan permohonan bantuan secara online dengan menyiapkan foto/scan KTP, Kartu Keluarga, dan dokumen
            pendukung lainnya.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('pendaftaran-online')}
          className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 flex-shrink-0"
        >
          <span>Mulai Pendaftaran Online</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

