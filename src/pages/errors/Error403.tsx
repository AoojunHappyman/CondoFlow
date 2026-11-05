import React from 'react';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Error403: React.FC = () => {
  const { navigateTo, activeRole } = useApp();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <ShieldX className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
          403 ไม่มีสิทธิ์เข้าถึงข้อมูล
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          บทบาทปัจจุบันของคุณ (<strong>{activeRole.toUpperCase()}</strong>) ไม่ได้รับอนุญาตให้เปิดดูหรือแก้ไขหน้านี้ตามนโยบาย Role-Based Access Control (RBAC)
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => navigateTo(activeRole === 'admin' ? '/admin/dashboard' : '/dashboard')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all"
          >
            <Home className="w-4 h-4" />
            <span>กลับหน้า Dashboard ของฉัน</span>
          </button>
        </div>
      </div>
    </div>
  );
};
