import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

export const SessionTimeoutModal: React.FC = () => {
  const { isSessionTimeoutWarning, setSessionTimeoutWarning, logout, addToast } = useApp();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: any;
    if (isSessionTimeoutWarning) {
      setCountdown(60);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSessionTimeoutWarning(false);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSessionTimeoutWarning, logout, setSessionTimeoutWarning]);

  if (!isSessionTimeoutWarning) return null;

  const handleExtend = () => {
    setSessionTimeoutWarning(false);
    addToast('success', 'ต่ออายุ Session เรียบร้อยแล้ว', 'คุณสามารถใช้งานระบบได้อย่างต่อเนื่อง');
  };

  return (
    <Modal
      isOpen={isSessionTimeoutWarning}
      onClose={() => {}}
      title="เซสชันใกล้หมดอายุ (Session Timeout Warning)"
      maxWidth="md"
      footer={
        <>
          <button
            onClick={() => {
              setSessionTimeoutWarning(false);
              logout();
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ออกจากระบบ
          </button>
          <button
            onClick={handleExtend}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all focus:ring-2 focus:ring-brand-500"
          >
            ขยายเวลาการใช้งาน
          </button>
        </>
      }
    >
      <div className="flex gap-4 items-start py-2">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            ไม่มีการทำรายการใดๆ เป็นเวลาสักครู่ เพื่อความปลอดภัยของข้อมูล ระบบจะออกจากระบบโดยอัตโนมัติภายใน:
          </p>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 font-mono text-center py-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
            00:{String(countdown).padStart(2, '0')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            คลิก "ขยายเวลาการใช้งาน" เพื่อทำงานต่อโดยไม่ต้องล็อกอินใหม่
          </p>
        </div>
      </div>
    </Modal>
  );
};
