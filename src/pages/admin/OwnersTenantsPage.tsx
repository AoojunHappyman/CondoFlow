import React, { useState } from 'react';
import {
  Users,
  Home,
  UserCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  Phone,
  Mail,
  CheckCircle,
  Ban,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Owner, Tenant, User, TenantStatus } from '../../types';
import { maskIdCard, maskPhone, formatThaiDate } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const OwnersTenantsPage: React.FC = () => {
  const {
    owners,
    tenants,
    users,
    addOwner,
    updateOwner,
    deleteOwner,
    addTenant,
    updateTenant,
    deleteTenant,
    changeTenantStatus,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'owners' | 'tenants' | 'users'>('owners');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddOwnerModalOpen, setIsAddOwnerModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // Change Tenant Status Flow
  const [tenantStatusTarget, setTenantStatusTarget] = useState<Tenant | null>(null);
  const [newStatus, setNewStatus] = useState<TenantStatus>('renting');
  const [statusReason, setStatusReason] = useState('');

  // Delete Confirm
  const [itemToDelete, setItemToDelete] = useState<{ type: 'owner' | 'tenant'; item: any } | null>(null);

  // Forms
  const [ownerForm, setOwnerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idCard: '',
    address: '',
    ownedUnitIds: [] as string[],
    status: 'active' as 'active' | 'inactive',
  });

  const [tenantForm, setTenantForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idCard: '',
    currentUnitNumber: '',
    status: 'renting' as TenantStatus,
    accountStatus: 'active' as 'active' | 'suspended',
  });

  // Owner Handlers
  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOwner) {
      await updateOwner(editingOwner.id, ownerForm);
      setEditingOwner(null);
    } else {
      await addOwner(ownerForm);
      setIsAddOwnerModalOpen(false);
    }
  };

  // Tenant Handlers
  const handleTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTenant) {
      await updateTenant(editingTenant.id, tenantForm);
      setEditingTenant(null);
    } else {
      await addTenant(tenantForm);
      setIsAddTenantModalOpen(false);
    }
  };

  // Change Tenant Status Submit
  const handleStatusChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantStatusTarget || !statusReason.trim()) {
      addToast('error', 'กรุณาระบุเหตุผลในการเปลี่ยนสถานะ');
      return;
    }
    await changeTenantStatus(tenantStatusTarget.id, newStatus, statusReason);
    setTenantStatusTarget(null);
    setStatusReason('');
  };

  // Filtered lists
  const filteredOwners = owners.filter(o =>
    `${o.firstName} ${o.lastName} ${o.email} ${o.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTenants = tenants.filter(t =>
    `${t.firstName} ${t.lastName} ${t.email} ${t.phone} ${t.currentUnitNumber || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.username} ${u.email} ${u.role}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTenantStatusBadge = (status: TenantStatus) => {
    switch (status) {
      case 'renting':
        return <Badge variant="success" dot>กำลังเช่า (Renting)</Badge>;
      case 'pending_move_in':
        return <Badge variant="warning" dot>รอเข้าอยู่ (Pending Move-in)</Badge>;
      case 'expiring_soon':
        return <Badge variant="warning" dot>ใกล้หมดสัญญา (Expiring)</Badge>;
      case 'pending_verification':
        return <Badge variant="info" dot>รอตรวจสอบ (Verifying)</Badge>;
      case 'moved_out':
        return <Badge variant="neutral">ย้ายออกแล้ว (Moved Out)</Badge>;
      case 'suspended':
        return <Badge variant="danger">ระงับการใช้งาน</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            จัดการเจ้าของห้อง ผู้เช่า และบัญชีผู้ใช้
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            บริหารจัดการข้อมูลผู้มีส่วนได้ส่วนเสีย ตรวจสอบสถานะ และเชื่อมโยงห้องชุด
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'owners' && (
            <button
              onClick={() => {
                setOwnerForm({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  idCard: '',
                  address: '',
                  ownedUnitIds: [],
                  status: 'active',
                });
                setIsAddOwnerModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มเจ้าของห้อง</span>
            </button>
          )}

          {activeTab === 'tenants' && (
            <button
              onClick={() => {
                setTenantForm({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  idCard: '',
                  currentUnitNumber: '',
                  status: 'renting',
                  accountStatus: 'active',
                });
                setIsAddTenantModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มผู้เช่าใหม่</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('owners')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'owners'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>เจ้าของห้อง ({owners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tenants')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tenants'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>ผู้เช่า ({tenants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>บัญชีผู้ใช้งาน ({users.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tab 1: Owners Table */}
      {activeTab === 'owners' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Owner ID</th>
                  <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                  <th className="py-3 px-4">อีเมล / เบอร์โทรศัพท์</th>
                  <th className="py-3 px-4">เลขบัตรประชาชน (Masked)</th>
                  <th className="py-3 px-4">ห้องที่เป็นเจ้าของ</th>
                  <th className="py-3 px-4">สถานะ</th>
                  <th className="py-3 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOwners.map(owner => (
                  <tr key={owner.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">{owner.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{owner.firstName} {owner.lastName}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <div>{owner.email}</div>
                      <div className="text-[11px] text-slate-400">{maskPhone(owner.phone)}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{maskIdCard(owner.idCard)}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {owner.ownedUnitIds.map(uid => (
                          <span key={uid} className="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold text-[11px] border border-brand-200 dark:border-brand-800">
                            {uid.replace('unit-', '').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success" dot size="sm">ปกติ (Active)</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingOwner(owner);
                            setOwnerForm({
                              firstName: owner.firstName,
                              lastName: owner.lastName,
                              email: owner.email,
                              phone: owner.phone,
                              idCard: owner.idCard,
                              address: owner.address,
                              ownedUnitIds: owner.ownedUnitIds,
                              status: owner.status,
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="แก้ไข"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setItemToDelete({ type: 'owner', item: owner })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="ลบ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Tenants Table */}
      {activeTab === 'tenants' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Tenant ID</th>
                  <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                  <th className="py-3 px-4">ห้องปัจจุบัน</th>
                  <th className="py-3 px-4">อีเมล / เบอร์โทรศัพท์</th>
                  <th className="py-3 px-4">สัญญาเช่า</th>
                  <th className="py-3 px-4">สถานะผู้เช่า</th>
                  <th className="py-3 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTenants.map(tenant => (
                  <tr key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">{tenant.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{tenant.firstName} {tenant.lastName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{maskIdCard(tenant.idCard)}</div>
                    </td>
                    <td className="py-3 px-4">
                      {tenant.currentUnitNumber ? (
                        <span className="font-bold text-brand-600 dark:text-brand-400">
                          {tenant.currentUnitNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <div>{tenant.email}</div>
                      <div className="text-[11px] text-slate-400">{maskPhone(tenant.phone)}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {tenant.leaseEndDate ? `ถึง ${formatThaiDate(tenant.leaseEndDate, { short: true })}` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {getTenantStatusBadge(tenant.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setTenantStatusTarget(tenant);
                            setNewStatus(tenant.status);
                            setStatusReason(tenant.statusReason || '');
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        >
                          เปลี่ยนสถานะ
                        </button>
                        <button
                          onClick={() => {
                            setEditingTenant(tenant);
                            setTenantForm({
                              firstName: tenant.firstName,
                              lastName: tenant.lastName,
                              email: tenant.email,
                              phone: tenant.phone,
                              idCard: tenant.idCard,
                              currentUnitNumber: tenant.currentUnitNumber || '',
                              status: tenant.status,
                              accountStatus: tenant.accountStatus,
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="แก้ไข"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setItemToDelete({ type: 'tenant', item: tenant })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="ลบ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Users Table */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">ผู้ใช้งาน</th>
                  <th className="py-3 px-4">Username / Email</th>
                  <th className="py-3 px-4">บทบาท (Role)</th>
                  <th className="py-3 px-4">ห้องชุดที่ผูก</th>
                  <th className="py-3 px-4">สถานะบัญชี</th>
                  <th className="py-3 px-4">เข้าสู่ระบบล่าสุด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={user.avatar} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <div>@{user.username}</div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {user.unitNumber || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success" dot size="sm">ใช้งานปกติ (Active)</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatThaiDate(user.lastLoginAt, { includeTime: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Change Tenant Status Modal (FR-25 Flow) */}
      {tenantStatusTarget && (
        <Modal
          isOpen={!!tenantStatusTarget}
          onClose={() => setTenantStatusTarget(null)}
          title={`เปลี่ยนสถานะผู้เช่า: ${tenantStatusTarget.firstName} ${tenantStatusTarget.lastName}`}
          description={`ห้องปัจจุบัน: ${tenantStatusTarget.currentUnitNumber || 'ไม่มี'}`}
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setTenantStatusTarget(null)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleStatusChangeSubmit}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow"
              >
                บันทึกการเปลี่ยนสถานะ
              </button>
            </>
          }
        >
          <form onSubmit={handleStatusChangeSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">เลือกสถานะใหม่ <span className="text-rose-500">*</span></label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="renting">กำลังเช่า (Renting)</option>
                <option value="pending_move_in">รอเข้าอยู่ (Pending Move-in)</option>
                <option value="expiring_soon">ใกล้หมดสัญญา (Expiring Soon)</option>
                <option value="moved_out">ย้ายออกแล้ว (Moved Out)</option>
                <option value="pending_verification">รอตรวจสอบ (Pending Verification)</option>
                <option value="suspended">ระงับการใช้งาน (Suspended)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                ระบุเหตุผลในการเปลี่ยนสถานะ (Business Rule Requirement) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={statusReason}
                onChange={e => setStatusReason(e.target.value)}
                placeholder="เช่น ผู้เช่าส่งมอบห้องคืนแล้ว, ต่อสัญญาเช่ารอบใหม่, เอกสารผ่านการอนุมัติ..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            {newStatus === 'moved_out' && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                ⚠️ ผลกระทบ: หากเปลี่ยนเป็น "ย้ายออกแล้ว" ระบบจะปรับสถานะห้องชุด <strong>{tenantStatusTarget.currentUnitNumber}</strong> เป็น "ว่าง" โดยอัตโนมัติ และบันทึกลง Audit Log
              </div>
            )}
          </form>
        </Modal>
      )}

      {/* Delete Item Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={async () => {
          if (itemToDelete?.type === 'owner') {
            await deleteOwner(itemToDelete.item.id);
          } else if (itemToDelete?.type === 'tenant') {
            await deleteTenant(itemToDelete.item.id);
          }
          setItemToDelete(null);
        }}
        title={`ยืนยันการลบ${itemToDelete?.type === 'owner' ? 'เจ้าของห้อง' : 'ผู้เช่า'}`}
        message={`ท่านต้องการลบข้อมูล ${itemToDelete?.item.firstName} ${itemToDelete?.item.lastName} ออกจากระบบใช่หรือไม่?`}
        confirmLabel="ยืนยันการลบ"
        variant="danger"
      />
    </div>
  );
};
