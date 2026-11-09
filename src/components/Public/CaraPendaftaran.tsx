import React from 'react';
import { useBansos } from '../../context/BansosContext';
import {
  FileText,
  UserCheck,
  Home,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ClipboardList,
  CalendarCheck,
  Search,
} from 'lucide-react';

export const CaraPendaftaran: React.FC = () => {
  const { kelurahan, setActiveTab } = useBansos();

  const steps = [
    {
      num: '01',
      title: 'Persiapan Berkas Administrasi',
      desc: 'Siapkan dokumen resmi berupa e-KTP, Kartu Keluarga (KK), Surat Pengantar RT/RW, dan foto kondisi rumah tinggal.',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      num: '02',
      title: 'Pengajuan Mandiri (Online / Loket)',
      desc: `Isi formulir pendaftaran melalui website ini pada menu "Pendaftaran Bansos" atau datang langsung ke loket pelayanan Kelurahan ${kelurahan.namaKelurahan}.`,
      icon: <ClipboardList className="w-6 h-6 text-indigo-600" />,
    },
    {
      num: '03',
      title: 'Verifikasi Berkas & Administrasi',
      desc: 'Petugas Seksi Kesejahteraan Sosial memvalidasi kesesuaian data NIK dengan Disdukcapil dan memeriksa kelengkapan bukti.',
      icon: <UserCheck className="w-6 h-6 text-purple-600" />,
    },
    {
      num: '04',
      title: 'Kunjungan & Survei Lapangan',
      desc: 'Tim verifikator kelurahan mengunjungi rumah pemohon untuk menilai kondisi fisik tempat tinggal, daya listrik, dan kelayakan ekonomi.',
      icon: <Home className="w-6 h-6 text-amber-600" />,
    },
    {
      num: '05',
      title: 'Musyawarah Kelurahan (Muskel)',
      desc: 'Hasil verifikasi dibahas dalam forum Muskel bersama Lurah, RT, RW, dan Tokoh Masyarakat untuk diterbitkan Surat Keputusan Penetapan.',
      icon: <CalendarCheck className="w-6 h-6 text-emerald-600" />,
    },
    {
      num: '06',
      title: 'Pencairan / Penyaluran Bansos',
      desc: 'Penerima yang ditetapkan mendapatkan jadwal penyaluran melalui Bank Himbara / PT Pos / Pengambilan di Balai Kelurahan.',
      icon: <CheckCircle className="w-6 h-6 text-teal-600" />,
    },
  ];

  const faqs = [
    {
      q: 'Berapa lama proses dari pengajuan hingga penetapan?',
      a: 'Proses verifikasi berkas dan survei lapangan biasanya berlangsung 3 hingga 7 hari kerja. Penetapan resmi dilakukan secara berkala melalui Musyawarah Kelurahan setiap periode berjalan.',
    },
    {
      q: 'Apakah pendaftaran bantuan sosial dipungut biaya?',
      a: `Sama sekali TIDAK ADA BIAYA (100% GRATIS). Kelurahan ${kelurahan.namaKelurahan} menerapkan zero tolerance terhadap segala bentuk pungutan liar atau gratifikasi.`,
    },
    {
      q: 'Bagaimana jika pengajuan saya ditolak?',
      a: 'Sistem dan petugas akan memberikan alasan penolakan secara transparan (misalnya penghasilan di atas kriteria). Anda berhak mengajukan keberatan atau berkonsultasi langsung ke Seksi Kesra.',
    },
    {
      q: 'Bagaimana cara mengetahui pengajuan saya sudah diproses?',
      a: 'Simpan Nomor Pendaftaran (contoh: REG-2026-XXXX) yang diberikan saat selesai mengisi formulir, lalu pantau secara langsung melalui menu Cek Status Penerima.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Alur Layanan Transparan & Cepat</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Cara dan Alur Pendaftaran Bantuan Sosial
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Ikuti 6 langkah mudah berikut untuk mengajukan diri atau keluarga Anda sebagai calon penerima bantuan
          sosial di lingkungan Kelurahan {kelurahan.namaKelurahan}.
        </p>
      </div>

      {/* Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((st) => (
          <div
            key={st.num}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition relative group overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-3xl font-black text-slate-100 group-hover:text-blue-100 transition">
              {st.num}
            </div>
            <div className="p-3 bg-slate-50 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              {st.icon}
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">{st.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <button
          onClick={() => setActiveTab('pendaftaran-online')}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
        >
          <span>Buka Formulir Pendaftaran Online</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTab('cek-status')}
          className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition flex items-center gap-2 border border-slate-300"
        >
          <Search className="w-4 h-4" />
          <span>Cek Status Pengajuan Saya</span>
        </button>
      </div>

      {/* FAQ Section */}
      <div className="pt-6 border-t border-slate-200 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-xl font-bold text-slate-900">Pertanyaan yang Sering Diajukan (FAQ)</h3>
          <p className="text-xs text-slate-500">Hal penting seputar pendaftaran dan seleksi bantuan sosial</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-start gap-2">
                <span className="text-blue-600 font-bold">Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

