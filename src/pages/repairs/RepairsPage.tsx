import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
  Eye,
  Camera,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RepairRequest, RepairCategory, RepairUrgency, RepairStatus } from '../../types';
import { formatThaiDate } from '../../lib/utils';
import { Badge, getRepairStatusBadge, getUrgencyBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const RepairsPage: React.FC = () => {
  const {
    repairs,
    createRepairRequest,
    updateRepairStatus,
    closeRepairRequest,
    rateRepairRequest,
    activeRole,
    currentUser,
    addToast,
  } = useApp();

  const isAdmin = activeRole === 'admin';
  const isOwner = activeRole === 'owner';
  const isTenant = activeRole === 'tenant';

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>(isAdmin ? 'kanban' : 'table');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<RepairRequest | null>(null);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [ratingTarget, setRatingTarget] = useState<RepairRequest | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Create Form State
  const [form, setForm] = useState({
    areaType: 'unit' as 'unit' | 'common_area',
    location: currentUser?.unitNumber ? `ห้อง ${currentUser.unitNumber}` : 'ห้อง A-1205',
    category: 'aircon' as RepairCategory,
    title: '',
    description: '',
    urgency: 'normal' as RepairUrgency,
    convenientDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    convenientTime: 'ช่วงเช้า (09:00 - 12:00 น.)',
    contactChannel: currentUser?.phone || '089-123-4567',
    photos: [] as string[],
  });

  // Technician Assignment State for Admin
  const [assignedTech, setAssignedTech] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [progressNote, setProgressNote] = useState('');

  // Filtered repairs
  const filteredRepairs = repairs.filter(r => {
    // Role filter
    if (isTenant && r.requesterId !== currentUser?.id && !r.location.includes(currentUser?.unitNumber || 'A-1205')) {
      return false;
    }
    if (isOwner && !currentUser?.ownedUnitIds?.some(uid => r.location.includes(uid.replace('unit-', '').toUpperCase()))) {
      return false;
    }

    const matchSearch =
      r.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchUrgency = selectedUrgency === 'all' || r.urgency === selectedUrgency;
    const matchStatus = selectedStatus === 'all' || r.status === selectedStatus;

    return matchSearch && matchUrgency && matchStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      addToast('error', 'กรุณากรอกหัวข้อและรายละเอียดงานซ่อม');
      return;
    }

    await createRepairRequest({
      requesterId: currentUser?.id || 'usr-tenant-01',
      requesterName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'ผู้พักอาศัย',
      requesterRole: activeRole,
      phone: form.contactChannel,
      areaType: form.areaType,
      location: form.location,
      category: form.category,
      title: form.title,
      description: form.description,
      urgency: form.urgency,
      convenientDate: form.convenientDate,
      convenientTime: form.convenientTime,
      contactChannel: form.contactChannel,
      photos: form.photos.length ? form.photos : ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'],
    });

    setIsCreateModalOpen(false);
    setForm({
      areaType: 'unit',
      location: currentUser?.unitNumber ? `ห้อง ${currentUser.unitNumber}` : 'ห้อง A-1205',
      category: 'aircon',
      title: '',
      description: '',
      urgency: 'normal',
      convenientDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      convenientTime: 'ช่วงเช้า (09:00 - 12:00 น.)',
      contactChannel: currentUser?.phone || '089-123-4567',
      photos: [],
    });
  };

  // Admin status update
  const handleUpdateStatus = async (newStatus: RepairStatus) => {
    if (!selectedRepair) return;
    await updateRepairStatus(
      selectedRepair.id,
      newStatus,
      assignedTech || selectedRepair.assignedTechnician,
      appointmentDate || selectedRepair.appointmentDate,
      progressNote
    );
    setSelectedRepair(null);
    setProgressNote('');
  };

  // Close job
  const handleCloseJobSubmit = async () => {
    if (!selectedRepair || !completionNotes.trim()) {
      addToast('error', 'กรุณาระบุรายละเอียดผลการซ่อม');
      return;
    }
    await closeRepairRequest(selectedRepair.id, completionNotes);
    setIsCloseModalOpen(false);
    setSelectedRepair(null);
    setCompletionNotes('');
  };

  // Rate job
  const handleRateSubmit = async () => {
    if (!ratingTarget) return;
    await rateRepairRequest(ratingTarget.id, ratingStars, ratingComment);
    setRatingTarget(null);
    setRatingComment('');
  };

  // Kanban Columns
  const kanbanColumns: { id: string; label: string; statuses: RepairStatus[]; color: string }[] = [
    { id: 'new', label: 'คำร้องใหม่', statuses: ['submitted'], color: 'border-slate-300 bg-slate-50/50' },
    { id: 'received', label: 'รับเรื่อง / นัดหมาย', statuses: ['received', 'pending_appointment', 'assigned'], color: 'border-sky-300 bg-sky-50/30' },
    { id: 'in_progress', label: 'กำลังซ่อมแซม', statuses: ['in_progress'], color: 'border-blue-400 bg-blue-50/30' },
    { id: 'waiting', label: 'รออะไหล่ / ติดต่อ', statuses: ['waiting_parts'], color: 'border-amber-300 bg-amber-50/30' },
    { id: 'done', label: 'เสร็จสิ้น / ปิดงาน', statuses: ['completed', 'closed'], color: 'border-emerald-300 bg-emerald-50/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            {isAdmin ? 'ศูนย์จัดการงานแจ้งซ่อมบำรุง (Maintenance Command)' : 'แจ้งซ่อมและติดตามสถานะงานซ่อม'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ระบบรับเรื่อง มอบหมายช่าง บันทึกการดำเนินการ และประเมินความพึงพอใจ
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-xl p-1 border border-slate-300 dark:border-slate-700 mr-2">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างคำร้องแจ้งซ่อมใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedUrgency}
            onChange={e => setSelectedUrgency(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="all">ทุกระดับความเร่งด่วน</option>
            <option value="emergency">ฉุกเฉิน (Emergency)</option>
            <option value="high">สูง (High)</option>
            <option value="normal">ปกติ (Normal)</option>
            <option value="low">ต่ำ (Low)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="all">ทุกสถานะคำร้อง</option>
            <option value="submitted">ส่งคำร้องแล้ว</option>
            <option value="received">รับเรื่องแล้ว</option>
            <option value="in_progress">กำลังดำเนินการ</option>
            <option value="waiting_parts">รออะไหล่</option>
            <option value="closed">ปิดงานแล้ว</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหา Ticket No., หัวข้อ, สถานที่..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main View: Kanban vs Table */}
      {viewMode === 'kanban' && isAdmin ? (
        /* Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map(col => {
            const colRepairs = filteredRepairs.filter(r => col.statuses.includes(r.status));
            return (
              <div
                key={col.id}
                className={`p-3.5 rounded-2xl border ${col.color} dark:bg-slate-900/60 flex flex-col min-h-[500px]`}
              >
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="font-heading font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {col.label}
                  </h4>
                  <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center border shadow-2xs">
                    {colRepairs.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colRepairs.map(rep => (
                    <div
                      key={rep.id}
                      onClick={() => setSelectedRepair(rep)}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-brand-500 transition-all cursor-pointer space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-mono font-bold text-brand-600 text-[11px]">
                          {rep.ticketNumber}
                        </span>
                        {getUrgencyBadge(rep.urgency)}
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                        {rep.title}
                      </h5>

                      <div className="text-[11px] text-slate-500 space-y-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{rep.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{formatThaiDate(rep.createdAt, { short: true })}</span>
                        </div>
                      </div>

                      {rep.assignedTechnician && (
                        <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 truncate">
                          ช่าง: <strong>{rep.assignedTechnician.split(' ')[0]}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">หัวข้องานซ่อม</th>
                  <th className="py-3 px-4">สถานที่</th>
                  <th className="py-3 px-4">ผู้แจ้ง / ติดต่อ</th>
                  <th className="py-3 px-4">ความเร่งด่วน</th>
                  <th className="py-3 px-4">ช่างผู้รับผิดชอบ</th>
                  <th className="py-3 px-4">สถานะ</th>
                  <th className="py-3 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRepairs.map(rep => (
                  <tr key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {rep.ticketNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{rep.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{rep.description}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {rep.location}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <div>{rep.requesterName}</div>
                      <div className="text-[10px] text-slate-400">{rep.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      {getUrgencyBadge(rep.urgency)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {rep.assignedTechnician ? rep.assignedTechnician.split(' ')[0] : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {getRepairStatusBadge(rep.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRepair(rep)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="ดูรายละเอียด / ดำเนินการ"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* If completed, allow tenant to rate */}
                        {(isTenant || isOwner) && (rep.status === 'completed' || rep.status === 'closed') && !rep.rating && (
                          <button
                            onClick={() => setRatingTarget(rep)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors flex items-center gap-1"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>ให้คะแนน</span>
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
      )}

      {/* Create Repair Request Modal (FR-07 Flow) */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="สร้างคำร้องแจ้งซ่อมบำรุงใหม่"
          description="กรอกข้อมูลปัญหา แนบภาพถ่าย และระบุเวลานัดหมายที่สะดวก"
          maxWidth="lg"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleCreateSubmit}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow"
              >
                ยืนยันส่งคำร้องแจ้งซ่อม
              </button>
            </>
          }
        >
          <form className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">ประเภทพื้นที่</label>
                <select
                  value={form.areaType}
                  onChange={e => setForm({ ...form, areaType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="unit">ห้องชุด (Unit)</option>
                  <option value="common_area">พื้นที่ส่วนกลาง (Common Area)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">หมวดหมู่ปัญหา</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="aircon">เครื่องปรับอากาศ (Aircon)</option>
                  <option value="plumbing">ระบบประปา / ท่อน้ำ</option>
                  <option value="electrical">ระบบไฟฟ้า / หลอดไฟ</option>
                  <option value="doors_windows">ประตูและหน้าต่าง</option>
                  <option value="furniture">เฟอร์นิเจอร์</option>
                  <option value="elevator">ลิฟต์โดยสาร</option>
                  <option value="common_facility">พื้นที่ส่วนกลาง / สระ / ยิม</option>
                  <option value="internet">อินเทอร์เน็ต / Wi-Fi</option>
                  <option value="other">อื่น ๆ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">สถานที่ / ห้องชุด</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="เช่น ห้อง A-1205 หรือ โถงลิฟต์ชั้น 5 อาคาร B"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ระดับความเร่งด่วน</label>
                <select
                  value={form.urgency}
                  onChange={e => setForm({ ...form, urgency: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="normal">ปกติ (Normal)</option>
                  <option value="low">ต่ำ (Low)</option>
                  <option value="high">สูง (High)</option>
                  <option value="emergency">ฉุกเฉิน (Emergency)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">หัวข้อปัญหา <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="เช่น แอร์มีน้ำหยด, ก๊อกน้ำอ่างล้างจานรั่ว..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">รายละเอียดอาการเสีย <span className="text-rose-500">*</span></label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="อธิบายอาการอย่างละเอียด เพื่อให้ช่างจัดเตรียมอะไหล่ได้ถูกต้อง..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">วันที่สะดวกให้นัดหมาย</label>
                <input
                  type="date"
                  value={form.convenientDate}
                  onChange={e => setForm({ ...form, convenientDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ช่วงเวลาที่สะดวก</label>
                <select
                  value={form.convenientTime}
                  onChange={e => setForm({ ...form, convenientTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="ช่วงเช้า (09:00 - 12:00 น.)">ช่วงเช้า (09:00 - 12:00 น.)</option>
                  <option value="ช่วงบ่าย (13:00 - 16:00 น.)">ช่วงบ่าย (13:00 - 16:00 น.)</option>
                  <option value="ช่วงเย็น (17:00 - 19:00 น.)">ช่วงเย็น (17:00 - 19:00 น.)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">รูปถ่ายประกอบปัญหา (จำลอง)</label>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center gap-3">
                <Camera className="w-6 h-6 text-slate-400 shrink-0" />
                <span className="text-slate-500 text-[11px]">แนบภาพถ่ายจุดเกิดเหตุอัตโนมัติ (sample_repair_pic.jpg)</span>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Repair Detail & Admin Actions Modal (FR-18, FR-19 Flow) */}
      {selectedRepair && (
        <Modal
          isOpen={!!selectedRepair}
          onClose={() => setSelectedRepair(null)}
          title={`งานแจ้งซ่อม: ${selectedRepair.ticketNumber}`}
          description={`${selectedRepair.title} (${selectedRepair.location})`}
          maxWidth="2xl"
          footer={
            isAdmin ? (
              <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('rejected')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200"
                >
                  ปฏิเสธคำร้อง
                </button>

                <div className="flex items-center gap-2">
                  {selectedRepair.status === 'submitted' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('received')}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow"
                    >
                      รับเรื่อง (Receive)
                    </button>
                  )}
                  {selectedRepair.status !== 'completed' && selectedRepair.status !== 'closed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus('in_progress')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow"
                      >
                        เริ่มดำเนินการ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus('waiting_parts')}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow"
                      >
                        รออะไหล่
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCloseModalOpen(true)}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow"
                      >
                        ปิดงานซ่อม (Close Job)
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedRepair(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800"
              >
                ปิดหน้าต่าง
              </button>
            )
          }
        >
          <div className="space-y-4 text-xs">
            {/* Status & Urgency Header */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span>สถานะ:</span>
                {getRepairStatusBadge(selectedRepair.status)}
              </div>
              <div className="flex items-center gap-2">
                <span>ความเร่งด่วน:</span>
                {getUrgencyBadge(selectedRepair.urgency)}
              </div>
            </div>

            {/* Description & Specs */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">รายละเอียดคำร้อง:</h4>
              <p className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedRepair.description}
              </p>
            </div>

            {/* Requester & Location Info */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <div>
                <span className="text-slate-400">ผู้แจ้ง:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedRepair.requesterName} ({selectedRepair.requesterRole})</p>
                <p className="text-[11px] text-slate-500">โทร: {selectedRepair.phone}</p>
              </div>
              <div>
                <span className="text-slate-400">เวลานัดหมายสะดวก:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{formatThaiDate(selectedRepair.convenientDate)}</p>
                <p className="text-[11px] text-slate-500">{selectedRepair.convenientTime}</p>
              </div>
            </div>

            {/* Admin Assign Technician Section */}
            {isAdmin && selectedRepair.status !== 'closed' && (
              <div className="p-3 bg-brand-50/50 dark:bg-brand-950/20 rounded-xl border border-brand-200 dark:border-brand-800 space-y-3">
                <h4 className="font-semibold text-brand-900 dark:text-brand-300">
                  มอบหมายช่างและกำหนดวันเข้าซ่อม (Admin Task Assignment)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1">ชื่อช่าง / บริษัทคู่สัญญา</label>
                    <input
                      type="text"
                      value={assignedTech || selectedRepair.assignedTechnician || ''}
                      onChange={e => setAssignedTech(e.target.value)}
                      placeholder="เช่น ช่างวิเชียร หรือ ช่างสมพงษ์ แอร์"
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">บันทึกความคืบหน้า</label>
                    <input
                      type="text"
                      value={progressNote}
                      onChange={e => setProgressNote(e.target.value)}
                      placeholder="เช่น ช่างเข้าดูหน้างานแล้ว รอสั่งอะไหล่..."
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Updates History Timeline */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">ประวัติการดำเนินงาน (Timeline Updates):</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedRepair.updates.map(u => (
                  <div key={u.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px] space-y-0.5">
                    <div className="flex justify-between text-slate-400">
                      <span>{u.actor}</span>
                      <span>{formatThaiDate(u.timestamp, { includeTime: true })}</span>
                    </div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{u.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion Result if closed */}
            {selectedRepair.completionNotes && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                <span className="font-bold block mb-1">ผลการซ่อมแซมและปิดงาน:</span>
                <p>{selectedRepair.completionNotes}</p>
                {selectedRepair.rating && (
                  <div className="mt-2 flex items-center gap-1.5 text-amber-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300">คะแนนความพึงพอใจ:</span>
                    {Array.from({ length: selectedRepair.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                    {selectedRepair.ratingComment && (
                      <span className="text-slate-500 text-[11px] ml-2 font-normal">"{selectedRepair.ratingComment}"</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Close Job Modal */}
      {isCloseModalOpen && selectedRepair && (
        <Modal
          isOpen={isCloseModalOpen}
          onClose={() => setIsCloseModalOpen(false)}
          title={`ปิดงานซ่อม ${selectedRepair.ticketNumber}`}
          description="บันทึกผลการดำเนินงานและส่งแบบประเมินความพึงพอใจแก่ผู้แจ้ง"
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsCloseModalOpen(false)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleCloseJobSubmit}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow"
              >
                ยืนยันปิดงานซ่อม
              </button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                สรุปผลการซ่อมแซมและวิธีแก้ไข <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={completionNotes}
                onChange={e => setCompletionNotes(e.target.value)}
                placeholder="เช่น เปลี่ยนซีลยางและก๊อกน้ำใหม่ ทดสอบการไหลปิดน้ำสนิทเรียบร้อย..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Satisfaction Rating Modal */}
      {ratingTarget && (
        <Modal
          isOpen={!!ratingTarget}
          onClose={() => setRatingTarget(null)}
          title={`ประเมินความพึงพอใจ: ${ratingTarget.ticketNumber}`}
          description={`งานซ่อม: ${ratingTarget.title}`}
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setRatingTarget(null)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ไว้ทีหลัง
              </button>
              <button
                type="button"
                onClick={handleRateSubmit}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow"
              >
                ส่งคะแนนความพึงพอใจ
              </button>
            </>
          }
        >
          <div className="space-y-4 text-xs text-center py-2">
            <p className="text-slate-600">กรุณาให้คะแนนการให้บริการของทีมช่างและนิติบุคคล</p>

            {/* Stars */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= ratingStars ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={ratingComment}
              onChange={e => setRatingComment(e.target.value)}
              placeholder="ข้อเสนอแนะเพิ่มเติม (ถ้ามี)..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-left focus:outline-none"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
