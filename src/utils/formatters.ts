export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function maskNik(nik: string): string {
  if (!nik) return '-';
  const clean = nik.trim();
  if (clean.length < 8) return clean;
  // Menampilkan 6 digit depan dan 4 digit belakang, tengahnya disamarkan bintang
  const prefix = clean.slice(0, 6);
  const suffix = clean.slice(-4);
  return `${prefix}******${suffix}`;
}

export function maskKk(kk: string): string {
  if (!kk) return '-';
  const clean = kk.trim();
  if (clean.length < 8) return clean;
  const prefix = clean.slice(0, 6);
  const suffix = clean.slice(-4);
  return `${prefix}******${suffix}`;
}

export function maskNama(name: string): string {
  if (!name) return '-';
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      return part[0] + '*'.repeat(Math.max(part.length - 1, 2));
    })
    .join(' ');
}

export function formatTanggal(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatTanggalJam(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function generateRegistrationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `REG-${year}-${random}`;
}

