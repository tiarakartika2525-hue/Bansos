export type JenisKelamin = 'Laki-laki' | 'Perempuan';

export type StatusTempatTinggal = 'Milik Sendiri' | 'Sewa / Kontrak' | 'Menumpang' | 'Bebas Sewa';

export interface DataWarga {
  id: string;
  nik: string; // 16 digit
  noKk: string; // 16 digit
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  jenisKelamin: JenisKelamin;
  alamat: string;
  rt: string; // e.g. "01"
  rw: string; // e.g. "02"
  pekerjaan: string;
  penghasilan: number; // Rupiah per bulan
  jumlahTanggungan: number;
  statusTempatTinggal: StatusTempatTinggal;
  createdAt: string;
}

export type StatusProgram = 'Aktif' | 'Tidak Aktif';

export interface ProgramBansos {
  id: string;
  kode: string; // e.g. "PKH", "BPNT"
  nama: string; // e.g. "Program Keluarga Harapan"
  keterangan: string;
  periode: string; // e.g. "Tahap I - 2026"
  nominal: string; // e.g. "Rp 750.000 / Tahap"
  kuota: number;
  persyaratan: string[];
  status: StatusProgram;
}

export type StatusPengajuan = 'Menunggu Verifikasi' | 'Disetujui' | 'Ditolak' | 'Perlu Perbaikan';

export interface SurveiLapangan {
  disurvei: boolean;
  tanggalSurvei?: string;
  petugasSurvei?: string;
  kondisiDinding?: string;
  kondisiLantai?: string;
  kondisiAtap?: string;
  sumberAir?: string;
  dayaListrik?: string;
  penilaianKelayakan?: 'Sangat Layak' | 'Layak' | 'Cukup Layak' | 'Tidak Layak';
  catatanSurvei?: string;
  fotoRumahUrl?: string;
}

export interface PengajuanBansos {
  id: string;
  noPendaftaran: string; // e.g. "REG-2026-001"
  programId: string;
  programKode: string;
  programNama: string;
  nik: string;
  namaLengkap: string;
  noKk: string;
  alamat: string;
  rt: string;
  rw: string;
  pekerjaan: string;
  penghasilan: number;
  jumlahAnggotaKeluarga: number;
  alasanPengajuan: string;
  fileKtp: string; // filename or mock url
  fileKk: string;
  fileDokumenPendukung: string;
  status: StatusPengajuan;
  alasanPenolakan?: string;
  catatanPerbaikan?: string;
  tanggalPengajuan: string;
  tanggalVerifikasi?: string;
  petugasVerifikator?: string;
  survei: SurveiLapangan;
}

export type StatusPenerimaan = 'Aktif' | 'Non-Aktif' | 'Selesai / Tergraduasi';

export interface DataPenerima {
  id: string;
  pengajuanId?: string;
  nik: string;
  noKk: string;
  namaLengkap: string;
  rt: string;
  rw: string;
  programKode: string;
  programNama: string;
  periodePenerimaan: string;
  statusPenerimaan: StatusPenerimaan;
  tanggalPenetapan: string;
  noSkPenetapan: string;
  nominalBantuan: string;
}

export type StatusPenyaluran = 'Belum disalurkan' | 'Sedang diproses' | 'Sudah disalurkan' | 'Gagal disalurkan';

export interface PenyaluranBantuan {
  id: string;
  penerimaId: string;
  namaPenerima: string;
  nik: string;
  rt: string;
  rw: string;
  jenisBantuan: string;
  periodePenyaluran: string;
  tanggalPenyaluran: string;
  statusPenyaluran: StatusPenyaluran;
  metodePenyaluran: string; // e.g. "Kantor Kelurahan", "Transfer Bank Mandiri/BRI", "PT Pos Indonesia"
  keterangan: string;
  buktiPenyaluranUrl?: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  kategori: 'Penyaluran' | 'Pendaftaran' | 'Verifikasi' | 'Umum';
  tanggal: string;
  ringkasan: string;
  isi: string;
  penulis: string;
  isPinned?: boolean;
}

export interface InfoKelurahan {
  namaKelurahan: string;
  kecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  alamatKantor: string;
  telepon: string;
  email: string;
  namaLurah: string;
  nipLurah: string;
  namaKasiKesra: string;
  nipKasiKesra: string;
  logoUrl?: string;
}

export interface UserAuth {
  isLoggedIn: boolean;
  username: string;
  namaLengkap: string;
  role: 'admin' | 'verifikator';
}

