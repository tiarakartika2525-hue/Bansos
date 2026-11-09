import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  DataWarga,
  ProgramBansos,
  PengajuanBansos,
  DataPenerima,
  PenyaluranBantuan,
  Pengumuman,
  InfoKelurahan,
  UserAuth,
  StatusPengajuan,
  StatusPenerimaan,
  SurveiLapangan,
} from '../types';
import {
  initialKelurahan,
  initialProgramBansos,
  initialDataWarga,
  initialPengajuan,
  initialDataPenerima,
  initialPenyaluran,
  initialPengumuman,
} from '../data/initialData';
import { generateRegistrationNumber } from '../utils/formatters';

interface SearchResult {
  warga?: DataWarga;
  pengajuan?: PengajuanBansos;
  penerima?: DataPenerima;
  penyaluranList: PenyaluranBantuan[];
}

interface BansosContextType {
  kelurahan: InfoKelurahan;
  dataWarga: DataWarga[];
  programBansos: ProgramBansos[];
  pengajuan: PengajuanBansos[];
  dataPenerima: DataPenerima[];
  penyaluran: PenyaluranBantuan[];
  pengumuman: Pengumuman[];
  auth: UserAuth;

  // View state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminMenu: string;
  setAdminMenu: (menu: string) => void;

  // Statistics
  stats: {
    totalWarga: number;
    totalCalonPenerima: number;
    totalPenerimaBansos: number;
    totalMenungguVerifikasi: number;
    totalDitolak: number;
    totalDisetujui: number;
    penerimaPerProgram: { kode: string; nama: string; jumlah: number }[];
    penerimaPerRtRw: { rtRw: string; jumlah: number }[];
  };

  // Actions
  updateKelurahan: (data: Partial<InfoKelurahan>) => void;
  addWarga: (warga: Omit<DataWarga, 'id' | 'createdAt'>) => void;
  editWarga: (id: string, warga: Partial<DataWarga>) => void;
  deleteWarga: (id: string) => void;
  importWargaList: (list: Partial<DataWarga>[]) => number;

  addProgram: (prog: Omit<ProgramBansos, 'id'>) => void;
  editProgram: (id: string, prog: Partial<ProgramBansos>) => void;
  deleteProgram: (id: string) => void;

  submitPengajuan: (
    data: Omit<
      PengajuanBansos,
      'id' | 'noPendaftaran' | 'status' | 'tanggalPengajuan' | 'survei' | 'alasanPenolakan' | 'catatanPerbaikan'
    >
  ) => string;
  updateVerifikasiPengajuan: (
    id: string,
    status: StatusPengajuan,
    petugas: string,
    note?: { alasanPenolakan?: string; catatanPerbaikan?: string }
  ) => void;
  saveSurveiLapangan: (id: string, surveiData: SurveiLapangan) => void;

  addPenerima: (penerima: Omit<DataPenerima, 'id'>) => void;
  updateStatusPenerima: (id: string, status: StatusPenerimaan) => void;
  deletePenerima: (id: string) => void;

  addPenyaluran: (data: Omit<PenyaluranBantuan, 'id'>) => void;
  updatePenyaluran: (id: string, data: Partial<PenyaluranBantuan>) => void;
  deletePenyaluran: (id: string) => void;

  addPengumuman: (p: Omit<Pengumuman, 'id'>) => void;
  editPengumuman: (id: string, p: Partial<Pengumuman>) => void;
  deletePengumuman: (id: string) => void;

  login: (username: string, role: 'admin' | 'verifikator') => boolean;
  logout: () => void;
  resetToDefaultData: () => void;

  findStatusByNikOrReg: (query: string) => SearchResult | null;
}

const BansosContext = createContext<BansosContextType | undefined>(undefined);

const STORAGE_KEYS = {
  KELURAHAN: 'bansos_kelurahan_data',
  WARGA: 'bansos_warga_data',
  PROGRAM: 'bansos_program_data',
  PENGAJUAN: 'bansos_pengajuan_data',
  PENERIMA: 'bansos_penerima_data',
  PENYALURAN: 'bansos_penyaluran_data',
  PENGUMUMAN: 'bansos_pengumuman_data',
  AUTH: 'bansos_auth_state',
};

export const BansosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or use initial
  const [kelurahan, setKelurahan] = useState<InfoKelurahan>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KELURAHAN);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.namaKelurahan === 'Sukamaju' || !parsed.namaKelurahan.includes('Metro')) {
          return initialKelurahan;
        }
        return parsed;
      } catch {
        return initialKelurahan;
      }
    }
    return initialKelurahan;
  });

  const [dataWarga, setDataWarga] = useState<DataWarga[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WARGA);
    return saved ? JSON.parse(saved) : initialDataWarga;
  });

  const [programBansos, setProgramBansos] = useState<ProgramBansos[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRAM);
    return saved ? JSON.parse(saved) : initialProgramBansos;
  });

  const [pengajuan, setPengajuan] = useState<PengajuanBansos[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENGAJUAN);
    return saved ? JSON.parse(saved) : initialPengajuan;
  });

  const [dataPenerima, setDataPenerima] = useState<DataPenerima[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENERIMA);
    return saved ? JSON.parse(saved) : initialDataPenerima;
  });

  const [penyaluran, setPenyaluran] = useState<PenyaluranBantuan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENYALURAN);
    return saved ? JSON.parse(saved) : initialPenyaluran;
  });

  const [pengumuman, setPengumuman] = useState<Pengumuman[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENGUMUMAN);
    return saved ? JSON.parse(saved) : initialPengumuman;
  });

  const [auth, setAuth] = useState<UserAuth>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : { isLoggedIn: false, username: '', namaLengkap: '', role: 'admin' };
  });

  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [adminMenu, setAdminMenu] = useState<string>('dashboard');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KELURAHAN, JSON.stringify(kelurahan));
  }, [kelurahan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WARGA, JSON.stringify(dataWarga));
  }, [dataWarga]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRAM, JSON.stringify(programBansos));
  }, [programBansos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENGAJUAN, JSON.stringify(pengajuan));
  }, [pengajuan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENERIMA, JSON.stringify(dataPenerima));
  }, [dataPenerima]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENYALURAN, JSON.stringify(penyaluran));
  }, [penyaluran]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify(pengumuman));
  }, [pengumuman]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
  }, [auth]);

  // Statistics calculation
  const totalWarga = dataWarga.length;
  const totalCalonPenerima = pengajuan.length;
  const totalPenerimaBansos = dataPenerima.filter((p) => p.statusPenerimaan === 'Aktif').length;
  const totalMenungguVerifikasi = pengajuan.filter((p) => p.status === 'Menunggu Verifikasi').length;
  const totalDitolak = pengajuan.filter((p) => p.status === 'Ditolak').length;
  const totalDisetujui = pengajuan.filter((p) => p.status === 'Disetujui').length;

  // Chart: penerima per program
  const penerimaPerProgram = programBansos.map((prog) => {
    const count = dataPenerima.filter((p) => p.programKode === prog.kode).length;
    return {
      kode: prog.kode,
      nama: prog.nama,
      jumlah: count,
    };
  });

  // Chart: penerima per RT/RW
  const rtRwMap = new Map<string, number>();
  dataPenerima.forEach((p) => {
    const key = `RT ${p.rt}/RW ${p.rw}`;
    rtRwMap.set(key, (rtRwMap.get(key) || 0) + 1);
  });
  const penerimaPerRtRw = Array.from(rtRwMap.entries())
    .map(([rtRw, jumlah]) => ({ rtRw, jumlah }))
    .sort((a, b) => a.rtRw.localeCompare(b.rtRw));

  const stats = {
    totalWarga,
    totalCalonPenerima,
    totalPenerimaBansos,
    totalMenungguVerifikasi,
    totalDitolak,
    totalDisetujui,
    penerimaPerProgram,
    penerimaPerRtRw,
  };

  // Actions
  const updateKelurahan = (data: Partial<InfoKelurahan>) => {
    setKelurahan((prev) => ({ ...prev, ...data }));
  };

  const addWarga = (w: Omit<DataWarga, 'id' | 'createdAt'>) => {
    const newWarga: DataWarga = {
      ...w,
      id: `warga-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setDataWarga((prev) => [newWarga, ...prev]);
  };

  const editWarga = (id: string, updated: Partial<DataWarga>) => {
    setDataWarga((prev) => prev.map((w) => (w.id === id ? { ...w, ...updated } : w)));
  };

  const deleteWarga = (id: string) => {
    setDataWarga((prev) => prev.filter((w) => w.id !== id));
  };

  const importWargaList = (list: Partial<DataWarga>[]): number => {
    let count = 0;
    const toAdd: DataWarga[] = [];
    const existingNiks = new Set(dataWarga.map((w) => w.nik));

    for (const item of list) {
      if (!item.nik || existingNiks.has(item.nik)) continue;
      existingNiks.add(item.nik);
      toAdd.push({
        id: `warga-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        nik: item.nik,
        noKk: item.noKk || '',
        namaLengkap: item.namaLengkap || 'Nama Tidak Diketahui',
        tempatLahir: item.tempatLahir || 'Metro',
        tanggalLahir: item.tanggalLahir || '1990-01-01',
        jenisKelamin: item.jenisKelamin || 'Laki-laki',
        alamat: item.alamat || 'Alamat Kelurahan',
        rt: item.rt || '01',
        rw: item.rw || '01',
        pekerjaan: item.pekerjaan || 'Lainnya',
        penghasilan: item.penghasilan || 0,
        jumlahTanggungan: item.jumlahTanggungan || 1,
        statusTempatTinggal: item.statusTempatTinggal || 'Milik Sendiri',
        createdAt: new Date().toISOString().slice(0, 10),
      });
      count++;
    }

    if (toAdd.length > 0) {
      setDataWarga((prev) => [...toAdd, ...prev]);
    }
    return count;
  };

  const addProgram = (prog: Omit<ProgramBansos, 'id'>) => {
    const newProg: ProgramBansos = {
      ...prog,
      id: `prog-${Date.now()}`,
    };
    setProgramBansos((prev) => [...prev, newProg]);
  };

  const editProgram = (id: string, updated: Partial<ProgramBansos>) => {
    setProgramBansos((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProgram = (id: string) => {
    setProgramBansos((prev) => prev.filter((p) => p.id !== id));
  };

  const submitPengajuan = (
    data: Omit<
      PengajuanBansos,
      'id' | 'noPendaftaran' | 'status' | 'tanggalPengajuan' | 'survei' | 'alasanPenolakan' | 'catatanPerbaikan'
    >
  ): string => {
    const regNo = generateRegistrationNumber();
    const newPengajuan: PengajuanBansos = {
      ...data,
      id: `peng-${Date.now()}`,
      noPendaftaran: regNo,
      status: 'Menunggu Verifikasi',
      tanggalPengajuan: new Date().toISOString().slice(0, 10),
      survei: { disurvei: false },
    };
    setPengajuan((prev) => [newPengajuan, ...prev]);

    // Also auto-add to Data Warga if not existing yet
    const exists = dataWarga.some((w) => w.nik === data.nik);
    if (!exists) {
      addWarga({
        nik: data.nik,
        noKk: data.noKk,
        namaLengkap: data.namaLengkap,
        tempatLahir: 'Metro',
        tanggalLahir: '1985-01-01',
        jenisKelamin: 'Laki-laki',
        alamat: data.alamat,
        rt: data.rt,
        rw: data.rw,
        pekerjaan: data.pekerjaan,
        penghasilan: data.penghasilan,
        jumlahTanggungan: data.jumlahAnggotaKeluarga,
        statusTempatTinggal: 'Sewa / Kontrak',
      });
    }

    return regNo;
  };

  const updateVerifikasiPengajuan = (
    id: string,
    status: StatusPengajuan,
    petugas: string,
    note?: { alasanPenolakan?: string; catatanPerbaikan?: string }
  ) => {
    setPengajuan((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated: PengajuanBansos = {
          ...item,
          status,
          petugasVerifikator: petugas,
          tanggalVerifikasi: new Date().toISOString().slice(0, 10),
          alasanPenolakan: status === 'Ditolak' ? note?.alasanPenolakan : undefined,
          catatanPerbaikan: status === 'Perlu Perbaikan' ? note?.catatanPerbaikan : undefined,
        };

        // If status changed to Disetujui, auto-create DataPenerima if not exists yet
        if (status === 'Disetujui') {
          const alreadyPenerima = dataPenerima.some((p) => p.nik === item.nik && p.programKode === item.programKode);
          if (!alreadyPenerima) {
            const prog = programBansos.find((p) => p.kode === item.programKode);
            const newPenerima: DataPenerima = {
              id: `rcp-${Date.now()}`,
              pengajuanId: item.id,
              nik: item.nik,
              noKk: item.noKk,
              namaLengkap: item.namaLengkap,
              rt: item.rt,
              rw: item.rw,
              programKode: item.programKode,
              programNama: item.programNama,
              periodePenerimaan: prog?.periode || 'Periode Berjalan 2026',
              statusPenerimaan: 'Aktif',
              tanggalPenetapan: new Date().toISOString().slice(0, 10),
              noSkPenetapan: `SK.LUR/${Math.floor(100 + Math.random() * 900)}/BANSOS-${item.programKode}/2026`,
              nominalBantuan: prog?.nominal || 'Sesuai Ketentuan',
            };
            setDataPenerima((pList) => [newPenerima, ...pList]);

            // Auto-queue Penyaluran
            const newPenyaluran: PenyaluranBantuan = {
              id: `dist-${Date.now()}`,
              penerimaId: newPenerima.id,
              namaPenerima: newPenerima.namaLengkap,
              nik: newPenerima.nik,
              rt: newPenerima.rt,
              rw: newPenerima.rw,
              jenisBantuan: `${newPenerima.programKode} (${newPenerima.periodePenerimaan})`,
              periodePenyaluran: 'Bulan Berjalan',
              tanggalPenyaluran: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
              statusPenyaluran: 'Sedang diproses',
              metodePenyaluran: 'Loket Balai Kelurahan Metro Pusat',
              keterangan: 'Penerima baru hasil penetapan verifikasi berkas dan survei lapangan.',
            };
            setPenyaluran((dList) => [newPenyaluran, ...dList]);
          }
        }

        return updated;
      })
    );
  };

  const saveSurveiLapangan = (id: string, surveiData: SurveiLapangan) => {
    setPengajuan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, survei: { ...surveiData, disurvei: true } } : item))
    );
  };

  const addPenerima = (penerima: Omit<DataPenerima, 'id'>) => {
    const newP: DataPenerima = {
      ...penerima,
      id: `rcp-${Date.now()}`,
    };
    setDataPenerima((prev) => [newP, ...prev]);
  };

  const updateStatusPenerima = (id: string, status: StatusPenerimaan) => {
    setDataPenerima((prev) => prev.map((p) => (p.id === id ? { ...p, statusPenerimaan: status } : p)));
  };

  const deletePenerima = (id: string) => {
    setDataPenerima((prev) => prev.filter((p) => p.id !== id));
  };

  const addPenyaluran = (data: Omit<PenyaluranBantuan, 'id'>) => {
    const newDist: PenyaluranBantuan = {
      ...data,
      id: `dist-${Date.now()}`,
    };
    setPenyaluran((prev) => [newDist, ...prev]);
  };

  const updatePenyaluran = (id: string, data: Partial<PenyaluranBantuan>) => {
    setPenyaluran((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
  };

  const deletePenyaluran = (id: string) => {
    setPenyaluran((prev) => prev.filter((d) => d.id !== id));
  };

  const addPengumuman = (p: Omit<Pengumuman, 'id'>) => {
    const newP: Pengumuman = {
      ...p,
      id: `pengumuman-${Date.now()}`,
    };
    setPengumuman((prev) => [newP, ...prev]);
  };

  const editPengumuman = (id: string, p: Partial<Pengumuman>) => {
    setPengumuman((prev) => prev.map((item) => (item.id === id ? { ...item, ...p } : item)));
  };

  const deletePengumuman = (id: string) => {
    setPengumuman((prev) => prev.filter((item) => item.id !== id));
  };

  const login = (username: string, role: 'admin' | 'verifikator'): boolean => {
    const nama = role === 'admin' ? 'Administrator Kelurahan' : 'Petugas Verifikator Kesra';
    setAuth({
      isLoggedIn: true,
      username,
      namaLengkap: nama,
      role,
    });
    return true;
  };

  const logout = () => {
    setAuth({
      isLoggedIn: false,
      username: '',
      namaLengkap: '',
      role: 'admin',
    });
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setKelurahan(initialKelurahan);
    setDataWarga(initialDataWarga);
    setProgramBansos(initialProgramBansos);
    setPengajuan(initialPengajuan);
    setDataPenerima(initialDataPenerima);
    setPenyaluran(initialPenyaluran);
    setPengumuman(initialPengumuman);
    setAuth({ isLoggedIn: false, username: '', namaLengkap: '', role: 'admin' });
  };

  const findStatusByNikOrReg = (query: string): SearchResult | null => {
    if (!query || query.trim().length === 0) return null;
    const clean = query.trim().toLowerCase();

    // 1. Look in Pengajuan first (by registration number or NIK)
    const matchPengajuan = pengajuan.find(
      (p) => p.noPendaftaran.toLowerCase() === clean || p.nik.toLowerCase() === clean
    );

    // 2. Look in Penerima
    const targetNik = matchPengajuan ? matchPengajuan.nik : clean;
    const matchPenerima = dataPenerima.find((p) => p.nik.toLowerCase() === targetNik);

    // 3. Look in Data Warga
    const matchWarga = dataWarga.find((w) => w.nik.toLowerCase() === targetNik);

    // 4. Find Penyaluran history
    const distList = penyaluran.filter((d) => d.nik.toLowerCase() === targetNik);

    if (!matchPengajuan && !matchPenerima && !matchWarga) {
      return null;
    }

    return {
      warga: matchWarga,
      pengajuan: matchPengajuan,
      penerima: matchPenerima,
      penyaluranList: distList,
    };
  };

  return (
    <BansosContext.Provider
      value={{
        kelurahan,
        dataWarga,
        programBansos,
        pengajuan,
        dataPenerima,
        penyaluran,
        pengumuman,
        auth,
        activeTab,
        setActiveTab,
        adminMenu,
        setAdminMenu,
        stats,
        updateKelurahan,
        addWarga,
        editWarga,
        deleteWarga,
        importWargaList,
        addProgram,
        editProgram,
        deleteProgram,
        submitPengajuan,
        updateVerifikasiPengajuan,
        saveSurveiLapangan,
        addPenerima,
        updateStatusPenerima,
        deletePenerima,
        addPenyaluran,
        updatePenyaluran,
        deletePenyaluran,
        addPengumuman,
        editPengumuman,
        deletePengumuman,
        login,
        logout,
        resetToDefaultData,
        findStatusByNikOrReg,
      }}
    >
      {children}
    </BansosContext.Provider>
  );
};

export const useBansos = () => {
  const context = useContext(BansosContext);
  if (!context) {
    throw new Error('useBansos must be used within a BansosProvider');
  }
  return context;
};
