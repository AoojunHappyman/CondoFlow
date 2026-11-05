import React, { useState, useMemo } from 'react';
import { Building2, Check, X, Shield, Lock, User, Mail, Phone, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { checkPasswordStrength } from '../../lib/utils';
import { Modal } from '../../components/common/Modal';

export const RegisterPage: React.FC = () => {
  const { registerUser, navigateTo } = useApp();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    idCard: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Real-time password evaluation
  const pwdValidation = useMemo(() => {
    return checkPasswordStrength(formData.password);
  }, [formData.password]);

  const isPasswordMatch = formData.password && formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.acceptTerms) {
      setErrorMsg('กรุณายอมรับนโยบายความเป็นส่วนตัวและเงื่อนไขการใช้บริการ');
      return;
    }

    if (pwdValidation.score < 3) {
      setErrorMsg('รหัสผ่านยังไม่ผ่านเกณฑ์ความปลอดภัยขั้นต่ำ (ต้องมีตัวพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ)');
      return;
    }

    if (!isPasswordMatch) {
      setErrorMsg('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setIsLoading(true);
    const result = await registerUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      idCard: formData.idCard,
      password: formData.password,
    });
    setIsLoading(false);

    if (result.success) {
      setIsSuccessModalOpen(true);
    } else {
      setErrorMsg(result.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl z-10 px-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateTo('/login')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าเข้าสู่ระบบ</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>บทบาทเริ่มต้น: ผู้ใช้งานทั่วไป (User)</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl sm:px-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              สมัครสมาชิก CondoFlow
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              สร้างบัญชีใหม่เพื่อเข้าถึงบริการห้องชุด ประกาศ และส่งคำร้องออนไลน์
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อจริง <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="เช่น นภัสสร"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  นามสกุล <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="เช่น เพชรรัตน์"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อผู้ใช้ (Username) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    placeholder="เช่น user_napasorn"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  อีเมล (Email) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Phone & ID Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="081-xxx-xxxx"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  เลขประจำตัวประชาชน (13 หลัก) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.idCard}
                    onChange={e => setFormData({ ...formData, idCard: e.target.value })}
                    placeholder="1-xxxx-xxxxx-xx-x"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  รหัสผ่าน (Password) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="กรอกรหัสผ่าน"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ยืนยันรหัสผ่าน <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Meter & Real-time Checklist */}
            {formData.password && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">ระดับความแข็งแรงของรหัสผ่าน:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {pwdValidation.strengthLabel}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 transition-all ${pwdValidation.score >= 1 ? pwdValidation.color : 'bg-transparent'}`} />
                  <div className={`h-full flex-1 transition-all ${pwdValidation.score >= 2 ? pwdValidation.color : 'bg-transparent'}`} />
                  <div className={`h-full flex-1 transition-all ${pwdValidation.score >= 3 ? pwdValidation.color : 'bg-transparent'}`} />
                  <div className={`h-full flex-1 transition-all ${pwdValidation.score >= 4 ? pwdValidation.color : 'bg-transparent'}`} />
                </div>

                {/* Checklist */}
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    {pwdValidation.hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span>ความยาวอย่างน้อย 8 ตัวอักษร</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {pwdValidation.hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span>มีตัวพิมพ์ใหญ่ (A-Z)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {pwdValidation.hasLower ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span>มีตัวพิมพ์เล็ก (a-z)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {pwdValidation.hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span>มีตัวเลข (0-9)</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    {pwdValidation.hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span>มีอักขระพิเศษ (!@#$%^&*...)</span>
                  </div>
                </div>

                {formData.confirmPassword && (
                  <div className="text-[11px] pt-1 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                    {isPasswordMatch ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                        <Check className="w-3.5 h-3.5" /> รหัสผ่านตรงกันสมบูรณ์
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> รหัสผ่านไม่ตรงกัน
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Privacy Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.acceptTerms}
                  onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 mt-0.5"
                />
                <span>
                  ข้าพเจ้ายินยอมและยอมรับ{' '}
                  <span className="text-brand-600 dark:text-brand-400 underline">
                    นโยบายความเป็นส่วนตัว (PDPA)
                  </span>{' '}
                  และข้อกำหนดการใช้งานระบบนิติบุคคลคอนโดมิเนียม
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-2.5 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              ยืนยันการสมัครสมาชิก
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => navigateTo('/login')}
        title="สมัครสมาชิกสำเร็จ!"
        maxWidth="md"
        footer={
          <button
            onClick={() => navigateTo('/login')}
            className="w-full py-2.5 rounded-xl font-semibold bg-brand-600 hover:bg-brand-700 text-white text-xs shadow transition-all"
          >
            ไปยังหน้าเข้าสู่ระบบทันที
          </button>
        }
      >
        <div className="text-center py-4 space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            ยินดีต้อนรับคุณ {formData.firstName} {formData.lastName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            บัญชีของคุณได้รับการสร้างเรียบร้อยแล้วด้วยบทบาทเริ่มต้น "ผู้ใช้งานทั่วไป" ท่านสามารถเข้าสู่ระบบเพื่อใช้งานได้ทันที
          </p>
        </div>
      </Modal>
    </div>
  );
};
