import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    info: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    purple: 'bg-purple-500',
    neutral: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border shadow-sm transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};

// Thai Status Map Helpers
export const getUnitStatusBadge = (status: string) => {
  switch (status) {
    case 'vacant':
      return <Badge variant="success" dot>ว่าง (Vacant)</Badge>;
    case 'occupied':
      return <Badge variant="info" dot>มีผู้เช่า (Occupied)</Badge>;
    case 'pending_move_in':
      return <Badge variant="warning" dot>รอเข้าอยู่ (Pending Move-in)</Badge>;
    case 'under_repair':
      return <Badge variant="danger" dot>อยู่ระหว่างซ่อม (Under Repair)</Badge>;
    case 'renovating':
      return <Badge variant="neutral" dot>ปิดปรับปรุง (Renovating)</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const getInvoiceStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge variant="success" dot>ชำระแล้ว (Paid)</Badge>;
    case 'pending':
      return <Badge variant="warning" dot>รอชำระ (Pending)</Badge>;
    case 'due_soon':
      return <Badge variant="warning" dot>ใกล้ครบกำหนด (Due Soon)</Badge>;
    case 'overdue':
      return <Badge variant="danger" dot>เกินกำหนด (Overdue)</Badge>;
    case 'verifying':
      return <Badge variant="info" dot>รอตรวจสอบ (Verifying)</Badge>;
    case 'draft':
      return <Badge variant="neutral">ฉบับร่าง (Draft)</Badge>;
    case 'cancelled':
      return <Badge variant="neutral">ยกเลิก (Cancelled)</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const getRepairStatusBadge = (status: string) => {
  switch (status) {
    case 'submitted':
      return <Badge variant="neutral" dot>ส่งคำร้องแล้ว</Badge>;
    case 'received':
      return <Badge variant="info" dot>รับเรื่องแล้ว</Badge>;
    case 'in_progress':
      return <Badge variant="info" dot>กำลังดำเนินการ</Badge>;
    case 'waiting_parts':
      return <Badge variant="warning" dot>รออะไหล่</Badge>;
    case 'completed':
      return <Badge variant="success" dot>ดำเนินการเสร็จแล้ว</Badge>;
    case 'closed':
      return <Badge variant="success" dot>ปิดงานแล้ว</Badge>;
    case 'rejected':
      return <Badge variant="danger" dot>ปฏิเสธ</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const getParcelStatusBadge = (status: string) => {
  switch (status) {
    case 'pending_pickup':
      return <Badge variant="warning" dot>รอรับพัสดุ</Badge>;
    case 'picked_up':
      return <Badge variant="success" dot>รับแล้ว</Badge>;
    case 'arrived':
      return <Badge variant="info" dot>พัสดุมาถึงแล้ว</Badge>;
    case 'returned':
      return <Badge variant="danger" dot>ส่งคืนต้นทาง</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const getContractStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="success" dot>มีผลใช้งาน (Active)</Badge>;
    case 'expiring_soon':
      return <Badge variant="warning" dot>ใกล้หมดอายุ (Expiring Soon)</Badge>;
    case 'pending_start':
      return <Badge variant="info" dot>รอเริ่มสัญญา</Badge>;
    case 'draft':
      return <Badge variant="neutral">ฉบับร่าง (Draft)</Badge>;
    case 'expired':
      return <Badge variant="neutral">หมดอายุ (Expired)</Badge>;
    case 'terminated':
      return <Badge variant="danger">ยกเลิกสัญญา (Terminated)</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const getUrgencyBadge = (urgency: string) => {
  switch (urgency) {
    case 'emergency':
      return <Badge variant="danger" dot>ฉุกเฉิน (Emergency)</Badge>;
    case 'high':
      return <Badge variant="danger" dot>สูง (High)</Badge>;
    case 'normal':
      return <Badge variant="info">ปกติ (Normal)</Badge>;
    case 'low':
      return <Badge variant="neutral">ต่ำ (Low)</Badge>;
    default:
      return <Badge variant="neutral">{urgency}</Badge>;
  }
};
