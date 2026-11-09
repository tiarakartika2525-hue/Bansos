import React, { useState, useEffect } from 'react';
import { useBansos } from '../../context/BansosContext';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  Search,
  Building2,
  Info,
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export const FormPendaftaranPublic: React.FC = () => {
  const { kelurahan, programBansos, submitPengajuan, setActiveTab } = useBansos();

  const [formData, setFormData] = useState({
    programKode: 'PKH',
    nik: '',
    namaLengkap: '',
    noKk: '',
    alamat: '',
    rt: '01',
    rw: '01',
    pekerjaan: '',
    penghasilan: 1000000,
    jumlahAnggotaKeluarga: 3,
    alasanPengajuan: '',
    fileKtp: '',
    fileKk: '',
    fileDokumenPendukung: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successRegNo, setSuccessRegNo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const preselected = sessionStorage.getItem('selected_program_kode');
    if (preselected) {
      setFormData((prev) => ({ ...prev, programKode: preselected }));
      sessionStorage.removeItem('selected_program_kode');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'penghasilan' || name === 'jumlahAnggotaKeluarga' ? Number(value) : value,
    }));
  };

  const handleFileUpload = (field: 'fileKtp' | 'fileKk' | 'fileDokumenPendukung', fileName: string) => {
    setFormData((prev) => ({ ...prev, [field]: fileName }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.nik || formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      setErrorMsg('NIK harus terdiri dari 16 digit angka.');
      return;
    }
    if (!formData.noKk || formData.noKk.length !== 16 || !/^\d+$/.test(formData.noKk)) {
      setErrorMsg('Nomor KK harus terdiri dari 16 digit angka.');
      return;
    }
    if (!formData.namaLengkap.trim()) {
      setErrorMsg('Nama lengkap pemohon wajib diisi.');
      return;
    }
    if (!formData.alamat.trim()) {
      setErrorMsg('Alamat domisili wajib diisi.');
      return;
    }
    if (!formData.alasanPengajuan.trim()) {
      setErrorMsg('Mohon jelaskan alasan pengajuan bantuan sosial Anda.');
      return;
    }

    const prog = programBansos.find((p) => p.kode === formData.programKode);

    const regNo = submitPengajuan({
      programId: prog?.id || 'prog-1',
      programKode: formData.programKode,
      programNama: prog?.nama || formData.programKode,
      nik: formData.nik,
      namaLengkap: formData.namaLengkap,
      noKk: formData.noKk,
      alamat: formData.alamat,
      rt: formData.rt,
      rw: formData.rw,
      pekerjaan: formData.pekerjaan || 'Buruh Harian Lepas',
      penghasilan: formData.penghasilan,
      jumlahAnggotaKeluarga: formData.jumlahAnggotaKeluarga,
      alasanPengajuan: formData.alasanPengajuan,
      fileKtp: formData.fileKtp || `ktp_${formData.nik}.pdf`,
      fileKk: formData.fileKk || `kk_${formData.noKk}.pdf`,
      fileDokumenPendukung: formData.fileDokumenPendukung || `sktm_${formData.nik}.pdf`,
    });

    setSuccessRegNo(regNo);
  };

  const handleCopy = () => {
    if (successRegNo) {
      navigator.clipboard.writeText(successRegNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (successRegNo) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Pengajuan Berhasil Dikirim!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Berkas Anda telah masuk ke sistem verifikasi Seksi Kesejahteraan Sosial Kelurahan {kelurahan.namaKelurahan}.
              Simpan Nomor Pendaftaran berikut untuk memantau status secara berkala.
            </p>
          </div>

          {/* Registration Code Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-blue-300 max-w-md mx-auto space-y-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Nomor Registrasi Resmi
            </span>
            <div className="text-3xl font-black font-mono text-blue-700 tracking-wider">
              {successRegNo}
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Bukti</span>
              </button>
            </div>
          </div>

          {/* Next steps instruction */}
          <div className="text-left bg-blue-50/70 p-4 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-2 max-w-lg mx-auto">
            <h4 className="font-bold flex items-center gap-1.5 text-blue-950">
              <Info className="w-4 h-4 text-blue-600" />
              Langkah Selanjutnya:
            </h4>
            <ul className="space-y-1 list-disc pl-5 text-slate-700">
              <li>Petugas kelurahan akan meneliti keabsahan berkas dalam 2-3 hari kerja.</li>
              <li>Pastikan nomor telepon dan alamat Anda aktif untuk jadwal survei lapangan.</li>
              <li>Periksa perkembangan status pendaftaran Anda secara berkala melalui menu Cek Status.</li>
            </ul>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => {
                sessionStorage.setItem('quick_search_query', successRegNo);
                setActiveTab('cek-status');
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Pantau Status Pengajuan Ini Sekarang</span>
            </button>
            <button
              onClick={() => {
                setSuccessRegNo(null);
                setFormData({
                  programKode: 'PKH',
                  nik: '',
                  namaLengkap: '',
                  noKk: '',
                  alamat: '',
                  rt: '01',
                  rw: '01',
                  pekerjaan: '',
                  penghasilan: 1000000,
                  jumlahAnggotaKeluarga: 3,
                  alasanPengajuan: '',
                  fileKtp: '',
                  fileKk: '',
                  fileDokumenPendukung: '',
                });
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Ajukan Permohonan Lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>Formulir Pendaftaran Calon Penerima Bansos</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Pendaftaran Mandiri Bantuan Sosial
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Silakan isi data formulir di bawah ini dengan data yang sebenarnya sesuai dokumen kependudukan resmi.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
        {/* Step 1: Program Choice */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>Pilih Program Bantuan Sosial</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {programBansos
              .filter((p) => p.status === 'Aktif')
              .map((prog) => {
                const isSelected = formData.programKode === prog.kode;
                return (
                  <div
                    key={prog.id}
                    onClick={() => setFormData((prev) => ({ ...prev, programKode: prog.kode }))}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-blue-700">{prog.kode}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{prog.nama}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{prog.keterangan}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 mt-2 block">{prog.nominal}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Step 2: Data Pemohon */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
            <span>Identitas Pemohon (Sesuai KTP & KK)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Induk Kependudukan (NIK) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nik"
                maxLength={16}
                value={formData.nik}
                onChange={handleChange}
                placeholder="16 digit NIK kepala keluarga"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Kartu Keluarga (KK) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="noKk"
                maxLength={16}
                value={formData.noKk}
                onChange={handleChange}
                placeholder="16 digit Nomor Kartu Keluarga"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                placeholder="Nama lengkap pemohon"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Domisili Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Contoh: Jl. Melati No. 12"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">RT</label>
              <select
                name="rt"
                value={formData.rt}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {['01', '02', '03', '04', '05', '06', '07', '08'].map((rt) => (
                  <option key={rt} value={rt}>
                    RT {rt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">RW</label>
              <select
                name="rw"
                value={formData.rw}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {['01', '02', '03', '04'].map((rw) => (
                  <option key={rw} value={rw}>
                    RW {rw}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Ekonomi & Kondisi Keluarga */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
            <span>Data Sosial Ekonomi & Anggota Keluarga</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Utama</label>
              <input
                type="text"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                placeholder="Contoh: Buruh Harian / Pedagang"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Penghasilan per Bulan: <span className="text-blue-700">{formatRupiah(formData.penghasilan)}</span>
              </label>
              <input
                type="number"
                name="penghasilan"
                step="50000"
                min="0"
                value={formData.penghasilan}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Anggota Keluarga (Jiwa)</label>
              <input
                type="number"
                name="jumlahAnggotaKeluarga"
                min="1"
                max="15"
                value={formData.jumlahAnggotaKeluarga}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alasan Pengajuan / Kondisi Mendesak <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alasanPengajuan"
                rows={3}
                value={formData.alasanPengajuan}
                onChange={handleChange}
                placeholder="Jelaskan mengapa Anda membutuhkan bantuan sosial ini (misal: sakit menahun, anak butuh biaya sekolah, dll.)"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 4: Upload Berkas */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              4
            </span>
            <span>Unggah Berkas Pendukung (KTP, KK, & Dokumen Pendukung)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Upload KTP */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50/40 text-center transition">
              <Upload className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="block text-xs font-bold text-slate-800">Upload KTP</span>
              <span className="text-[10px] text-slate-500 block mb-2">Format PDF / JPG / PNG (Maks 2MB)</span>
              <input
                type="file"
                id="fileKtp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload('fileKtp', f.name);
                }}
              />
              <label
                htmlFor="fileKtp"
                className="cursor-pointer inline-block px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                {formData.fileKtp ? `✓ ${formData.fileKtp}` : 'Pilih File'}
              </label>
            </div>

            {/* Upload KK */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50/40 text-center transition">
              <Upload className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="block text-xs font-bold text-slate-800">Upload Kartu Keluarga (KK)</span>
              <span className="text-[10px] text-slate-500 block mb-2">Format PDF / JPG / PNG (Maks 2MB)</span>
              <input
                type="file"
                id="fileKk"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload('fileKk', f.name);
                }}
              />
              <label
                htmlFor="fileKk"
                className="cursor-pointer inline-block px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                {formData.fileKk ? `✓ ${formData.fileKk}` : 'Pilih File'}
              </label>
            </div>

            {/* Upload Dokumen Pendukung */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50/40 text-center transition">
              <Upload className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="block text-xs font-bold text-slate-800">Dokumen Pendukung / SKTM</span>
              <span className="text-[10px] text-slate-500 block mb-2">Surat RT/RW / Foto Rumah</span>
              <input
                type="file"
                id="fileDokumenPendukung"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload('fileDokumenPendukung', f.name);
                }}
              />
              <label
                htmlFor="fileDokumenPendukung"
                className="cursor-pointer inline-block px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                {formData.fileDokumenPendukung ? `✓ ${formData.fileDokumenPendukung}` : 'Pilih File'}
              </label>
            </div>
          </div>
        </div>

        {/* Declaration checkbox */}
        <div className="pt-2 text-xs text-slate-600 flex items-start gap-2.5">
          <input type="checkbox" required id="pernyataan" className="mt-0.5 rounded text-blue-600" />
          <label htmlFor="pernyataan">
            Saya menyatakan dengan sesungguhnya bahwa seluruh data dan dokumen yang saya berikan adalah benar dan dapat
            dipertanggungjawabkan secara hukum. Apabila di kemudian hari ditemukan ketidakbenaran data, saya bersedia
            menerima sanksi sesuai perundang-undangan yang berlaku.
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
          >
            Kirim Formulir Pendaftaran Bantuan Sosial
          </button>
        </div>
      </form>
    </div>
  );
};

