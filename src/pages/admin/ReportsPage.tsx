import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Building,
  Download,
  Printer,
  TrendingUp,
  PieChart as PieIcon,
  CheckCircle,
  Clock,
  Star,
  Package,
  Wrench,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency, exportToCSV } from '../../lib/utils';

export const ReportsPage: React.FC = () => {
  const { units, contracts, invoices, repairs, parcels, addToast } = useApp();

  const [dateRange, setDateRange] = useState('2026-Q4');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [activeReportTab, setActiveReportTab] = useState<'occupancy' | 'revenue' | 'contracts' | 'repairs' | 'parcels'>('occupancy');

  // Filtered dataset
  const filteredUnits = units.filter(u => selectedBuilding === 'all' || u.building === selectedBuilding);
  const totalUnits = filteredUnits.length;
  const occupiedUnits = filteredUnits.filter(u => u.status === 'occupied').length;
  const vacantUnits = filteredUnits.filter(u => u.status === 'vacant').length;
  const occupancyRate = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // Revenue metrics
  const totalBilled = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const totalOutstanding = invoices.filter(i => i.status === 'pending' || i.status === 'due_soon' || i.status === 'overdue').reduce((sum, i) => sum + i.totalAmount, 0);

  // Revenue by Category
  const categoryData = [
    { name: 'ค่าเช่าห้องชุด', amount: 125000, color: '#0284c7' },
    { name: 'ค่าส่วนกลาง', amount: 48000, color: '#0d9488' },
    { name: 'ค่าน้ำประปา', amount: 8500, color: '#38bdf8' },
    { name: 'ค่าไฟฟ้า', amount: 24000, color: '#f59e0b' },
    { name: 'ค่าปรับ/ค่าเสียหาย', amount: 3500, color: '#f43f5e' },
  ];

  // Monthly Cash Flow
  const monthlyCashflow = [
    { month: 'ก.ค. 69', revenue: 125000, collected: 125000 },
    { month: 'ส.ค. 69', revenue: 135000, collected: 132000 },
    { month: 'ก.ย. 69', revenue: 142000, collected: 139000 },
    { month: 'ต.ค. 69', revenue: 158000, collected: 148000 },
    { month: 'พ.ย. 69', revenue: 185000, collected: 128000 },
  ];

  // Repairs Turnaround Metrics
  const repairRatings = repairs.filter(r => r.rating).map(r => r.rating as number);
  const avgSatisfaction = repairRatings.length
    ? (repairRatings.reduce((sum, r) => sum + r, 0) / repairRatings.length).toFixed(1)
    : '4.8';

  const handleExportCSV = () => {
    let exportData: any[] = [];
    if (activeReportTab === 'occupancy') {
      exportData = filteredUnits.map(u => ({
        'Unit': u.unitNumber,
        'Building': u.building,
        'Floor': u.floor,
        'Status': u.status,
        'Rent Price': u.rentPrice,
      }));
    } else {
      exportData = invoices.map(i => ({
        'Invoice': i.invoiceNumber,
        'Unit': i.unitNumber,
        'Total': i.totalAmount,
        'Status': i.status,
      }));
    }
    exportToCSV(`CondoFlow_Report_${activeReportTab}`, exportData);
    addToast('success', 'ส่งออกข้อมูลรายงาน CSV เรียบร้อยแล้ว');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-brand-600" />
            รายงานสรุปและสถิติภาพรวม (Reports & Analytics)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            วิเคราะห์อัตราการเข้าพัก ยอดจัดเก็บรายรับ สัญญาเช่า สถิติงานซ่อมบำรุง และระบบพัสดุ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์รายงาน (Print)</span>
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>ช่วงเวลาการวิเคราะห์:</span>
          </div>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-medium"
          >
            <option value="2026-Q4">ไตรมาสที่ 4/2569 (ต.ค. - ธ.ค. 2569)</option>
            <option value="2026-Q3">ไตรมาสที่ 3/2569 (ก.ค. - ก.ย. 2569)</option>
            <option value="2026-YEAR">ประจำปี 2569 ทั้งหมด</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Building className="w-4 h-4 text-slate-400" />
            <span>ตัวกรองอาคาร:</span>
          </div>
          <select
            value={selectedBuilding}
            onChange={e => setSelectedBuilding(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-medium"
          >
            <option value="all">ทุกอาคาร (A & B รวม 20 ห้อง)</option>
            <option value="A">เฉพาะอาคาร A (10 ห้อง)</option>
            <option value="B">เฉพาะอาคาร B (10 ห้อง)</option>
          </select>
        </div>
      </div>

      {/* Report Section Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveReportTab('occupancy')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeReportTab === 'occupancy'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>24.1 รายงานห้องชุด (Occupancy)</span>
        </button>

        <button
          onClick={() => setActiveReportTab('revenue')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeReportTab === 'revenue'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>24.2 รายงานรายรับ & ชำระเงิน</span>
        </button>

        <button
          onClick={() => setActiveReportTab('contracts')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeReportTab === 'contracts'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>24.3 รายงานสัญญาเช่า</span>
        </button>

        <button
          onClick={() => setActiveReportTab('repairs')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeReportTab === 'repairs'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>24.4 รายงานการแจ้งซ่อม</span>
        </button>

        <button
          onClick={() => setActiveReportTab('parcels')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeReportTab === 'parcels'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>24.5 รายงานพัสดุ</span>
        </button>
      </div>

      {/* Tab 1: Occupancy Report */}
      {activeReportTab === 'occupancy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">อัตราการเข้าพัก (Occupancy Rate)</span>
              <div className="text-3xl font-bold text-brand-600 font-heading mt-1">{occupancyRate}%</div>
              <span className="text-xs text-slate-500">เป้าหมายโครงการ: &gt;80%</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">ห้องมีผู้เช่าแล้ว</span>
              <div className="text-3xl font-bold text-emerald-600 font-heading mt-1">{occupiedUnits} ห้อง</div>
              <span className="text-xs text-slate-500">จากทั้งหมด {totalUnits} ยูนิต</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">ห้องว่างพร้อมเช่า</span>
              <div className="text-3xl font-bold text-slate-900 dark:text-white font-heading mt-1">{vacantUnits} ห้อง</div>
              <span className="text-xs text-slate-500">พร้อมนัดชมสถานที่</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">อยู่ระหว่างซ่อม/รีโนเวท</span>
              <div className="text-3xl font-bold text-amber-500 font-heading mt-1">
                {filteredUnits.filter(u => u.status === 'under_repair' || u.status === 'renovating').length} ห้อง
              </div>
              <span className="text-xs text-slate-500">ห้อง A-0810, B-0202</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white">
              การกระจายตัวของห้องชุดแยกตามชั้น (อาคาร A และ B)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { floor: 'ชั้น 2-4', occupied: 2, vacant: 3 },
                    { floor: 'ชั้น 5-8', occupied: 2, vacant: 4 },
                    { floor: 'ชั้น 9-12', occupied: 3, vacant: 3 },
                    { floor: 'ชั้น 14-16', occupied: 1, vacant: 2 },
                  ]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="floor" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="occupied" name="มีผู้เช่า (Occupied)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vacant" name="ว่าง (Vacant)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Revenue Report */}
      {activeReportTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">ยอดเรียกเก็บสุทธิ</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading mt-1">{formatCurrency(totalBilled)}</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">ยอดจัดเก็บสำเร็จ</span>
              <div className="text-2xl font-bold text-emerald-600 font-heading mt-1">{formatCurrency(totalPaid)}</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">ยอดค้างชำระคงเหลือ</span>
              <div className="text-2xl font-bold text-rose-600 font-heading mt-1">{formatCurrency(totalOutstanding)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend Area Chart */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white">
                แนวโน้มรายรับและการจัดเก็บเงินย้อนหลัง (Monthly Cashflow Trend)
              </h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyCashflow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${v / 1000}k`} />
                    <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                    <Area type="monotone" dataKey="revenue" name="ยอดเรียกเก็บ" stroke="#94a3b8" fill="#e2e8f0" />
                    <Area type="monotone" dataKey="collected" name="ยอดชำระจริง" stroke="#0ea5e9" fill="#bae6fd" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Donut */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white">
                สัดส่วนรายรับแยกตามประเภทค่าใช้จ่าย
              </h3>
              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="amount">
                      {categoryData.map((c, i) => (
                        <Cell key={i} fill={c.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Contracts Report */}
      {activeReportTab === 'contracts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">สัญญาที่ Active</span>
              <div className="text-2xl font-bold text-emerald-600 font-heading mt-1">
                {contracts.filter(c => c.status === 'active').length} สัญญา
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">สัญญาใกล้หมดอายุ (60 วัน)</span>
              <div className="text-2xl font-bold text-amber-500 font-heading mt-1">
                {contracts.filter(c => c.status === 'expiring_soon').length} สัญญา
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">ค่าเช่าเฉลี่ยต่อห้อง</span>
              <div className="text-2xl font-bold text-brand-600 font-heading mt-1">
                {formatCurrency(contracts.reduce((sum, c) => sum + c.monthlyRent, 0) / (contracts.length || 1))}
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">สัญญายกเลิก/สิ้นสุด</span>
              <div className="text-2xl font-bold text-slate-500 font-heading mt-1">
                {contracts.filter(c => c.status === 'terminated' || c.status === 'expired').length} สัญญา
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Repairs Report */}
      {activeReportTab === 'repairs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">คะแนนความพึงพอใจเฉลี่ย</span>
              <div className="text-3xl font-bold text-amber-500 font-heading mt-1 flex items-center gap-1.5">
                <span>{avgSatisfaction}</span>
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              </div>
              <span className="text-xs text-slate-500">เต็ม 5 ดาว จากผู้เช่า</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">ระยะเวลาดำเนินการเฉลี่ย</span>
              <div className="text-3xl font-bold text-brand-600 font-heading mt-1">1.8 วัน</div>
              <span className="text-xs text-slate-500">เป้าหมาย &lt; 48 ชม.</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">คำร้องแจ้งซ่อมทั้งหมด</span>
              <div className="text-3xl font-bold text-slate-900 dark:text-white font-heading mt-1">{repairs.length} งาน</div>
              <span className="text-xs text-emerald-600 font-medium">ปิดงานแล้ว 40%</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">ปัญหาที่พบบ่อยอันดับ 1</span>
              <div className="text-xl font-bold text-indigo-600 font-heading mt-1">ระบบแอร์ & ประปา</div>
              <span className="text-xs text-slate-500">สัดส่วน 45% ของงานทั้งหมด</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Parcels Report */}
      {activeReportTab === 'parcels' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">พัสดุรับเข้าทั้งหมด</span>
              <div className="text-3xl font-bold text-slate-900 dark:text-white font-heading mt-1">{parcels.length} ชิ้น</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">ส่งมอบเรียบร้อยแล้ว</span>
              <div className="text-3xl font-bold text-emerald-600 font-heading mt-1">
                {parcels.filter(p => p.status === 'picked_up').length} ชิ้น
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">พัสดุรอรับที่นิติ</span>
              <div className="text-3xl font-bold text-amber-500 font-heading mt-1">
                {parcels.filter(p => p.status === 'pending_pickup').length} ชิ้น
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400">ระยะเวลารับเฉลี่ย</span>
              <div className="text-3xl font-bold text-brand-600 font-heading mt-1">4.5 ชม.</div>
              <span className="text-xs text-slate-500">ผ่านตู้ Locker และเคาน์เตอร์</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
