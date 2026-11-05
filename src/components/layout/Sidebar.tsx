import React from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Wrench,
  Package,
  Megaphone,
  BarChart3,
  Shield,
  History,
  Settings,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { activeRole, currentRoute, navigateTo, payments, repairs, parcels, invoices, currentUser } = useApp();

  // Badges calculation
  const pendingPaymentsCount = payments.filter(p => p.status === 'pending_verification').length;
  const pendingRepairsCount = repairs.filter(r => r.status === 'submitted' || r.status === 'in_progress').length;
  
  // For tenant:
  const tenantPendingParcels = parcels.filter(
    p => p.recipientId === currentUser?.id && p.status === 'pending_pickup'
  ).length;
  const tenantPendingInvoices = invoices.filter(
    i => (i.recipientId === currentUser?.id || i.unitNumber === currentUser?.unitNumber) &&
         (i.status === 'pending' || i.status === 'due_soon' || i.status === 'overdue')
  ).length;

  const getMenuItems = () => {
    switch (activeRole) {
      case 'admin':
        return [
          { group: 'ภาพรวมระบบ', items: [
            { label: 'แดชบอร์ดผู้ดูแล', icon: LayoutDashboard, route: '/admin/dashboard' },
            { label: 'System Coverage 25 FR', icon: CheckCircle, route: '/admin/system-coverage', highlight: true },
          ]},
          { group: 'จัดการอสังหาฯ และบุคคล', items: [
            { label: 'จัดการห้องชุด', icon: Building, route: '/admin/units' },
            { label: 'เจ้าของห้องและผู้เช่า', icon: Users, route: '/admin/owners-tenants' },
            { label: 'สัญญาเช่า', icon: FileText, route: '/admin/contracts' },
          ]},
          { group: 'การเงินและบริการ', items: [
            { label: 'ใบแจ้งหนี้', icon: Receipt, route: '/admin/invoices' },
            { label: 'ตรวจสอบชำระเงิน', icon: CreditCard, route: '/admin/payments', badge: pendingPaymentsCount, badgeColor: 'bg-amber-500' },
            { label: 'จัดการคำร้องแจ้งซ่อม', icon: Wrench, route: '/admin/repairs', badge: pendingRepairsCount, badgeColor: 'bg-brand-500' },
            { label: 'จัดการพัสดุ', icon: Package, route: '/admin/parcels' },
            { label: 'ประกาศโครงการ', icon: Megaphone, route: '/admin/announcements' },
          ]},
          { group: 'วิเคราะห์และควบคุม', items: [
            { label: 'รายงานสรุป', icon: BarChart3, route: '/admin/reports' },
            { label: 'บทบาทและสิทธิ์', icon: Shield, route: '/admin/roles' },
            { label: 'Audit Log', icon: History, route: '/admin/audit-log' },
            { label: 'ตั้งค่าระบบ', icon: Settings, route: '/admin/settings' },
            { label: 'ทีมผู้พัฒนา (Developer Team)', icon: Users, route: '/team', highlight: true },
          ]},
        ];

      case 'tenant':
        return [
          { group: 'หลัก', items: [
            { label: 'แดชบอร์ดผู้เช่า', icon: LayoutDashboard, route: '/dashboard' },
            { label: 'ห้องชุดที่เช่า (A-1205)', icon: Home, route: `/units/${currentUser?.unitId || 'unit-a-1205'}` },
            { label: 'สัญญาเช่าของฉัน', icon: FileText, route: '/contracts' },
          ]},
          { group: 'บริการและค่าใช้จ่าย', items: [
            { label: 'ใบแจ้งหนี้ & แจ้งชำระเงิน', icon: Receipt, route: '/payments', badge: tenantPendingInvoices, badgeColor: 'bg-rose-500' },
            { label: 'แจ้งซ่อมห้องชุด', icon: Wrench, route: '/maintenance' },
            { label: 'พัสดุของฉัน', icon: Package, route: '/parcels', badge: tenantPendingParcels, badgeColor: 'bg-amber-500' },
            { label: 'ประกาศคอนโด', icon: Megaphone, route: '/announcements' },
            { label: 'ประวัติการทำรายการ', icon: Clock, route: '/history' },
            { label: 'ทีมผู้พัฒนา (Developer Team)', icon: Users, route: '/team', highlight: true },
          ]},
        ];

      case 'owner':
        return [
          { group: 'หลัก', items: [
            { label: 'แดชบอร์ดเจ้าของห้อง', icon: LayoutDashboard, route: '/dashboard' },
            { label: 'ห้องที่เป็นเจ้าของ (2 ห้อง)', icon: Building, route: '/owner/units' },
            { label: 'สัญญาเช่าที่เกี่ยวข้อง', icon: FileText, route: '/owner/contracts' },
          ]},
          { group: 'การเงินและทรัพย์สิน', items: [
            { label: 'ค่าส่วนกลางและรายรับ', icon: Receipt, route: '/owner/expenses' },
            { label: 'ติดตามการแจ้งซ่อม', icon: Wrench, route: '/maintenance' },
            { label: 'ประกาศคอนโด', icon: Megaphone, route: '/announcements' },
            { label: 'ประวัติการทำรายการ', icon: Clock, route: '/history' },
            { label: 'ทีมผู้พัฒนา (Developer Team)', icon: Users, route: '/team', highlight: true },
          ]},
        ];

      case 'user':
      default:
        return [
          { group: 'บริการทั่วไป', items: [
            { label: 'แดชบอร์ดผู้ใช้', icon: LayoutDashboard, route: '/dashboard' },
            { label: 'ค้นหาห้องชุดว่าง', icon: Building, route: '/units' },
            { label: 'แจ้งเรื่อง / ซ่อมส่วนกลาง', icon: Wrench, route: '/maintenance' },
            { label: 'ประกาศสาธารณะ', icon: Megaphone, route: '/announcements' },
            { label: 'ประวัติคำร้องของฉัน', icon: Clock, route: '/history' },
            { label: 'ทีมผู้พัฒนา (Developer Team)', icon: Users, route: '/team', highlight: true },
          ]},
        ];
    }
  };

  const menuGroups = getMenuItems();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 select-none z-20 shrink-0 sticky top-[101px] h-[calc(100vh-101px)] overflow-hidden',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Menu List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 font-heading">
                {group.group}
              </h4>
            )}
            {group.items.map((item: any, iIdx: number) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route || (item.route !== '/dashboard' && item.route !== '/admin/dashboard' && currentRoute.startsWith(item.route));
              return (
                <button
                  key={iIdx}
                  onClick={() => navigateTo(item.route)}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative',
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 font-semibold'
                      : item.highlight
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform group-hover:scale-110',
                      isActive ? 'text-white' : item.highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    )}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold text-white',
                        item.badgeColor || 'bg-brand-500',
                        isCollapsed && 'absolute top-1.5 right-1.5 px-1 py-0 min-w-4 text-center'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        {!isCollapsed && (
          <div className="text-[11px] text-slate-400 font-medium truncate">
            CondoFlow v1.0 • Modern SaaS
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors mx-auto"
          title={isCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
