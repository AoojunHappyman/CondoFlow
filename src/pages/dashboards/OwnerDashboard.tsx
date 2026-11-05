import React from 'react';
import {
  Building,
  Home,
  Receipt,
  CreditCard,
  Wrench,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  DollarSign,
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
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatThaiDate } from '../../lib/utils';
import { Badge, getUnitStatusBadge, getInvoiceStatusBadge } from '../../components/common/Badge';

export const OwnerDashboard: React.FC = () => {
  const {
    currentUser,
    units,
    contracts,
    invoices,
    repairs,
    navigateTo,
  } = useApp();

  // Units owned by this owner: A-1205 and B-0808
  const ownedUnitIds = currentUser?.ownedUnitIds || ['unit-a-1205', 'unit-b-0808'];
  const myUnits = units.filter(u => ownedUnitIds.includes(u.id));

  const occupiedCount = myUnits.filter(u => u.status === 'occupied').length;
  const vacantOrPendingCount = myUnits.filter(u => u.status !== 'occupied').length;

  // Invoices for owned units (Common fees & rent)
  const myUnitNumbers = myUnits.map(u => u.unitNumber);
  const myInvoices = invoices.filter(
    i => myUnitNumbers.includes(i.unitNumber) || i.recipientId === currentUser?.id
  );

  const pendingCommonFees = myInvoices.filter(
    i => i.category === 'common_fee' && (i.status === 'pending' || i.status === 'due_soon' || i.status === 'verifying')
  );
  const totalCommonFeeDue = pendingCommonFees.reduce((sum, i) => sum + i.totalAmount, 0);

  const totalPaidCommonFees = myInvoices
    .filter(i => i.category === 'common_fee' && i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  // Contracts for owned units
  const myContracts = contracts.filter(c => myUnitNumbers.includes(c.unitNumber));

  // Repairs for owned units
  const myRepairs = repairs.filter(r => myUnitNumbers.some(num => r.location.includes(num)));

  // Mock historical cashflow chart data (Rent income vs Common fee)
  const chartData = [
    { month: 'มิ.ย. 69', rentIncome: 16500, commonFee: 0 },
    { month: 'ก.ค. 69', rentIncome: 16500, commonFee: 13725 },
    { month: 'ส.ค. 69', rentIncome: 16500, commonFee: 0 },
    { month: 'ก.ย. 69', rentIncome: 16500, commonFee: 0 },
    { month: 'ต.ค. 69', rentIncome: 16500, commonFee: 5825 },
    { month: 'พ.ย. 69', rentIncome: 44500, commonFee: 8400 }, // A-1205 rent + B-0808 new lease
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Home className="w-3.5 h-3.5" />
              บัญชีเจ้าของห้องชุด (Unit Owner)
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold font-heading">
              สวัสดีคุณ {currentUser?.firstName} {currentUser?.lastName}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              พอร์ตการลงทุนอสังหาฯ ในโครงการ CondoFlow พระราม 9 ทั้งหมด {myUnits.length} ยูนิต
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigateTo('/owner/expenses')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>ชำระค่าส่วนกลาง</span>
            </button>
            <button
              onClick={() => navigateTo('/owner/contracts')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow transition-all active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>ดูสัญญาเช่า ({myContracts.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">ห้องที่เป็นเจ้าของ</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {myUnits.length} ยูนิต
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              มีผู้เช่าแล้ว {occupiedCount} • รอเข้าอยู่/ว่าง {vacantOrPendingCount}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>ห้อง:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{myUnitNumbers.join(', ')}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">ค่าส่วนกลางค้างชำระ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {formatCurrency(totalCommonFeeDue)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {pendingCommonFees.length > 0 ? `${pendingCommonFees.length} รายการ (ไตรมาส 4)` : 'ชำระครบถ้วน'}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>ชำระแล้วสะสม:</span>
            <span className="text-emerald-600 font-semibold">{formatCurrency(totalPaidCommonFees)}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">ประมาณการรายรับค่าเช่า</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {formatCurrency(myUnits.reduce((sum, u) => sum + u.rentPrice, 0))}/ด.
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              A-1205 (฿16.5k) + B-0808 (฿28k)
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>สถานะผู้เช่า:</span>
            <span className="text-brand-600 font-medium">สมบัติ, พีรณัฐ</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">รายการแจ้งซ่อมของห้อง</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              {myRepairs.length} งาน
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              ล่าสุด: ประตูกระจกระเบียง B-0808
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => navigateTo('/maintenance')}
              className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
            >
              ดูรายการแจ้งซ่อม <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cashflow Chart: Rental Income vs Common Fee Expense */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              สรุปกระแสเงินสดรายรับค่าเช่าเทียบกับค่าส่วนกลาง (6 เดือนย้อนหลัง)
            </h3>
            <p className="text-xs text-slate-500">
              วิเคราะห์รายรับจากการปล่อยเช่าห้องชุดและค่าใช้จ่ายในการบริหารจัดการ
            </p>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `฿${v / 1000}k`} />
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="rentIncome" name="รายรับค่าเช่า (Rent Income)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="commonFee" name="ค่าส่วนกลาง/บำรุงรักษา (Expenses)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Owned Units Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-600" />
            ตารางสรุปห้องชุดที่เป็นเจ้าของ
          </h3>
          <button
            onClick={() => navigateTo('/owner/units')}
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
          >
            ดูรายละเอียดทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-3">เลขห้อง</th>
                <th className="py-3 px-3">อาคาร / ชั้น</th>
                <th className="py-3 px-3">ประเภท / ขนาด</th>
                <th className="py-3 px-3">ค่าเช่ารายเดือน</th>
                <th className="py-3 px-3">ค่าส่วนกลาง</th>
                <th className="py-3 px-3">ผู้เช่าปัจจุบัน</th>
                <th className="py-3 px-3">สถานะห้อง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {myUnits.map(unit => (
                <tr key={unit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-brand-600 dark:text-brand-400">{unit.unitNumber}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">อาคาร {unit.building} ชั้น {unit.floor}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{unit.roomType} ({unit.sizeSqm} ตร.ม.)</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{formatCurrency(unit.rentPrice)}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{formatCurrency(unit.commonFee)}/ด.</td>
                  <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">
                    {unit.currentTenantName || <span className="text-slate-400">-</span>}
                  </td>
                  <td className="py-3 px-3">{getUnitStatusBadge(unit.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
