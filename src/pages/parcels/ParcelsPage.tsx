import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  QrCode,
  CheckCircle,
  Truck,
  ArrowRight,
  Clock,
  MapPin,
  Camera,
  Trash2,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Parcel, ParcelStatus } from '../../types';
import { formatThaiDate } from '../../lib/utils';
import { Badge, getParcelStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const ParcelsPage: React.FC = () => {
  const {
    parcels,
    units,
    tenants,
    addParcel,
    handoverParcel,
    activeRole,
    currentUser,
    addToast,
  } = useApp();

  const isAdmin = activeRole === 'admin';
  const isTenant = activeRole === 'tenant';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [handoverTarget, setHandoverTarget] = useState<Parcel | null>(null);
  const [inputPickupCode, setInputPickupCode] = useState('');
  const [qrModalTarget, setQrModalTarget] = useState<Parcel | null>(null);

  // Add Form
  const [addForm, setAddForm] = useState({
    trackingNumber: '',
    courier: 'Kerry Express',
    unitNumber: 'A-1205',
    recipientName: 'สมบัติ ประเสริฐยิ่ง',
    pickupPoint: 'ตู้ Locker พัสดุ ชั้น 1 (ตู้ L-04)',
    parcelPhoto: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
  });

  // Filtered Parcels
  const filteredParcels = parcels.filter(p => {
    // Tenant only sees own parcels
    if (isTenant && p.recipientId !== currentUser?.id && p.unitNumber !== currentUser?.unitNumber) {
      return false;
    }

    const matchSearch =
      p.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pickupCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.courier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.trackingNumber.trim()) {
      addToast('error', 'กรุณาระบุเลข Tracking Number');
      return;
    }

    const targetTenant = tenants.find(t => t.currentUnitNumber === addForm.unitNumber) || tenants[0];

    await addParcel({
      trackingNumber: addForm.trackingNumber,
      courier: addForm.courier,
      recipientId: targetTenant.id,
      recipientName: addForm.recipientName,
      unitNumber: addForm.unitNumber,
      arrivedAt: new Date().toISOString(),
      pickupPoint: addForm.pickupPoint,
      parcelPhoto: addForm.parcelPhoto,
    });

    setIsAddModalOpen(false);
    setAddForm({
      trackingNumber: '',
      courier: 'Kerry Express',
      unitNumber: 'A-1205',
      recipientName: 'สมบัติ ประเสริฐยิ่ง',
      pickupPoint: 'ตู้ Locker พัสดุ ชั้น 1',
      parcelPhoto: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
    });
  };

  const handleHandoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoverTarget) return;

    const res = await handoverParcel(handoverTarget.id, inputPickupCode);
    if (res.success) {
      setHandoverTarget(null);
      setInputPickupCode('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            {isAdmin ? 'ระบบจัดการพัสดุผู้พักอาศัย (Parcel Management)' : 'พัสดุของฉัน (My Parcels)'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'บันทึกพัสดุเข้าโครงการ สร้างรหัสรับพัสดุอัตโนมัติ และยืนยันการส่งมอบ'
              : 'แสดงรหัสรับพัสดุและ QR Code เพื่อสแกนรับที่ตู้ Locker หรือเคาน์เตอร์นิติบุคคล'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>บันทึกพัสดุมาใหม่</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="all">ทุกสถานะพัสดุ</option>
            <option value="pending_pickup">รอรับพัสดุ (Pending Pickup)</option>
            <option value="picked_up">รับแล้ว (Picked Up)</option>
            <option value="returned">ส่งคืนต้นทาง (Returned)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหา Tracking, รหัสรับ, หรือเลขห้อง..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tenant Fast Cards: Waiting Parcels (If Tenant) */}
      {isTenant && filteredParcels.filter(p => p.status === 'pending_pickup').length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" />
            พัสดุที่พร้อมรับในขณะนี้ (นำรหัสหรือ QR Code ไปแสดงที่จุดรับ)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredParcels.filter(p => p.status === 'pending_pickup').map(p => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{p.courier}</span>
                    <Badge variant="warning" size="sm">รอรับ</Badge>
                  </div>
                  <div className="text-xs text-slate-500">แทร็กกิ้ง: {p.trackingNumber}</div>
                  <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    จุดรับ: {p.pickupPoint}
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1">
                    มาถึงเมื่อ: {formatThaiDate(p.arrivedAt, { includeTime: true })}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setQrModalTarget(p)}
                    className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-emerald-300 dark:border-emerald-700 hover:scale-105 transition-transform flex flex-col items-center"
                  >
                    <QrCode className="w-8 h-8 text-emerald-600 mb-1" />
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm">{p.pickupCode}</span>
                    <span className="text-[9px] text-slate-400">กดดู QR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parcels Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                <th className="py-3 px-4">รูปพัสดุ</th>
                <th className="py-3 px-4">Tracking Number</th>
                <th className="py-3 px-4">บริษัทขนส่ง</th>
                <th className="py-3 px-4">ห้องชุด / ผู้รับ</th>
                <th className="py-3 px-4">จุดรับพัสดุ</th>
                <th className="py-3 px-4">รหัสรับพัสดุ</th>
                <th className="py-3 px-4">วันเวลาที่มาถึง</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredParcels.map(parcel => (
                <tr key={parcel.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <img
                      src={parcel.parcelPhoto || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80'}
                      alt="Parcel"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {parcel.trackingNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {parcel.courier}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-brand-600 dark:text-brand-400">ห้อง {parcel.unitNumber}</div>
                    <div className="text-[11px] text-slate-500">{parcel.recipientName}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-[160px] truncate">
                    {parcel.pickupPoint}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      {parcel.pickupCode}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {formatThaiDate(parcel.arrivedAt, { includeTime: true })}
                  </td>
                  <td className="py-3 px-4">
                    {getParcelStatusBadge(parcel.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setQrModalTarget(parcel)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="ดู QR Code รับพัสดุ"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      {isAdmin && parcel.status === 'pending_pickup' && (
                        <button
                          onClick={() => {
                            setHandoverTarget(parcel);
                            setInputPickupCode('');
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                        >
                          ส่งมอบ
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Parcel Modal (Admin Flow FR-23) */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="บันทึกพัสดุใหม่เข้าโครงการ"
          description="ระบบจะสร้างรหัสรับพัสดุ 4 หลักและส่งแจ้งเตือนไปยังผู้เช่าทันที"
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleAddSubmit}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow"
              >
                บันทึกและส่งแจ้งเตือน
              </button>
            </>
          }
        >
          <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">เลข Tracking Number <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={addForm.trackingNumber}
                onChange={e => setAddForm({ ...addForm, trackingNumber: e.target.value })}
                placeholder="เช่น KEX-99881122TH หรือ THP-EMS..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">บริษัทขนส่ง</label>
                <select
                  value={addForm.courier}
                  onChange={e => setAddForm({ ...addForm, courier: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="Kerry Express">Kerry Express</option>
                  <option value="Flash Express">Flash Express</option>
                  <option value="ไปรษณีย์ไทย (EMS)">ไปรษณีย์ไทย (EMS)</option>
                  <option value="Shopee Xpress">Shopee Xpress</option>
                  <option value="Lazada Express">Lazada Express</option>
                  <option value="J&T Express">J&T Express</option>
                  <option value="DHL Express">DHL Express</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">เลือกห้องชุดปลายทาง</label>
                <select
                  value={addForm.unitNumber}
                  onChange={e => {
                    const u = units.find(unit => unit.unitNumber === e.target.value);
                    setAddForm({
                      ...addForm,
                      unitNumber: e.target.value,
                      recipientName: u?.currentTenantName || 'ผู้พักอาศัย',
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  {units.map(u => (
                    <option key={u.id} value={u.unitNumber}>
                      ห้อง {u.unitNumber} ({u.currentTenantName || 'ไม่มีผู้เช่า'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">ชื่อผู้รับ</label>
              <input
                type="text"
                required
                value={addForm.recipientName}
                onChange={e => setAddForm({ ...addForm, recipientName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">จุดรับพัสดุ</label>
              <select
                value={addForm.pickupPoint}
                onChange={e => setAddForm({ ...addForm, pickupPoint: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="ตู้ Locker พัสดุอัจฉริยะ ชั้น 1">ตู้ Locker พัสดุอัจฉริยะ ชั้น 1</option>
                <option value="ห้องนิติบุคคล เคาน์เตอร์พัสดุ อาคาร A">ห้องนิติบุคคล เคาน์เตอร์พัสดุ อาคาร A</option>
                <option value="ห้องนิติบุคคล เคาน์เตอร์พัสดุ อาคาร B">ห้องนิติบุคคล เคาน์เตอร์พัสดุ อาคาร B</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* Handover Modal (Admin verifies pickup code) */}
      {handoverTarget && (
        <Modal
          isOpen={!!handoverTarget}
          onClose={() => setHandoverTarget(null)}
          title={`ส่งมอบพัสดุ: ${handoverTarget.trackingNumber}`}
          description={`ห้อง ${handoverTarget.unitNumber} • ผู้รับ: ${handoverTarget.recipientName}`}
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setHandoverTarget(null)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleHandoverSubmit}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow"
              >
                ยืนยันการส่งมอบ
              </button>
            </>
          }
        >
          <form onSubmit={handleHandoverSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
              กรุณาขอให้ผู้รับแสดงรหัสรับพัสดุ <strong>{handoverTarget.pickupCode}</strong> จากแอปพลิเคชัน
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                กรอกรหัสรับพัสดุ (4 หลัก) เพื่อยืนยัน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                autoFocus
                required
                value={inputPickupCode}
                onChange={e => setInputPickupCode(e.target.value)}
                placeholder="เช่น CF-8492"
                className="w-full text-center text-xl font-mono font-bold tracking-widest py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* QR Code / Pickup Code Card Modal */}
      {qrModalTarget && (
        <Modal
          isOpen={!!qrModalTarget}
          onClose={() => setQrModalTarget(null)}
          title="รหัสรับพัสดุและ QR Code"
          description={`ห้อง ${qrModalTarget.unitNumber} • ${qrModalTarget.courier}`}
          maxWidth="sm"
          footer={
            <button
              onClick={() => setQrModalTarget(null)}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white"
            >
              ปิดหน้าต่าง
            </button>
          }
        >
          <div className="text-center py-4 space-y-4">
            {/* Simulated QR & Barcode */}
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-md flex flex-col items-center justify-center">
              <QrCode className="w-32 h-32 text-slate-900" />
              <div className="w-full h-4 bg-slate-900 mt-2 flex items-center justify-center text-[8px] text-white font-mono tracking-widest">
                ||||||||||||||||||||||||||||||||||||||
              </div>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono">
              <span className="text-xs text-slate-400 block">รหัสรับพัสดุของคุณ:</span>
              <span className="text-2xl font-bold text-brand-600 tracking-wider">
                {qrModalTarget.pickupCode}
              </span>
            </div>

            <div className="text-xs text-slate-500 text-left space-y-1">
              <p>Tracking: <strong>{qrModalTarget.trackingNumber}</strong></p>
              <p>จุดรับ: <strong>{qrModalTarget.pickupPoint}</strong></p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
