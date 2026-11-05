import React from 'react';
import { Wrench, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MaintenancePage: React.FC = () => {
  const { setMaintenanceMode, addToast } = useApp();

  const handleDisableMaintenance = () => {
    setMaintenanceMode(false);
    addToast('info', 'ปิดโหมดปรับปรุงระบบแล้ว (Maintenance Mode Disabled)');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6 text-center">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
          <Wrench className="w-10 h-10 animate-bounce" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>ระบบอยู่ระหว่างการปรับปรุงประจำเดือน</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
          CondoFlow Maintenance Mode
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          ระบบกำลังทำการอัปเกรดฐานข้อมูลและสำรองข้อมูลประจำงวด เพื่อเพิ่มประสิทธิภาพและความปลอดภัยสูงสุด คาดว่าจะแล้วเสร็จเวลา 04:00 น.
        </p>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">⚡ สำหรับผู้ตรวจประเมิน Prototype:</p>
          <p>ท่านสามารถคลิกปุ่มด้านล่างเพื่อปิดโหมด Maintenance และกลับเข้าใช้งานระบบได้ทันที</p>
        </div>

        <button
          onClick={handleDisableMaintenance}
          className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-all"
        >
          ปิด Maintenance Mode (กลับเข้าสู่ระบบทดลอง)
        </button>
      </div>
    </div>
  );
};
