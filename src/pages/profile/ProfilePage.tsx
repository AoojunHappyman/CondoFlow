import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Edit2,
  Save,
  X,
  Camera,
  Lock,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { maskIdCard, maskPhone, formatThaiDate } from '../../lib/utils';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUserProfile, addToast, activeRole, logout } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    avatar: currentUser?.avatar || '',
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleStartEdit = () => {
    setFormData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      avatar: currentUser?.avatar || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    await updateCurrentUserProfile(formData);
    setIsSaving(false);
    setIsConfirmOpen(false);
    setIsEditing(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('error', 'รหัสผ่านไม่ตรงกัน', 'กรุณากรอกรหัสผ่านใหม่และการยืนยันให้ตรงกัน');
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    addToast('success', 'เปลี่ยนรหัสผ่านสำเร็จ', 'คุณสามารถใช้รหัสผ่านใหม่ในการเข้าสู่ระบบครั้งถัดไป');
  };

  // Avatar presets for quick toggle
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            ข้อมูลส่วนตัว (User Profile)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการข้อมูลบัญชีผู้ใช้งาน ความปลอดภัย และการตั้งค่าส่วนบุคคล
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleStartEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>แก้ไขข้อมูลส่วนตัว</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancelEdit}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>บันทึกการเปลี่ยนแปลง</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-8">
        {/* Avatar & Basic Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative group">
            <img
              src={formData.avatar || currentUser?.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-brand-500/20 shadow-md"
            />
            {isEditing && (
              <div className="mt-2 flex gap-1 justify-center">
                {avatarPresets.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: av })}
                    className="w-5 h-5 rounded-full overflow-hidden border border-slate-300 hover:scale-110 transition-transform"
                  >
                    <img src={av} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                {currentUser?.firstName} {currentUser?.lastName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {activeRole}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
                สถานะ: ใช้งานปกติ (Active)
              </span>
            </div>

            <p className="text-xs text-slate-500">
              ชื่อผู้ใช้งานระบบ: <strong className="text-slate-700 dark:text-slate-300 font-mono">@{currentUser?.username}</strong>
              {currentUser?.unitNumber && (
                <span className="ml-3">ห้องชุด: <strong>{currentUser.unitNumber}</strong></span>
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                สมัครเมื่อ: {formatThaiDate(currentUser?.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                เข้าสู่ระบบล่าสุด: {formatThaiDate(currentUser?.lastLoginAt, { includeTime: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Form Details */}
        <div className="space-y-6">
          <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-brand-600" />
            ข้อมูลส่วนบุคคลและการติดต่อ
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* First Name */}
            <div>
              <label className="block text-slate-500 font-medium mb-1.5">ชื่อจริง</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
                />
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium">
                  {currentUser?.firstName}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-slate-500 font-medium mb-1.5">นามสกุล</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
                />
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium">
                  {currentUser?.lastName}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-500 font-medium mb-1.5">อีเมล (Email)</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
                />
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser?.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-500 font-medium mb-1.5">เบอร์โทรศัพท์ติดต่อ</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
                />
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{maskPhone(currentUser?.phone || '')}</span>
                </div>
              )}
            </div>

            {/* ID Card (Masked) */}
            <div>
              <label className="block text-slate-500 font-medium mb-1.5">
                เลขประจำตัวประชาชน (คุ้มครองข้อมูลส่วนบุคคล PDPA)
              </label>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>{maskIdCard(currentUser?.idCard || '1-1002-00345-67-8')}</span>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-slate-500 font-medium mb-1.5">ที่อยู่สำหรับติดต่อ / เอกสาร</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
                />
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{currentUser?.address || 'กรุงเทพมหานคร'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security & Password Action */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600" />
            ความปลอดภัยของบัญชี (Security Settings)
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                รหัสผ่านบัญชีผู้ใช้
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                แนะนำให้เปลี่ยนรหัสผ่านเป็นประจำทุก 90 วัน เพื่อความปลอดภัย
              </p>
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
            >
              เปลี่ยนรหัสผ่าน
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                ออกจากระบบทุกอุปกรณ์ (Logout All Devices)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                ตัดการเชื่อมต่อจากเบราว์เซอร์หรืออุปกรณ์อื่นที่เคยเข้าสู่ระบบค้างไว้
              </p>
            </div>
            <button
              onClick={() => {
                addToast('info', 'ออกจากระบบทุกอุปกรณ์เรียบร้อยแล้ว');
                logout();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 transition-colors"
            >
              ออกจากระบบทั้งหมด
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog on Save */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="ยืนยันการบันทึกข้อมูลส่วนตัว"
        message="ท่านต้องการบันทึกการแก้ไขข้อมูลส่วนบุคคลลงสู่ระบบใช่หรือไม่?"
        confirmLabel="ยืนยันบันทึก"
        variant="info"
        isLoading={isSaving}
      />

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="เปลี่ยนรหัสผ่านใหม่"
        description="กรุณากรอกรหัสผ่านเดิมและรหัสผ่านใหม่ที่ต้องการเปลี่ยน"
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleChangePassword}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow"
            >
              บันทึกรหัสผ่านใหม่
            </button>
          </>
        }
      >
        <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">รหัสผ่านปัจจุบัน</label>
            <input
              type="password"
              required
              value={passwordForm.oldPassword}
              onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">รหัสผ่านใหม่</label>
            <input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              required
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
