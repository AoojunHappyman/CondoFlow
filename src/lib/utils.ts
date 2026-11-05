import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Thai Currency Formatter: e.g. ฿8,500.00
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '฿0.00';
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('THB', '฿').trim();
}

const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

// Thai Date Formatter: converts to Buddhist Era (พ.ศ. = ค.ศ. + 543)
export function formatThaiDate(
  dateInput: string | Date | undefined | null,
  options?: { short?: boolean; includeTime?: boolean }
): string {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const day = d.getDate();
  const month = options?.short 
    ? THAI_MONTHS_SHORT[d.getMonth()] 
    : THAI_MONTHS_FULL[d.getMonth()];
  const thaiYear = d.getFullYear() + 543;

  if (options?.includeTime) {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${thaiYear} เวลา ${hours}:${minutes} น.`;
  }

  return `${day} ${month} ${thaiYear}`;
}

// Relative time in Thai: e.g. "5 นาทีที่แล้ว", "เมื่อวาน"
export function formatRelativeTimeThai(dateInput: string | Date): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffSec < 60) return 'เมื่อสักครู่';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} นาทีที่แล้ว`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ชั่วโมงที่แล้ว`;
  if (diffSec < 172800) return 'เมื่อวานนี้';
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} วันที่แล้ว`;
  
  return formatThaiDate(d, { short: true });
}

// Mask ID Card: 1-1002-00345-67-8 -> 1-xxxx-xxxxx-67-8
export function maskIdCard(idCard: string): string {
  if (!idCard) return '-';
  const clean = idCard.replace(/\D/g, '');
  if (clean.length < 13) return idCard;
  return `${clean.slice(0, 1)}-xxxx-xxxxx-${clean.slice(10, 12)}-${clean.slice(12)}`;
}

// Mask Phone: 081-234-5678 -> 081-xxx-5678
export function maskPhone(phone: string): string {
  if (!phone) return '-';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 3)}-xxx-${clean.slice(6)}`;
  }
  return phone;
}

// Password strength evaluator (0 to 100)
export interface PasswordValidation {
  score: number; // 0-4
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  strengthLabel: 'ต่ำมาก' | 'ต่ำ' | 'ปานกลาง' | 'ปลอดภัย' | 'แข็งแรงมาก';
  color: string;
}

export function checkPasswordStrength(password: string): PasswordValidation {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let strengthLabel: PasswordValidation['strengthLabel'] = 'ต่ำมาก';
  let color = 'bg-rose-500';

  if (score === 1) {
    strengthLabel = 'ต่ำ';
    color = 'bg-orange-500';
  } else if (score === 2) {
    strengthLabel = 'ปานกลาง';
    color = 'bg-amber-500';
  } else if (score === 3) {
    strengthLabel = 'ปลอดภัย';
    color = 'bg-emerald-500';
  } else if (score >= 4) {
    strengthLabel = 'แข็งแรงมาก';
    color = 'bg-teal-600';
  }

  return {
    score,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    strengthLabel,
    color,
  };
}

// Export array of objects to CSV
export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    '\uFEFF' + // UTF-8 BOM for Excel Thai language support
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString('th-TH') : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Simulate latency (300-500ms)
export const delay = (ms: number = 350) => new Promise(resolve => setTimeout(resolve, ms));
