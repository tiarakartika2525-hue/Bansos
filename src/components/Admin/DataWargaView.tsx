import React, { useState, useId } from 'react';
import { useBansos } from '../../context/BansosContext';
import type { DataWarga, JenisKelamin, StatusTempatTinggal } from '../../types';
import { Modal } from '../UI/Modal';
import { exportWargaToExcel, parseWargaFromExcel, downloadTemplateExcel } from '../../utils/exportExcel';
import { formatRupiah, formatTanggal } from '../../utils/formatters';
import {
  Users,
  UserPlus,
  Search,
  Download,
  Upload,
  Edit2,
  Trash2,
  Filter,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const DataWargaView: React.FC = () => {
  const { dataWarga, addWarga, editWarga, deleteWarga, importWargaList, kelurahan } = useBansos();
  const fileInputId = useId();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRt, setFilterRt] = useState('Semua');
  const [filterRw, setFilterRw] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarga, setEditingWarga] = useState<DataWarga | null>(null);

  // Form State
  const initialForm: Omit<DataWarga, 'id' | 'createdAt'> = {
    nik: '',
    noKk: '',
    namaLengkap: '',
    tempatLahir: 'Metro',
    tanggalLahir: '1985-01-01',
    jenisKelamin: 'Laki-laki',
    alamat: '',
    rt: '01',
    rw: '01',
    pekerjaan: 'Buruh Harian Lepas',
    penghasilan: 1000000,
    jumlahTanggungan: 3,
    statusTempatTinggal: 'Milik Sendiri',
  };

  const [formData, setFormData] = useState<Omit<DataWarga, 'id' | 'createdAt'>>(initialForm);
  const [formError, setFormError] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Filtered list
  const filteredData = dataWarga.filter((w) => {
    const matchSearch =
      w.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.noKk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.pekerjaan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRt = filterRt === 'Semua' || w.rt === filterRt;
    const matchRw = filterRw === 'Semua' || w.rw === filterRw;

    return matchSearch && matchRt && matchRw;
  });

  const handleOpenAdd = () => {
    setEditingWarga(null);
    setFormData(initialForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (warga: DataWarga) => {
    setEditingWarga(warga);
    setFormData({
      nik: warga.nik,
      noKk: warga.noKk,
      namaLengkap: warga.namaLengkap,
      tempatLahir: warga.tempatLahir,
      tanggalLahir: warga.tanggalLahir,
      jenisKelamin: warga.jenisKelamin,
      alamat: warga.alamat,
      rt: warga.rt,
      rw: warga.rw,
      pekerjaan: warga.pekerjaan,
      penghasilan: warga.penghasilan,
      jumlahTanggungan: warga.jumlahTanggungan,
      statusTempatTinggal: warga.statusTempatTinggal,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data warga "${nama}"?`)) {
      deleteWarga(id);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.nik || formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      setFormError('NIK harus berupa 16 digit angka.');
      return;
    }
    if (!formData.noKk || formData.noKk.length !== 16 || !/^\d+$/.test(formData.noKk)) {
      setFormError('Nomor KK harus berupa 16 digit angka.');
      return;
    }
    if (!formData.namaLengkap.trim()) {
      setFormError('Nama lengkap warga wajib diisi.');
      return;
    }

    if (editingWarga) {
      editWarga(editingWarga.id, formData);
    } else {
      // Check duplicate NIK
      const exists = dataWarga.some((w) => w.nik === formData.nik);
      if (exists) {
        setFormError(`Data warga dengan NIK ${formData.nik} sudah terdaftar.`);
        return;
      }
      addWarga(formData);
    }

    setIsModalOpen(false);
  };

  const handleExportExcel = () => {
    exportWargaToExcel(filteredData, kelurahan);
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('Memproses file Excel...');
      const parsed = await parseWargaFromExcel(file);
      const count = importWargaList(parsed);
      setImportStatus(`Berhasil mengimpor ${count} data warga baru.`);
      setTimeout(() => setImportStatus(null), 4000);
    } catch (err: any) {
      setImportStatus(`Gagal mengimpor file: ${err.message || 'Format tidak sesuai'}`);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Menu Data Warga Kelurahan</span>
          </h2>
          <p className="text-xs text-slate-500">
            Mengelola data identitas kependudukan, pekerjaan, penghasilan, dan domisili warga.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Template Excel */}
          <button
            onClick={downloadTemplateExcel}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 shadow-2xs transition flex items-center gap-1.5"
            title="Download Format Template Excel untuk diisi"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Format Template</span>
          </button>

          {/* Import Excel */}
          <label
            htmlFor={fileInputId}
            className="cursor-pointer px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 shadow-2xs transition flex items-center gap-1.5"
            title="Import data warga dari file Excel (.xlsx / .csv)"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Excel</span>
          </label>
          <input
            id={fileInputId}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleImportExcel}
            className="hidden"
          />

          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-emerald-700 rounded-xl text-xs font-semibold border border-emerald-300 shadow-2xs transition flex items-center gap-1.5"
            title="Download seluruh data warga ke file Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          {/* Tambah Warga */}
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Data Warga</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 bg-blue-50 text-blue-900 text-xs rounded-xl border border-blue-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari NIK, No KK, Nama, Alamat, Pekerjaan..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">RT:</span>
            <select
              value={filterRt}
              onChange={(e) => setFilterRt(e.target.value)}
              className="py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua RT</option>
              {['01', '02', '03', '04', '05', '06', '07', '08'].map((rt) => (
                <option key={rt} value={rt}>
                  RT {rt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">RW:</span>
            <select
              value={filterRw}
              onChange={(e) => setFilterRw(e.target.value)}
              className="py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua RW</option>
              {['01', '02', '03', '04'].map((rw) => (
                <option key={rw} value={rw}>
                  RW {rw}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500 ml-2">Total: {filteredData.length} warga</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">No</th>
                <th className="py-3 px-3.5">NIK & No KK</th>
                <th className="py-3 px-3.5">Nama & JK</th>
                <th className="py-3 px-3.5">TTL</th>
                <th className="py-3 px-3.5">Alamat / RT-RW</th>
                <th className="py-3 px-3.5">Pekerjaan</th>
                <th className="py-3 px-3.5">Penghasilan</th>
                <th className="py-3 px-3.5">Tanggungan</th>
                <th className="py-3 px-3.5">Status Rumah</th>
                <th className="py-3 px-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((w, index) => (
                <tr key={w.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3.5 text-slate-500 font-medium">{index + 1}</td>
                  <td className="py-3 px-3.5 font-mono">
                    <span className="font-bold text-slate-800 block">{w.nik}</span>
                    <span className="text-[10px] text-slate-500 block">KK: {w.noKk}</span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="font-bold text-slate-900 block">{w.namaLengkap}</span>
                    <span className="text-[10px] text-slate-500">{w.jenisKelamin}</span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-600">
                    <span>{w.tempatLahir}</span>
                    <span className="block text-[10px] text-slate-500">{formatTanggal(w.tanggalLahir)}</span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-700">
                    <span className="font-medium block">{w.alamat}</span>
                    <span className="text-[10px] text-blue-700 font-semibold">
                      RT {w.rt} / RW {w.rw}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-700 font-medium">{w.pekerjaan}</td>
                  <td className="py-3 px-3.5 font-semibold text-slate-900">{formatRupiah(w.penghasilan)}</td>
                  <td className="py-3 px-3.5 text-center font-bold text-slate-700">{w.jumlahTanggungan} org</td>
                  <td className="py-3 px-3.5">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 font-medium text-slate-700">
                      {w.statusTempatTinggal}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(w)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Data Warga"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(w.id, w.namaLengkap)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Data Warga"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            Data warga tidak ditemukan dengan filter yang dipilih.
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit Data Warga */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWarga ? 'Edit Data Warga' : 'Tambah Data Warga Baru'}
        subtitle="Masukkan kelengkapan identitas kependudukan warga secara valid"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIK (16 Digit) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                placeholder="Contoh: 3201011503780001"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Kartu Keluarga (16 Digit) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={formData.noKk}
                onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                placeholder="Contoh: 3201011002050011"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.namaLengkap}
                onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                placeholder="Nama lengkap"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                value={formData.tempatLahir}
                onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                placeholder="Kota/Kab Tempat Lahir"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                value={formData.jenisKelamin}
                onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as JenisKelamin })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Tempat Tinggal</label>
              <select
                value={formData.statusTempatTinggal}
                onChange={(e) =>
                  setFormData({ ...formData, statusTempatTinggal: e.target.value as StatusTempatTinggal })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Milik Sendiri">Milik Sendiri</option>
                <option value="Sewa / Kontrak">Sewa / Kontrak</option>
                <option value="Menumpang">Menumpang</option>
                <option value="Bebas Sewa">Bebas Sewa</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Nama jalan, nomor rumah, gang"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">RT</label>
              <select
                value={formData.rt}
                onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                value={formData.rw}
                onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {['01', '02', '03', '04'].map((rw) => (
                  <option key={rw} value={rw}>
                    RW {rw}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan</label>
              <input
                type="text"
                value={formData.pekerjaan}
                onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                placeholder="Pekerjaan warga"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Penghasilan per Bulan (Rp)</label>
              <input
                type="number"
                step="50000"
                min="0"
                value={formData.penghasilan}
                onChange={(e) => setFormData({ ...formData, penghasilan: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Tanggungan Keluarga</label>
              <input
                type="number"
                min="0"
                max="15"
                value={formData.jumlahTanggungan}
                onChange={(e) => setFormData({ ...formData, jumlahTanggungan: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2 px-4 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
            >
              {editingWarga ? 'Simpan Perubahan' : 'Tambahkan Warga'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
