import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import { Building2, Save, CheckCircle, ShieldCheck } from 'lucide-react';

export const PengaturanKelurahanView: React.FC = () => {
  const { kelurahan, updateKelurahan } = useBansos();

  const [formData, setFormData] = useState(kelurahan);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateKelurahan(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Pengaturan Profil Kelurahan & Pejabat Penandatangan</span>
        </h2>
        <p className="text-xs text-slate-500">
          Ubah nama kelurahan, alamat kantor, pejabat Lurah, dan Kasi Kesra. Informasi ini otomatis diterapkan pada
          kop surat laporan PDF dan sertifikat penetapan.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-900 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Perubahan profil kelurahan berhasil disimpan dan disinkronkan ke seluruh sistem!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs">
        {/* Instansi */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Identitas Instansi Pemerintah</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Kelurahan</label>
              <input
                type="text"
                value={formData.namaKelurahan}
                onChange={(e) => setFormData({ ...formData, namaKelurahan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                value={formData.kotaKabupaten}
                onChange={(e) => setFormData({ ...formData, kotaKabupaten: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
              <input
                type="text"
                value={formData.provinsi}
                onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kode Pos</label>
              <input
                type="text"
                value={formData.kodePos}
                onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon Kantor / Hotline</label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Kantor Kelurahan</label>
              <input
                type="text"
                value={formData.alamatKantor}
                onChange={(e) => setFormData({ ...formData, alamatKantor: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Email Resmi Kelurahan</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Pejabat Penandatangan */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
            Pejabat Berwenang Penandatangan Dokumen & Laporan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Lurah (Beserta Gelar)</label>
              <input
                type="text"
                value={formData.namaLurah}
                onChange={(e) => setFormData({ ...formData, namaLurah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Lurah</label>
              <input
                type="text"
                value={formData.nipLurah}
                onChange={(e) => setFormData({ ...formData, nipLurah: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Kasi Kesejahteraan Sosial</label>
              <input
                type="text"
                value={formData.namaKasiKesra}
                onChange={(e) => setFormData({ ...formData, namaKasiKesra: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIP Kasi Kesra</label>
              <input
                type="text"
                value={formData.nipKasiKesra}
                onChange={(e) => setFormData({ ...formData, nipKasiKesra: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Kelurahan</span>
          </button>
        </div>
      </form>
    </div>
  );
};

