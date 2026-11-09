import React from 'react';
import { useBansos } from '../context/BansosContext';
import { Building2, Phone, Mail, MapPin, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  const { kelurahan, setActiveTab } = useBansos();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Identitas */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">KELURAHAN {kelurahan.namaKelurahan.toUpperCase()}</h3>
                <p className="text-xs text-slate-400">Pemerintah {kelurahan.kotaKabupaten}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Portal Pelayanan Terpadu Bantuan Sosial untuk memastikan penyaluran bansos tepat sasaran, berkeadilan,
              dan transparan bagi seluruh warga prasejahtera.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Sistem Terintegrasi DTKS & P3KE</span>
            </div>
          </div>

          {/* Col 2: Kontak Kantor */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Kontak & Lokasi</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{kelurahan.alamatKantor}, Kec. {kelurahan.kecamatan}, Kode Pos {kelurahan.kodePos}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{kelurahan.telepon} (Layanan Pengaduan)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{kelurahan.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Senin - Jumat: 08.00 - 15.00 WIB (Sabtu/Minggu & Hari Libur Tutup)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Akses Layanan</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('informasi-bansos')}
                  className="hover:text-white transition hover:underline"
                >
                  Daftar Program Bansos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('persyaratan')}
                  className="hover:text-white transition hover:underline"
                >
                  Persyaratan & Kriteria Kemiskinan
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('cara-pendaftaran')}
                  className="hover:text-white transition hover:underline"
                >
                  Alur & Cara Pendaftaran
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('pendaftaran-online')}
                  className="hover:text-white transition hover:underline text-blue-400"
                >
                  Pendaftaran Mandiri Online
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('cek-status')}
                  className="hover:text-white transition hover:underline text-amber-400"
                >
                  Cek Status NIK / Pendaftaran
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('pengumuman')}
                  className="hover:text-white transition hover:underline"
                >
                  Pengumuman & Jadwal Pencairan
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Pengaduan & Bantuan */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Layanan Pengaduan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Masyarakat dapat melaporkan adanya dugaan salah sasaran, pungutan liar, atau kendala dalam penerimaan bantuan sosial.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                <HeartHandshake className="w-4 h-4" />
                <span>Posko Pengaduan Kelurahan</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Hubungi Hotline Seksi Kesejahteraan Sosial: <strong>(021) 7788-1234 ext 2</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="text-center md:text-left leading-relaxed">
            © {new Date().getFullYear()} Pemerintah Kelurahan {kelurahan.namaKelurahan}. Hak Cipta Dilindungi Undang-Undang.
            <br />
            <span className="text-[11px] text-slate-600">
              Perlu diperhatikan: Informasi status dalam website kelurahan ini tidak otomatis menentukan kelayakan mutlak
              atau menggantikan keputusan resmi Kementerian Sosial / Instansi yang berwenang.
            </span>
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>UU Keterbukaan Informasi Publik</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

