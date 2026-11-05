import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Check,
  Copy,
  Save,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SystemModule, PermissionAction, RoleDefinition } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const RolesPage: React.FC = () => {
  const { roles, updateRolePermissions, addToast } = useApp();

  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-admin');
  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  // Working copy of permissions for active editing
  const [workingPermissions, setWorkingPermissions] = useState<RoleDefinition['permissions']>(
    selectedRole.permissions
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync when selecting a different role
  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    const target = roles.find(r => r.id === roleId);
    if (target) {
      setWorkingPermissions(target.permissions);
    }
  };

  const modules: { key: SystemModule; label: string; desc: string }[] = [
    { key: 'units', label: 'ห้องชุด (Units)', desc: 'จัดการข้อมูลกายภาพห้องชุด ราคาเช่า ค่าส่วนกลาง' },
    { key: 'owners', label: 'เจ้าของห้อง (Owners)', desc: 'ข้อมูลเจ้าของร่วมและการถือครองกรรมสิทธิ์' },
    { key: 'tenants', label: 'ผู้เช่า (Tenants)', desc: 'ข้อมูลผู้เช่าและสถานะการเข้าพักอาศัย' },
    { key: 'contracts', label: 'สัญญาเช่า (Contracts)', desc: 'จัดทำสัญญา ต่ออายุ และยกเลิกสัญญาเช่า' },
    { key: 'invoices', label: 'ใบแจ้งหนี้ (Invoices)', desc: 'ออกใบเรียกเก็บเงินค่าเช่าและค่าส่วนกลาง' },
    { key: 'payments', label: 'การชำระเงิน (Payments)', desc: 'ตรวจสอบสลิปและอนุมัติการรับเงิน' },
    { key: 'repairs', label: 'งานแจ้งซ่อม (Repairs)', desc: 'รับคำร้อง มอบหมายช่าง และปิดงานซ่อม' },
    { key: 'parcels', label: 'ระบบพัสดุ (Parcels)', desc: 'บันทึกพัสดุเข้า ออกรหัส และส่งมอบ' },
    { key: 'announcements', label: 'ประกาศ (Announcements)', desc: 'เผยแพร่ข่าวสารและแจ้งเตือนผู้พักอาศัย' },
    { key: 'reports', label: 'รายงานสรุป (Reports)', desc: 'วิเคราะห์รายรับ อัตราการเข้าพัก และสถิติ' },
    { key: 'users', label: 'ผู้ใช้งาน (Users)', desc: 'จัดการบัญชีผู้ใช้ สิทธิ์ และการระงับบัญชี' },
    { key: 'audit_log', label: 'Audit Log', desc: 'ตรวจสอบบันทึกกิจกรรมย้อนหลังของระบบ' },
  ];

  const actions: { key: PermissionAction; label: string }[] = [
    { key: 'view', label: 'ดูข้อมูล (View)' },
    { key: 'create', label: 'สร้างใหม่ (Create)' },
    { key: 'edit', label: 'แก้ไข (Edit)' },
    { key: 'delete', label: 'ลบข้อมูล (Delete)' },
    { key: 'approve', label: 'อนุมัติ (Approve)' },
    { key: 'export', label: 'ส่งออก (Export)' },
  ];

  const togglePermission = (mod: SystemModule, action: PermissionAction) => {
    setWorkingPermissions(prev => {
      const currentActions = prev[mod] || [];
      const hasAction = currentActions.includes(action);
      const newActions = hasAction
        ? currentActions.filter(a => a !== action)
        : [...currentActions, action];

      return {
        ...prev,
        [mod]: newActions,
      };
    });
  };

  const handleSaveSubmit = async () => {
    setIsSaving(true);
    await updateRolePermissions(selectedRoleId, workingPermissions);
    setIsSaving(false);
    setIsConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-brand-600" />
            กำหนดบทบาทและสิทธิ์การเข้าถึง (Role & Permission Matrix)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ควบคุมสิทธิ์ตามโมดูลอย่างละเอียด (RBAC: View, Create, Edit, Delete, Approve, Export)
          </p>
        </div>

        <button
          onClick={() => setIsConfirmOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>บันทึกการเปลี่ยนแปลงสิทธิ์</span>
        </button>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {roles.map(r => {
          const isSelected = r.id === selectedRoleId;
          return (
            <div
              key={r.id}
              onClick={() => handleSelectRole(r.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 shadow-xs ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{r.name}</span>
                {isSelected && <Check className="w-4 h-4 text-brand-600" />}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{r.description}</p>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>ผู้ใช้งานในระบบ: {r.userCount} คน</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white">
              เมทริกซ์สิทธิ์สำหรับ: <span className="text-brand-600">{selectedRole.name}</span>
            </h3>
            <p className="text-xs text-slate-500">ติ๊กเลือกสิทธิ์ในแต่ละโมดูลเพื่อควบคุมทั้งการแสดงเมนูและการทำรายการ</p>
          </div>

          <div className="text-xs text-slate-400">
            {selectedRole.isSystem && (
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                System Role
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                <th className="py-3 px-4 w-1/3">โมดูลระบบ (System Module)</th>
                {actions.map(act => (
                  <th key={act.key} className="py-3 px-3 text-center">
                    {act.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {modules.map(mod => {
                const currentActions = workingPermissions[mod.key] || [];
                return (
                  <tr key={mod.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{mod.label}</div>
                      <div className="text-[11px] text-slate-400">{mod.desc}</div>
                    </td>

                    {actions.map(act => {
                      const isChecked = currentActions.includes(act.key);
                      return (
                        <td key={act.key} className="py-3 px-3 text-center">
                          <label className="inline-flex items-center justify-center cursor-pointer p-1">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePermission(mod.key, act.key)}
                              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                            />
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog on Save */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSaveSubmit}
        title={`บันทึกการกำหนดสิทธิ์: ${selectedRole.name}`}
        message={
          <div className="space-y-2 text-xs">
            <p>
              ท่านกำลังจะปรับปรุง Permission Matrix สำหรับบทบาท <strong>{selectedRole.name}</strong>
            </p>
            <p className="text-slate-500">
              การเปลี่ยนแปลงนี้จะมีผลต่อการแสดงผลเมนู การเปิด URL โดยตรง และสิทธิ์การกดทำรายการของสมาชิกในบทบาทนี้ทันที และระบบจะบันทึกการปรับปรุงนี้ลง Audit Log
            </p>
          </div>
        }
        confirmLabel="ยืนยันการบันทึก"
        variant="info"
        isLoading={isSaving}
      />
    </div>
  );
};
