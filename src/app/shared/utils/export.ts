export type CsvCell = string | number | null | undefined;

function escapeCell(value: CsvCell): string {
  const text = value == null ? '' : String(value);
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function downloadCsv(filename: string, headers: string[], rows: CsvCell[][]): void {
  const lines = [headers, ...rows].map(row => row.map(escapeCell).join(','));
  const blob = new Blob(['﻿' + lines.join('\r\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function printToPdf(): void {
  window.print();
}
