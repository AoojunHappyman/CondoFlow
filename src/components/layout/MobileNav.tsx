import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building,
  CreditCard,
  Wrench,
  Menu,
  X,
  Package,
  Megaphone,
  History,
  Shield,
  BarChart3,
  Settings,
  CheckCircle,
  FileText,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export const MobileNav: React.FC = () => {
  const { activeRole, currentRoute, navigateTo, payments, repairs, parcels, invoices } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const pendingPaymentsCount = payments.filter(p => p.status === 'pending_verification').length;
  const pendingRepairsCount = repairs.filter(r => r.status === 'submitted' || r.status === 'in_progress').length;

  const handleNav = (route: string) => {
    navigateTo(route);
    setIsDrawerOpen(false);
  };

  // Bottom 4-5 items based on role
  const bottomItems = activeRole === 'admin'
    ? [
        { label: 'ภาพรวม', icon: LayoutDashboard, route: '/admin/dashboard' },
        { label: 'ห้องชุด', icon: Building, route: '/admin/units' },
        { label: 'ตรวจสลิป', icon: CreditCard, route: '/admin/payments', badge: pendingPaymentsCount },
        { label: 'แจ้งซ่อม', icon: Wrench, route: '/admin/repairs', badge: pendingRepairsCount },
      ]
    : activeRole === 'tenant'
    ? [
        { label: 'ภาพรวม', icon: LayoutDashboard, route: '/dashboard' },
        { label: 'จ่ายเงิน', icon: CreditCard, route: '/payments' },
        { label: 'แจ้งซ่อม', icon: Wrench, route: '/maintenance' },
        { label: 'พัสดุ', icon: Package, route: '/parcels' },
      ]
    : activeRole === 'owner'
    ? [
        { label: 'ภาพรวม', icon: LayoutDashboard, route: '/dashboard' },
        { label: 'ห้องชุด', icon: Building, route: '/owner/units' },
        { label: 'ค่าส่วนกลาง', icon: CreditCard, route: '/owner/expenses' },
        { label: 'แจ้งซ่อม', icon: Wrench, route: '/maintenance' },
      ]
    : [
        { label: 'ภาพรวม', icon: LayoutDashboard, route: '/dashboard' },
        { label: 'ค้นหาห้อง', icon: Building, route: '/units' },
        { label: 'แจ้งเรื่อง', icon: Wrench, route: '/maintenance' },
        { label: 'ประกาศ', icon: Megaphone, route: '/announcements' },
      ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg no-print">
        {bottomItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;
          return (
            <button
              key={idx}
              onClick={() => handleNav(item.route)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative',
                isActive ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">เมนูอื่น</span>
        </button>
      </div>

      {/* Slide-over Drawer */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl p-4 flex flex-col overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <span className="font-heading font-bold text-slate-800 dark:text-white">
                เมนู CondoFlow
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 flex-1 text-sm font-medium">
              <button
                onClick={() => handleNav('/team')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800"
              >
                <Users className="w-4 h-4 text-purple-600" />
                <span>ทีมผู้พัฒนา (Developer Team 6 คน)</span>
              </button>

              <button
                onClick={() => handleNav('/admin/system-coverage')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>System Coverage (25 FR)</span>
              </button>

              {activeRole === 'admin' ? (
                <>
                  <button onClick={() => handleNav('/admin/dashboard')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <LayoutDashboard className="w-4 h-4 text-slate-400" /> แดชบอร์ดผู้ดูแล
                  </button>
                  <button onClick={() => handleNav('/admin/units')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Building className="w-4 h-4 text-slate-400" /> จัดการห้องชุด
                  </button>
                  <button onClick={() => handleNav('/admin/owners-tenants')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Users className="w-4 h-4 text-slate-400" /> เจ้าของห้อง & ผู้เช่า
                  </button>
                  <button onClick={() => handleNav('/admin/contracts')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <FileText className="w-4 h-4 text-slate-400" /> สัญญาเช่า
                  </button>
                  <button onClick={() => handleNav('/admin/invoices')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <CreditCard className="w-4 h-4 text-slate-400" /> ใบแจ้งหนี้
                  </button>
                  <button onClick={() => handleNav('/admin/payments')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <CreditCard className="w-4 h-4 text-slate-400" /> ตรวจสอบชำระเงิน
                  </button>
                  <button onClick={() => handleNav('/admin/repairs')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Wrench className="w-4 h-4 text-slate-400" /> คำร้องแจ้งซ่อม
                  </button>
                  <button onClick={() => handleNav('/admin/parcels')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Package className="w-4 h-4 text-slate-400" /> จัดการพัสดุ
                  </button>
                  <button onClick={() => handleNav('/admin/announcements')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Megaphone className="w-4 h-4 text-slate-400" /> ประกาศโครงการ
                  </button>
                  <button onClick={() => handleNav('/admin/reports')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <BarChart3 className="w-4 h-4 text-slate-400" /> รายงานสรุป
                  </button>
                  <button onClick={() => handleNav('/admin/roles')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Shield className="w-4 h-4 text-slate-400" /> บทบาทและสิทธิ์
                  </button>
                  <button onClick={() => handleNav('/admin/audit-log')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <History className="w-4 h-4 text-slate-400" /> Audit Log
                  </button>
                  <button onClick={() => handleNav('/admin/settings')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Settings className="w-4 h-4 text-slate-400" /> ตั้งค่าระบบ
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleNav('/announcements')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Megaphone className="w-4 h-4 text-slate-400" /> ประกาศคอนโด
                  </button>
                  <button onClick={() => handleNav('/history')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <History className="w-4 h-4 text-slate-400" /> ประวัติทำรายการ
                  </button>
                  <button onClick={() => handleNav('/profile')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Users className="w-4 h-4 text-slate-400" /> ข้อมูลส่วนตัว
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
