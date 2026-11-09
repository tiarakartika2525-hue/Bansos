import * as XLSX from 'xlsx';
import type { DataWarga, PengajuanBansos, DataPenerima, PenyaluranBantuan, InfoKelurahan } from '../types';
import { maskNik } from './formatters';

// Export Data Warga to Excel
export function exportWargaToExcel(dataWarga: DataWarga[], kelurahan: InfoKelurahan) {
  const rows = dataWarga.map((w, idx) => ({
    'No': idx + 1,
    'NIK': `'${w.nik}`, // prefix quote so Excel treats 16 digits as text
    'Nomor KK': `'${w.noKk}`,
    'Nama Lengkap': w.namaLengkap,
    'Tempat Lahir': w.tempatLahir,
    'Tanggal Lahir': w.tanggalLahir,
    'Jenis Kelamin': w.jenisKelamin,
    'Alamat': w.alamat,
    'RT': w.rt,
    'RW': w.rw,
    'Pekerjaan': w.pekerjaan,
    'Penghasilan (Rp)': w.penghasilan,
    'Jumlah Tanggungan': w.jumlahTanggungan,
    'Status Tempat Tinggal': w.statusTempatTinggal,
    'Tanggal Terdaftar': w.createdAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Warga');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 20 }, // NIK
    { wch: 20 }, // No KK
    { wch: 25 }, // Nama
    { wch: 15 }, // Tempat Lahir
    { wch: 15 }, // Tanggal Lahir
    { wch: 14 }, // JK
    { wch: 30 }, // Alamat
    { wch: 6 },  // RT
    { wch: 6 },  // RW
    { wch: 18 }, // Pekerjaan
    { wch: 18 }, // Penghasilan
    { wch: 12 }, // Tanggungan
    { wch: 20 }, // Status Tinggal
    { wch: 15 }, // Tgl
  ];

  const filename = `Data_Warga_${kelurahan.namaKelurahan.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

// Download Template Excel for importing Data Warga
export function downloadTemplateExcel() {
  const sampleRows = [
    {
      'No': 1,
      'NIK': "'3201011503850099",
      'Nomor KK': "'3201011002050099",
      'Nama Lengkap': 'Ahmad Dahlan',
      'Tempat Lahir': 'Metro',
      'Tanggal Lahir': '1985-05-12',
      'Jenis Kelamin': 'Laki-laki',
      'Alamat': 'Jl. Kenanga No. 10',
      'RT': '01',
      'RW': '02',
      'Pekerjaan': 'Buruh Harian Lepas',
      'Penghasilan (Rp)': 1200000,
      'Jumlah Tanggungan': 3,
      'Status Tempat Tinggal': 'Milik Sendiri',
    },
    {
      'No': 2,
      'NIK': "'3201015609870098",
      'Nomor KK': "'3201011002050099",
      'Nama Lengkap': 'Khadijah',
      'Tempat Lahir': 'Bogor',
      'Tanggal Lahir': '1987-09-18',
      'Jenis Kelamin': 'Perempuan',
      'Alamat': 'Jl. Kenanga No. 10',
      'RT': '01',
      'RW': '02',
      'Pekerjaan': 'Pedagang Rumahan',
      'Penghasilan (Rp)': 800000,
      'Jumlah Tanggungan': 3,
      'Status Tempat Tinggal': 'Milik Sendiri',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Warga');

  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 20 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 14 },
    { wch: 30 },
    { wch: 6 },
    { wch: 6 },
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 20 },
  ];

  XLSX.writeFile(workbook, 'Template_Import_Data_Warga.xlsx');
}

// Parse imported Excel/CSV file into DataWarga[]
export function parseWargaFromExcel(file: File): Promise<Partial<DataWarga>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const mapped: Partial<DataWarga>[] = rawJson.map((row) => {
          // Normalize keys
          const getVal = (keys: string[]): string => {
            for (const key of keys) {
              for (const rowKey of Object.keys(row)) {
                if (rowKey.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, '')) {
                  return String(row[rowKey]).trim().replace(/^'/, '');
                }
              }
            }
            return '';
          };

          const rawPenghasilan = getVal(['penghasilan', 'penghasilanrp', 'income']);
          const cleanPenghasilan = Number(rawPenghasilan.replace(/[^0-9]/g, '')) || 0;
          const rawTanggungan = Number(getVal(['jumlahtanggungan', 'tanggungan'])) || 0;

          return {
            nik: getVal(['nik', 'nomorindukkependudukan']),
            noKk: getVal(['nokk', 'nomorkartukeluarga', 'nomorkk', 'kk']),
            namaLengkap: getVal(['namalengkap', 'nama']),
            tempatLahir: getVal(['tempatlahir', 'tempat']),
            tanggalLahir: getVal(['tanggallahir', 'tgllahir']),
            jenisKelamin: getVal(['jeniskelamin', 'jk', 'gender']).toLowerCase().startsWith('p') ? 'Perempuan' : 'Laki-laki',
            alamat: getVal(['alamat', 'alamatlengkap']),
            rt: getVal(['rt']) || '01',
            rw: getVal(['rw']) || '01',
            pekerjaan: getVal(['pekerjaan', 'profesi']) || 'Belum / Tidak Bekerja',
            penghasilan: cleanPenghasilan,
            jumlahTanggungan: rawTanggungan,
            statusTempatTinggal: (getVal(['statustempattinggal', 'statustinggal', 'statusrumah']) as DataWarga['statusTempatTinggal']) || 'Milik Sendiri',
          };
        });

        resolve(mapped);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// Export Generic Report to Excel
export function exportReportToExcel(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  filename: string
) {
  const data = [
    [title.toUpperCase()],
    [`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`],
    [],
    headers,
    ...rows,
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
