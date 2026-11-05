import React from 'react';
import { ShieldCheck, Home, KeyRound, User as UserIcon, CheckSquare, Sparkles, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { cn } from '../../lib/utils';

export const DemoRoleBar: React.FC = () => {
  const { activeRole, switchDemoRole, navigateTo } = useApp();

  const roles: { role: UserRole; label: string; icon: any; desc: string; color: string }[] = [
    {
      role: 'admin',
      label: 'ผู้ดูแลระบบ (Admin)',
      icon: ShieldCheck,
      desc: 'เข้าถึงทุกฟังก์ชัน 25 FR',
      color: 'hover:bg-purple-50 text-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/40 border-purple-200 dark:border-purple-800',
    },
    {
      role: 'owner',
      label: 'เจ้าของห้อง (Owner)',
      icon: Home,
      desc: 'ห้อง A-1205 & B-0808',
      color: 'hover:bg-emerald-50 text-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    },
    {
      role: 'tenant',
      label: 'ผู้เช่า (Tenant)',
      icon: KeyRound,
      desc: 'ห้อง A-1205 (สมบัติ)',
      color: 'hover:bg-sky-50 text-sky-700 dark:text-sky-300 dark:hover:bg-sky-950/40 border-sky-200 dark:border-sky-800',
    },
    {
      role: 'user',
      label: 'ผู้ใช้งานทั่วไป (User)',
      icon: UserIcon,
      desc: 'ค้นหาห้อง & สมัครใหม่',
      color: 'hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2 border-b border-indigo-900/40 text-xs shadow-md z-40 sticky top-0 no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-semibold text-amber-300 bg-amber-950/80 border border-amber-800/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Demo Mode Switcher
          </span>
          <span className="text-slate-300 hidden md:inline text-[11px]">
            เครื่องมือสลับบทบาทสำหรับทดลองใช้งาน Prototype (คลิกเพื่อเปลี่ยนมุมมองได้ทันที)
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = activeRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchDemoRole(r.role)}
                title={r.desc}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all border',
                  isActive
                    ? 'bg-white text-slate-900 shadow font-semibold border-white scale-105'
                    : 'bg-white/10 text-white/90 border-white/10 hover:bg-white/20'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-indigo-600' : 'text-slate-300')} />
                <span>{r.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => navigateTo('/admin/system-coverage')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-sm transition-all ml-1"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>ตรวจ 25 FR Coverage</span>
          </button>

          <button
            onClick={() => navigateTo('/team')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/40 shadow-sm transition-all"
          >
            <Users className="w-3.5 h-3.5" />
            <span>ทีมผู้พัฒนา (6 ท่าน)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
