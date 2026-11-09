import React, { useState } from 'react';
import { useBansos } from '../../context/BansosContext';
import type { DataPenerima, StatusPenerimaan } from '../../types';
import { StatusPenerimaBadge } from '../UI/Badges';
import { maskNik, formatTanggal } from '../../utils/formatters';
import { Modal } from '../UI/Modal';
import {
  Award,
  Search,
  Filter,
  Printer,
  Edit2,
  Trash2,
  FileText,
  Building2,
  CheckCircle,
} from 'lucide-react';

export const DataPenerimaView: React.FC = () => {
  const { dataPenerima, updateStatusPenerima, deletePenerima, kelurahan } = useBansos();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('Semua');
  const [selectedPenerimaForCard, setSelectedPenerimaForCard] = useState<DataPenerima | null>(null);

  const programs = ['Semua', 'PKH', 'BPNT', 'BLT', 'PBI-JK', 'BANSOS-LANSIA'];

  const filtered = dataPenerima.filter((p) => {
    const matchProg = filterProgram === 'Semua' || p.programKode === filterProgram;
    const matchSearch =
      p.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.noSkPenetapan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.programKode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchProg && matchSearch;
  });

  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Hapus penerima bansos atas nama "${nama}" dari daftar penetapan?`)) {
      deletePenerima(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Menu Data Penerima Bansos (SK Penetapan)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Daftar warga yang telah ditetapkan secara resmi sebagai Keluarga Penerima Manfaat (KPM) bantuan sosial.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Nama Penerima, NIK, No SK Penetapan..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Program:</span>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs"
            >
              {programs.map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-slate-500 ml-2">Total: {filtered.length} KPM</span>
        </div>
      </div>

      {/* Table Penerima */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">No</th>
                <th className="py-3 px-3.5">NIK (Tersamarkan)</th>
                <th className="py-3 px-3.5">Nama Penerima</th>
                <th className="py-3 px-3.5">Wilayah</th>
                <th className="py-3 px-3.5">Jenis Bantuan</th>
                <th className="py-3 px-3.5">Nominal</th>
                <th className="py-3 px-3.5">Periode</th>
                <th className="py-3 px-3.5">Status Penerimaan</th>
                <th className="py-3 px-3.5">Tanggal Penetapan & No SK</th>
                <th className="py-3 px-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3.5 text-slate-500">{index + 1}</td>
                  <td className="py-3 px-3.5 font-mono font-bold text-slate-800">
                    {maskNik(item.nik)}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="font-bold text-slate-900 block">{item.namaLengkap}</span>
                    <span className="text-[10px] text-slate-500">KPM Terdaftar</span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-700 font-semibold">
                    RT {item.rt}/RW {item.rw}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-blue-100 text-blue-800">
                      {item.programKode}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-bold text-emerald-700">{item.nominalBantuan}</td>
                  <td className="py-3 px-3.5 text-slate-600">{item.periodePenerimaan}</td>
                  <td className="py-3 px-3.5">
                    <StatusPenerimaBadge status={item.statusPenerimaan} />
                  </td>
                  <td className="py-3 px-3.5 text-slate-600">
                    <span className="font-medium block">{formatTanggal(item.tanggalPenetapan)}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.noSkPenetapan}</span>
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedPenerimaForCard(item)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Cetak Surat / Kartu Penerima"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const nextStatus: StatusPenerimaan =
                            item.statusPenerimaan === 'Aktif' ? 'Selesai / Tergraduasi' : 'Aktif';
                          updateStatusPenerima(item.id, nextStatus);
                        }}
                        className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="Ubah Status (Graduasi/Aktif)"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.namaLengkap)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Penetapan"
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

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            Tidak ada penerima bansos pada kriteria filter ini.
          </div>
        )}
      </div>

      {/* Modal Kartu Penerima Manfaat (Cetak KPM Card) */}
      {selectedPenerimaForCard && (
        <Modal
          isOpen={!!selectedPenerimaForCard}
          onClose={() => setSelectedPenerimaForCard(null)}
          title="Kartu Keluarga Penerima Manfaat (KPM)"
          subtitle={`Kelurahan ${kelurahan.namaKelurahan} • ${kelurahan.kotaKabupaten}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* The Physical Card view */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-800 to-indigo-900 text-white shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-blue-700/80">
                <div className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-amber-300" />
                  <div>
                    <h4 className="font-extrabold text-xs tracking-wider">KARTU PENERIMA BANSOS</h4>
                    <p className="text-[10px] text-blue-200">Kelurahan {kelurahan.namaKelurahan}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-xs">
                  {selectedPenerimaForCard.programKode}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-blue-300 block">Nama Penerima Manfaat:</span>
                  <span className="font-black text-base tracking-wide text-white">
                    {selectedPenerimaForCard.namaLengkap.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-blue-300 block">NIK Terdaftar:</span>
                    <span className="font-mono font-semibold">{maskNik(selectedPenerimaForCard.nik)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-300 block">Wilayah Domisili:</span>
                    <span className="font-semibold">
                      RT {selectedPenerimaForCard.rt} / RW {selectedPenerimaForCard.rw}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-700/60 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[9px] text-blue-300 block">Nomor SK Penetapan:</span>
                    <span className="font-mono text-amber-300 text-[10px]">{selectedPenerimaForCard.noSkPenetapan}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-blue-300 block">Periode:</span>
                    <span className="font-semibold">{selectedPenerimaForCard.periodePenerimaan}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPenerimaForCard(null)}
                className="py-2 px-4 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Kartu</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
