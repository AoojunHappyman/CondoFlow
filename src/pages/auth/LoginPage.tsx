import React, { useState } from 'react';
import { Building2, Eye, EyeOff, Lock, User, ShieldCheck, KeyRound, Home, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, navigateTo, switchDemoRole } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim() || !password.trim()) {
      setErrorMsg('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
      return;
    }

    setIsLoading(true);
    const result = await login(username);
    setIsLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    switchDemoRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background graphic elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/25">
            <Building2 className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
          เข้าสู่ระบบ CondoFlow
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          ระบบบริหารจัดการห้องชุดและผู้เช่าในคอนโดมิเนียม
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl sm:px-10">
          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ชื่อผู้ใช้หรืออีเมล (Username / Email)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="เช่น admin, tenant, owner, user"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span className="text-slate-600 dark:text-slate-400">จดจำการเข้าสู่ระบบ</span>
              </label>

              <button
                type="button"
                onClick={() => navigateTo('/forgot-password')}
                className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              เข้าสู่ระบบ
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              ⚡ เข้าสู่ระบบด้วยบัญชีทดลอง (Demo Accounts)
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ผู้ดูแลระบบ</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">admin / Admin@123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('tenant')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-semibold text-sky-700 dark:text-sky-400">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>ผู้เช่า (A-1205)</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">tenant / Tenant@123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('owner')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                  <Home className="w-3.5 h-3.5" />
                  <span>เจ้าของห้อง (2 ห้อง)</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">owner / Owner@123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <User className="w-3.5 h-3.5" />
                  <span>ผู้ใช้งานทั่วไป</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">user / User@123</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            ยังไม่มีบัญชีผู้ใช้งาน?{' '}
            <button
              onClick={() => navigateTo('/register')}
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              สมัครสมาชิกใหม่
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
