import React, { useState } from 'react';
import {
  Building,
  Home,
  Users,
  CreditCard,
  Wrench,
  Package,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatThaiDate, formatRelativeTimeThai } from '../../lib/utils';
import { Badge, getInvoiceStatusBadge, getRepairStatusBadge, getUnitStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminDashboard: React.FC = () => {
  const {
    units,
    owners,
    tenants,
    contracts,
    invoices,
    payments,
    repairs,
    parcels,
    auditLogs,
    navigateTo,
    verifyPayment,
  } = useApp();

  // Selected payment for verification dialog
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // 12 KPI Computations
  const totalUnits = units.length;
  const vacantUnits = units.filter(u => u.status === 'vacant').length;
  const occupiedUnits = units.filter(u => u.status === 'occupied').length;
  const currentTenants = tenants.filter(t => t.status === 'renting' || t.status === 'expiring_soon').length;
  const unitOwners = owners.length;

  const totalBilled = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const totalOutstanding = invoices.filter(i => i.status === 'pending' || i.status === 'due_soon' || i.status === 'overdue').reduce((sum, i) => sum + i.totalAmount, 0);

  const pendingPayments = payments.filter(p => p.status === 'pending_verification');
  const activeRepairs = repairs.filter(r => r.status !== 'closed' && r.status !== 'rejected');
  const pendingParcels = parcels.filter(p => p.status === 'pending_pickup');
  const expiringContracts = contracts.filter(c => c.status === 'expiring_soon');

  // Chart 1: Monthly Revenue & Collection
  const monthlyRevenueData = [
    { month: 'ก.ค. 69', billed: 125000, collected: 125000 },
    { month: 'ส.ค. 69', billed: 135000, collected: 132000 },
    { month: 'ก.ย. 69', billed: 142000, collected: 139000 },
    { month: 'ต.ค. 69', billed: 158000, collected: 148000 },
    { month: 'พ.ย. 69', billed: 185000, collected: 128000 },
  ];

  // Chart 2: Paid vs Outstanding
  const paidVsOutstandingData = [
    { name: 'ชำระแล้ว (Paid)', value: Math.round(totalCollected), color: '#10b981' },
    { name: 'ค้างชำระ (Outstanding)', value: Math.round(totalOutstanding), color: '#f43f5e' },
  ];

  // Chart 3: Units by Status
  const unitStatusData = [
    { name: 'มีผู้เช่า (Occupied)', value: occupiedUnits, color: '#0ea5e9' },
    { name: 'ว่าง (Vacant)', value: vacantUnits, color: '#10b981' },
    { name: 'รอเข้าอยู่ (Pending)', value: units.filter(u => u.status === 'pending_move_in').length, color: '#f59e0b' },
    { name: 'ปรับปรุง/ซ่อม', value: units.filter(u => u.status === 'under_repair' || u.status === 'renovating').length, color: '#64748b' },
  ];

  // Chart 4: Repairs by Category
  const categoryCount: Record<string, number> = {};
  repairs.forEach(r => {
    categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
  });
  const repairCategoryData = [
    { name: 'แอร์', count: categoryCount['aircon'] || 2 },
    { name: 'ประปา', count: categoryCount['plumbing'] || 2 },
    { name: 'ไฟฟ้า', count: categoryCount['electrical'] || 1 },
    { name: 'ประตู/หน้าต่าง', count: categoryCount['doors_windows'] || 1 },
    { name: 'ส่วนกลาง', count: categoryCount['common_facility'] || 2 },
    { name: 'อื่นๆ', count: categoryCount['other'] || 2 },
  ];

  // Quick Approval Action
  const handleApprove = async (paymentId: string) => {
    await verifyPayment(paymentId, true);
    setSelectedPayment(null);
  };

  const handleReject = async (paymentId: string) => {
    if (!rejectionReason.trim()) return;
    await verifyPayment(paymentId, false, rejectionReason);
    setSelectedPayment(null);
    setIsRejecting(false);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            Executive Property Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            สรุปภาพรวมการบริหารโครงการ CondoFlow พระราม 9 ประจำวันพฤหัสบดีที่ 5 พฤศจิกายน 2569
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('/admin/invoices')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-all"
          >
            + ออกใบแจ้งหนี้
          </button>
          <button
            onClick={() => navigateTo('/admin/reports')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
          >
            สร้างรายงานสรุป
          </button>
        </div>
      </div>

      {/* 12 KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Total Units */}
        <div
          onClick={() => navigateTo('/admin/units')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">ห้องทั้งหมด</span>
            <Building className="w-3.5 h-3.5 text-brand-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-heading">{totalUnits} ห้อง</div>
          <div className="text-[10px] text-slate-400">อาคาร A (10), B (10)</div>
        </div>

        {/* 2. Vacant Units */}
        <div
          onClick={() => navigateTo('/admin/units')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">ห้องว่าง (Vacant)</span>
            <Home className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600 font-heading">{vacantUnits} ห้อง</div>
          <div className="text-[10px] text-emerald-600/80 font-medium">พร้อมเปิดเช่า</div>
        </div>

        {/* 3. Occupied Units */}
        <div
          onClick={() => navigateTo('/admin/units')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">ห้องมีผู้เช่า</span>
            <Building className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-xl font-bold text-sky-600 font-heading">{occupiedUnits} ห้อง</div>
          <div className="text-[10px] text-slate-400">Occupancy: {Math.round((occupiedUnits / totalUnits) * 100)}%</div>
        </div>

        {/* 4. Tenants */}
        <div
          onClick={() => navigateTo('/admin/owners-tenants')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">ผู้เช่าปัจจุบัน</span>
            <Users className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-purple-600 font-heading">{currentTenants} คน</div>
          <div className="text-[10px] text-slate-400">ลงทะเบียนในระบบ</div>
        </div>

        {/* 5. Owners */}
        <div
          onClick={() => navigateTo('/admin/owners-tenants')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">เจ้าของห้อง</span>
            <Home className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-indigo-600 font-heading">{unitOwners} ท่าน</div>
          <div className="text-[10px] text-slate-400">เจ้าของร่วมโครงการ</div>
        </div>

        {/* 6. Monthly Billed */}
        <div
          onClick={() => navigateTo('/admin/invoices')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">ยอดเรียกเก็บรวม</span>
            <CreditCard className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-heading truncate">
            {formatCurrency(totalBilled)}
          </div>
          <div className="text-[10px] text-slate-400">รอบบิลปัจจุบัน</div>
        </div>

        {/* 7. Collected Total */}
        <div
          onClick={() => navigateTo('/admin/invoices')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">ยอดชำระแล้ว</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-bold text-emerald-600 font-heading truncate">
            {formatCurrency(totalCollected)}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">ออกใบเสร็จแล้ว</div>
        </div>

        {/* 8. Outstanding Total */}
        <div
          onClick={() => navigateTo('/admin/invoices')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">ยอดค้างชำระ</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-lg font-bold text-rose-600 font-heading truncate">
            {formatCurrency(totalOutstanding)}
          </div>
          <div className="text-[10px] text-rose-500 font-medium">รอติดตาม</div>
        </div>

        {/* 9. Pending Verification */}
        <div
          onClick={() => navigateTo('/admin/payments')}
          className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 shadow-xs hover:scale-105 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">สลิปรอตรวจ</span>
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-600 font-heading">{pendingPayments.length} รายการ</div>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold underline">คลิกเพื่อตรวจสอบ</div>
        </div>

        {/* 10. Active Repairs */}
        <div
          onClick={() => navigateTo('/admin/repairs')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">งานซ่อมค้าง</span>
            <Wrench className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 font-heading">{activeRepairs.length} งาน</div>
          <div className="text-[10px] text-slate-400">1 ฉุกเฉิน</div>
        </div>

        {/* 11. Pending Parcels */}
        <div
          onClick={() => navigateTo('/admin/parcels')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">พัสดุรอรับ</span>
            <Package className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600 font-heading">{pendingParcels.length} ชิ้น</div>
          <div className="text-[10px] text-slate-400">รอส่งมอบ</div>
        </div>

        {/* 12. Expiring Contracts */}
        <div
          onClick={() => navigateTo('/admin/contracts')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">สัญญาใกล้หมด</span>
            <FileText className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 font-heading">{expiringContracts.length} สัญญา</div>
          <div className="text-[10px] text-slate-400">ใน 60 วัน (A-0301)</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Revenue vs Collected (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                รายรับและยอดจัดเก็บรายเดือน (5 เดือนล่าสุด)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">เปรียบเทียบยอดเรียกเก็บ (Billed) และยอดชำระจริง (Collected)</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${v / 1000}k`} />
                <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="billed" name="ยอดเรียกเก็บ" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="ยอดชำระแล้ว" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Paid vs Outstanding Donut (1 col) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              สัดส่วนการชำระเงินรอบปัจจุบัน
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">ชำระแล้วเทียบกับยอดค้างชำระ</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paidVsOutstandingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paidVsOutstandingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="text-center">
              <span className="block font-bold text-emerald-600">{formatCurrency(totalCollected)}</span>
              <span className="text-[11px] text-slate-400">ชำระแล้ว (76%)</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-rose-600">{formatCurrency(totalOutstanding)}</span>
              <span className="text-[11px] text-slate-400">ค้างชำระ (24%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Unit Status & Repair by Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Chart 3: Units by Status */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-600" />
            สถานะห้องชุด 20 ยูนิตในโครงการ
          </h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={unitStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, value }: any) => `${(name || '').split(' ')[0]}: ${value}`}
                  labelLine={false}
                >
                  {unitStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Repairs by Category */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-500" />
            สถิติการแจ้งซ่อมแยกตามประเภทงาน
          </h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repairCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="จำนวนคำร้อง" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Action Tables Grid: Payments Queue & Recent Repairs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verification Payments Queue */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white">
                คิวตรวจสอบสลิปการชำระเงิน
              </h3>
              {pendingPayments.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                  {pendingPayments.length} รอตรวจ
                </span>
              )}
            </div>
            <button
              onClick={() => navigateTo('/admin/payments')}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
            >
              ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingPayments.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              ไม่มีสลิปการชำระเงินที่รอการตรวจสอบ
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map(pay => (
                <div
                  key={pay.id}
                  className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={pay.slipUrl}
                      alt="Slip"
                      onClick={() => setSelectedPayment(pay)}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 cursor-pointer hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          ห้อง {pay.unitNumber}
                        </span>
                        <span className="text-[11px] text-slate-500">({pay.payerName})</span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                        {formatCurrency(pay.paidAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {pay.sourceBank} • {pay.paymentTime} น.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedPayment(pay)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                      title="ดูหลักฐานสลิป"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(pay.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    >
                      อนุมัติ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent System Activity / Audit Stream */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              กิจกรรมระบบล่าสุด (Real-time Audit Log)
            </h3>
            <button
              onClick={() => navigateTo('/admin/audit-log')}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
            >
              ดู Audit Log ทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatRelativeTimeThai(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    โดย: {log.actorName} ({log.role}) • โมดูล: {log.module}
                  </p>
                  {log.newValue && (
                    <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                      {log.newValue}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Verification / Slip Zoom Modal */}
      {selectedPayment && (
        <Modal
          isOpen={!!selectedPayment}
          onClose={() => {
            setSelectedPayment(null);
            setIsRejecting(false);
          }}
          title={`ตรวจสอบหลักฐานการชำระเงิน ${selectedPayment.paymentNumber}`}
          description={`ห้อง ${selectedPayment.unitNumber} โดยคุณ ${selectedPayment.payerName}`}
          maxWidth="xl"
          footer={
            !isRejecting ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-300 dark:border-rose-800"
                >
                  ปฏิเสธการชำระเงิน
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedPayment.id)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow"
                >
                  อนุมัติการชำระเงิน (ออกใบเสร็จ)
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(selectedPayment.id)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
                >
                  ยืนยันการปฏิเสธ
                </button>
              </>
            )
          }
        >
          <div className="space-y-4 text-xs">
            {/* Slip image preview */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-2 flex justify-center max-h-72 overflow-hidden">
              <img
                src={selectedPayment.slipUrl}
                alt="Payment Slip Proof"
                className="max-h-64 object-contain rounded-lg shadow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400">เลขที่ใบแจ้งหนี้:</span>
                <span className="block font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">ยอดตามใบแจ้งหนี้:</span>
                <span className="block font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(selectedPayment.invoiceAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400">ยอดที่แจ้งโอน:</span>
                <span className="block font-bold text-emerald-600 text-sm">{formatCurrency(selectedPayment.paidAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400">วันเวลาที่โอน:</span>
                <span className="block font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.paymentDate} เวลา {selectedPayment.paymentTime} น.</span>
              </div>
              <div>
                <span className="text-slate-400">ธนาคารต้นทาง:</span>
                <span className="block text-slate-700 dark:text-slate-300">{selectedPayment.sourceBank}</span>
              </div>
              <div>
                <span className="text-slate-400">เลขอ้างอิงสลิป:</span>
                <span className="block font-mono text-slate-700 dark:text-slate-300">{selectedPayment.referenceNumber}</span>
              </div>
            </div>

            {isRejecting && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 space-y-2">
                <label className="block text-xs font-semibold text-rose-800 dark:text-rose-200">
                  ระบุเหตุผลที่ปฏิเสธการชำระเงิน <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="เช่น ยอดเงินไม่ตรงกับใบแจ้งหนี้, สลิปไม่ชัดเจน, วันที่โอนไม่ถูกต้อง..."
                  className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-rose-300 dark:border-rose-800 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
