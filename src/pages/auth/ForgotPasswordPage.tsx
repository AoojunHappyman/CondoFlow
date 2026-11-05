import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { delay } from '../../lib/utils';

export const ForgotPasswordPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await delay(500);
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <button
          onClick={() => navigateTo('/login')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าเข้าสู่ระบบ</span>
        </button>

        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl sm:px-10">
          {!isSent ? (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 mx-auto flex items-center justify-center mb-3">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                  ลืมรหัสผ่าน
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  กรอกอีเมลที่ลงทะเบียนไว้กับระบบ CondoFlow เพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    อีเมลที่ลงทะเบียน
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="เช่น sombat.prasert@email.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  ส่งคำขอเปลี่ยนรหัสผ่าน
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                ส่งลิงก์เปลี่ยนรหัสผ่านแล้ว
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                ระบบได้ส่งคำแนะนำการตั้งรหัสผ่านใหม่ไปยัง <strong>{email}</strong> เรียบร้อยแล้ว (จำลองการทำงานโดยไม่ต้องตรวจสอบอีเมลจริง)
              </p>
              <button
                onClick={() => navigateTo('/login')}
                className="w-full py-2.5 rounded-xl font-semibold bg-brand-600 hover:bg-brand-700 text-white text-xs shadow transition-all mt-4"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
