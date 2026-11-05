import React from 'react';
import { FileQuestion, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Error404: React.FC = () => {
  const { navigateTo, activeRole } = useApp();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
          404 ไม่พบหน้าที่ต้องการ
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบออกไปแล้ว หรือกรอก URL ไม่ถูกต้อง
        </p>
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => navigateTo(activeRole === 'admin' ? '/admin/dashboard' : '/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all"
          >
            <Home className="w-4 h-4" />
            <span>กลับหน้าหลัก</span>
          </button>
        </div>
      </div>
    </div>
  );
};
