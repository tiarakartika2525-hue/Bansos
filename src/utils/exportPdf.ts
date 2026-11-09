import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { InfoKelurahan } from '../types';

export interface PdfReportOptions {
  title: string;
  subtitle?: string;
  periode?: string;
  kelurahan: InfoKelurahan;
  headers: string[];
  data: (string | number)[];
  orientation?: 'portrait' | 'landscape';
  summary?: { label: string; value: string | number }[];
}

export function generateKelurahanPdf(options: PdfReportOptions) {
  const {
    title,
    subtitle = '',
    periode = '',
    kelurahan,
    headers,
    data,
    orientation = 'landscape',
    summary = [],
  } = options;

  const doc = new jsPDF({
    orientation: orientation,
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 15;

  // --- KOP SURAT RESMI KELURAHAN ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`PEMERINTAH KOTA / KABUPATEN ${kelurahan.kotaKabupaten.toUpperCase()}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  doc.text(`KECAMATAN ${kelurahan.kecamatan.toUpperCase()}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 6;

  doc.setFontSize(14);
  doc.text(`KANTOR KELURAHAN ${kelurahan.namaKelurahan.toUpperCase()}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    `${kelurahan.alamatKantor} • Telp: ${kelurahan.telepon} • Pos: ${kelurahan.kodePos} • Email: ${kelurahan.email}`,
    pageWidth / 2,
    currentY,
    { align: 'center' }
  );
  currentY += 4;

  // Double horizontal line (Kop line)
  doc.setLineWidth(0.8);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 1;
  doc.setLineWidth(0.2);
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 7;

  // --- REPORT TITLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(title.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  if (subtitle || periode) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const subText = [subtitle, periode ? `Periode: ${periode}` : ''].filter(Boolean).join(' | ');
    doc.text(subText, pageWidth / 2, currentY, { align: 'center' });
    currentY += 5;
  }

  currentY += 2;

  // --- TABLE DATA ---
  autoTable(doc, {
    startY: currentY,
    head: [headers],
    body: data as any,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [30, 58, 138], // Indigo-900 / Navy
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (dataHook) => {
      // Footer page number
      const str = `Halaman ${doc.getNumberOfPages()} • Sistem Informasi Bantuan Sosial Kelurahan ${kelurahan.namaKelurahan}`;
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'italic');
      doc.text(str, 14, doc.internal.pageSize.getHeight() - 8);
    },
  });

  // Calculate final Y after table
  const finalY = (doc as any).lastAutoTable?.finalY || currentY + 30;

  // Check if summary and signature fit on current page
  let signY = finalY + 8;
  if (signY + 45 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
    signY = 20;
  }

  // --- SUMMARY RECAP (IF ANY) ---
  if (summary.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Ringkasan Rekapitulasi:', 14, signY);
    signY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    summary.forEach((item) => {
      doc.text(`• ${item.label}: ${item.value}`, 16, signY);
      signY += 4.5;
    });
    signY += 4;
  }

  // --- SIGNATURE SECTION ---
  if (signY + 40 > doc.internal.pageSize.getHeight()) {
    doc.addPage();
    signY = 25;
  }

  const todayStr = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const colWidth = (pageWidth - 28) / 2;
  const leftX = 20;
  const rightX = pageWidth - 20 - 60;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mengetahui,`, leftX, signY);
  doc.text(`${kelurahan.kotaKabupaten}, ${todayStr}`, rightX, signY);
  signY += 4;

  doc.setFont('helvetica', 'bold');
  doc.text(`Lurah ${kelurahan.namaKelurahan}`, leftX, signY);
  doc.text(`Kasi Kesejahteraan Sosial`, rightX, signY);
  signY += 22; // space for physical stamp / signature

  doc.text(kelurahan.namaLurah, leftX, signY);
  doc.text(kelurahan.namaKasiKesra, rightX, signY);
  signY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP. ${kelurahan.nipLurah}`, leftX, signY);
  doc.text(`NIP. ${kelurahan.nipKasiKesra}`, rightX, signY);

  const cleanFilename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(cleanFilename);
}
