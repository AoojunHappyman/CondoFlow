import React, { useState } from 'react';
import { AlertOctagon, RotateCw, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { delay } from '../../lib/utils';

export const Error500: React.FC = () => {
  const { navigateTo, activeRole, addToast } = useApp();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await delay(700);
    setIsRetrying(false);
    addToast('success', 'เชื่อมต่อระบบสำเร็จ', 'ระบบกู้คืนการทำงานเป็นปกติแล้ว');
    navigateTo(activeRole === 'admin' ? '/admin/dashboard' : '/dashboard');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
          500 เกิดข้อผิดพลาดในระบบ
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          ระบบเซิร์ฟเวอร์ขัดข้องชั่วคราว ข้อมูลของคุณยังคงปลอดภัย กรุณาลองใหม่อีกครั้ง
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>ลองใหม่อีกครั้ง (Retry)</span>
          </button>
          <button
            onClick={() => navigateTo(activeRole === 'admin' ? '/admin/dashboard' : '/dashboard')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>กลับหน้าหลัก</span>
          </button>
        </div>
      </div>
    </div>
  );
};
