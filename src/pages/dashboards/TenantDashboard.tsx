import React, { useState } from 'react';
import {
  Home,
  FileText,
  CreditCard,
  Wrench,
  Package,
  Megaphone,
  Clock,
  ArrowRight,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Phone,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatThaiDate } from '../../lib/utils';
import { Badge, getInvoiceStatusBadge, getRepairStatusBadge } from '../../components/common/Badge';

export const TenantDashboard: React.FC = () => {
  const {
    currentUser,
    units,
    contracts,
    invoices,
    repairs,
    parcels,
    announcements,
    navigateTo,
  } = useApp();

  // Tenant unit info
  const unitNumber = currentUser?.unitNumber || 'A-1205';
  const myUnit = units.find(u => u.unitNumber === unitNumber) || units[0];

  // Tenant active contract
  const myContract = contracts.find(
    c => c.unitNumber === unitNumber && (c.status === 'active' || c.status === 'expiring_soon')
  );

  // Tenant invoices
  const myInvoices = invoices.filter(
    i => i.unitNumber === unitNumber || i.recipientId === currentUser?.id
  );
  const pendingInvoice = myInvoices.find(
    i => i.status === 'pending' || i.status === 'due_soon' || i.status === 'overdue'
  );
  const totalUnpaid = myInvoices
    .filter(i => i.status === 'pending' || i.status === 'due_soon' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  // Active repairs
  const myRepairs = repairs.filter(
    r => r.requesterId === currentUser?.id || r.location.includes(unitNumber)
  );
  const activeRepairs = myRepairs.filter(
    r => r.status !== 'closed' && r.status !== 'rejected'
  );

  // Pending parcels
  const myParcels = parcels.filter(
    p => (p.recipientId === currentUser?.id || p.unitNumber === unitNumber) && p.status === 'pending_pickup'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-brand-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              ยินดีต้อนรับกลับ, ผู้เช่าห้อง {unitNumber}
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold font-heading">
              สวัสดีคุณ {currentUser?.firstName} {currentUser?.lastName}
            </h1>
            <p className="text-xs text-brand-100 max-w-xl leading-relaxed">
              โครงการ CondoFlow พระราม 9 • สัญญาเช่ามีผลใช้งานถึง {formatThaiDate(myContract?.endDate)}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigateTo('/payments')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-brand-50 shadow-md transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4 text-brand-600" />
              <span>แจ้งชำระเงิน</span>
            </button>
            <button
              onClick={() => navigateTo('/maintenance')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600/80 hover:bg-brand-600 text-white border border-white/20 shadow-md transition-all active:scale-95"
            >
              <Wrench className="w-4 h-4 text-amber-300" />
              <span>แจ้งซ่อม</span>
            </button>
            <button
              onClick={() => navigateTo('/parcels')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-800/80 hover:bg-indigo-700 text-white border border-white/20 shadow-md transition-all active:scale-95"
            >
              <Package className="w-4 h-4 text-emerald-300" />
              <span>ดูพัสดุ ({myParcels.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unit Info Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">ห้องที่กำลังเช่า</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {myUnit?.unitNumber}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              อาคาร {myUnit?.building} ชั้น {myUnit?.floor} • {myUnit?.roomType} ({myUnit?.sizeSqm} ตร.ม.)
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">สถานะสัญญา:</span>
            <Badge variant="success" dot size="sm">มีผลใช้งาน</Badge>
          </div>
        </div>

        {/* Latest Invoice / Due */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">ยอดค้างชำระรอบนี้</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {formatCurrency(totalUnpaid)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {pendingInvoice ? `ครบกำหนด ${formatThaiDate(pendingInvoice.dueDate)}` : 'ไม่มีบิลค้างชำระ'}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">ค่าเช่ารายเดือน:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(myUnit?.rentPrice || 16500)}</span>
          </div>
        </div>

        {/* Active Repairs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">รายการแจ้งซ่อมที่ดำเนินการ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {activeRepairs.length} รายการ
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {activeRepairs[0] ? activeRepairs[0].title : 'ไม่มีงานซ่อมค้าง'}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">ช่างนัดหมาย:</span>
            <span className="text-brand-600 dark:text-brand-400 font-medium">
              {activeRepairs[0]?.appointmentDate ? formatThaiDate(activeRepairs[0].appointmentDate, { short: true }) : '-'}
            </span>
          </div>
        </div>

        {/* Parcels Waiting */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">พัสดุรอรับที่นิติ</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {myParcels.length} ชิ้น
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {myParcels.length > 0 ? `รหัสรับ: ${myParcels.map(p => p.pickupCode).join(', ')}` : 'ไม่มีพัสดุตกค้าง'}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => navigateTo('/parcels')}
              className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
            >
              เปิด QR Code รับพัสดุ <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Invoices & Repairs, Right Parcels & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Invoices & Active Repairs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Unpaid Bill Banner / Action */}
          {pendingInvoice && (
            <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    ใบแจ้งหนี้รอบล่าสุด: {pendingInvoice.billingCycle} ({pendingInvoice.invoiceNumber})
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                    ยอดรวม {formatCurrency(pendingInvoice.totalAmount)} • กำหนดชำระภายใน {formatThaiDate(pendingInvoice.dueDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('/payments')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all whitespace-nowrap"
              >
                แจ้งชำระเงินทันที
              </button>
            </div>
          )}

          {/* Active Repairs Timeline */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-brand-600" />
                ติดตามสถานะการแจ้งซ่อมของห้อง
              </h3>
              <button
                onClick={() => navigateTo('/maintenance')}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
              >
                ดูทั้งหมด ({myRepairs.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeRepairs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                ไม่มีรายการแจ้งซ่อมที่อยู่ระหว่างดำเนินการ
              </div>
            ) : (
              <div className="space-y-4">
                {activeRepairs.slice(0, 2).map(rep => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-brand-600 dark:text-brand-400">
                            {rep.ticketNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {rep.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{rep.description}</p>
                      </div>
                      {getRepairStatusBadge(rep.status)}
                    </div>

                    {rep.assignedTechnician && (
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>ช่างผู้รับผิดชอบ: <strong>{rep.assignedTechnician}</strong></span>
                        {rep.appointmentDate && (
                          <span className="text-brand-600 dark:text-brand-400 font-medium">
                            นัดหมาย: {formatThaiDate(rep.appointmentDate, { includeTime: true })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Invoices History */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                ประวัติใบแจ้งหนี้ห้อง {unitNumber}
              </h3>
              <button
                onClick={() => navigateTo('/payments')}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
              >
                ดูประวัติทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-2.5 px-3">เลขที่บิล</th>
                    <th className="py-2.5 px-3">รอบบิล</th>
                    <th className="py-2.5 px-3">ยอดรวม</th>
                    <th className="py-2.5 px-3">ครบกำหนด</th>
                    <th className="py-2.5 px-3">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myInvoices.slice(0, 4).map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{inv.invoiceNumber}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{inv.billingCycle}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{formatCurrency(inv.totalAmount)}</td>
                      <td className="py-2.5 px-3 text-slate-500">{formatThaiDate(inv.dueDate, { short: true })}</td>
                      <td className="py-2.5 px-3">{getInvoiceStatusBadge(inv.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Parcels & Announcements */}
        <div className="space-y-6">
          {/* Waiting Parcels Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                พัสดุรอรับ ({myParcels.length})
              </h3>
              <button
                onClick={() => navigateTo('/parcels')}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
              >
                ดูพัสดุทั้งหมด
              </button>
            </div>

            {myParcels.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                ไม่มีพัสดุรอรับในขณะนี้
              </div>
            ) : (
              <div className="space-y-3">
                {myParcels.map(p => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{p.courier}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                        {p.pickupCode}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      แทร็กกิ้ง: {p.trackingNumber}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      จุดรับ: {p.pickupPoint}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Announcements Widget */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-brand-600" />
                ประกาศล่าสุด
              </h3>
              <button
                onClick={() => navigateTo('/announcements')}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
              >
                ดูทั้งหมด
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map(a => (
                <div
                  key={a.id}
                  onClick={() => navigateTo('/announcements')}
                  className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-1.5">
                    {a.isPinned && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                        ปักหมุด
                      </span>
                    )}
                    <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {a.title}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {a.content}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {formatThaiDate(a.startDate, { short: true })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
