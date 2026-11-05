import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Pin,
  Calendar,
  User,
  AlertTriangle,
  Info,
  Clock,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Announcement, AnnouncementCategory } from '../../types';
import { formatThaiDate } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AnnouncementsPage: React.FC = () => {
  const { announcements, createAnnouncement, activeRole, currentUser } = useApp();

  const isAdmin = activeRole === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAnnForView, setSelectedAnnForView] = useState<Announcement | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'general' as AnnouncementCategory,
    targetAudience: 'all' as Announcement['targetAudience'],
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    priority: 'normal' as Announcement['priority'],
    isPinned: false,
    status: 'published' as Announcement['status'],
    authorName: currentUser ? `${currentUser.firstName} (${currentUser.role})` : 'นิติบุคคลอาคารชุด',
  });

  const [isPreview, setIsPreview] = useState(false);

  // Filtered
  const filteredAnnouncements = announcements.filter(a => {
    const matchCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    await createAnnouncement({
      title: form.title,
      content: form.content,
      category: form.category,
      targetAudience: form.targetAudience,
      startDate: form.startDate,
      endDate: form.endDate,
      priority: form.priority,
      isPinned: form.isPinned,
      status: form.status,
      authorName: form.authorName,
    });

    setIsCreateModalOpen(false);
    setIsPreview(false);
    setForm({
      title: '',
      content: '',
      category: 'general',
      targetAudience: 'all',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      priority: 'normal',
      isPinned: false,
      status: 'published',
      authorName: currentUser ? `${currentUser.firstName} (${currentUser.role})` : 'นิติบุคคลอาคารชุด',
    });
  };

  const getCategoryBadge = (cat: AnnouncementCategory) => {
    switch (cat) {
      case 'utility_cut':
        return <Badge variant="danger" dot>แจ้งตัดน้ำ/ตัดไฟ</Badge>;
      case 'emergency':
        return <Badge variant="danger" dot>เหตุฉุกเฉิน</Badge>;
      case 'payment_reminder':
        return <Badge variant="warning" dot>เตือนชำระเงิน</Badge>;
      case 'maintenance':
        return <Badge variant="info">ซ่อมบำรุงส่วนกลาง</Badge>;
      case 'activity':
        return <Badge variant="purple">กิจกรรมโครงการ</Badge>;
      case 'regulation':
        return <Badge variant="neutral">กฎระเบียบคอนโด</Badge>;
      default:
        return <Badge variant="neutral">ข่าวทั่วไป</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            {isAdmin ? 'จัดการประกาศและข่าวสารโครงการ' : 'ประกาศและข่าวสารคอนโดมิเนียม'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'เผยแพร่ประกาศ แจ้งตัดน้ำ/ไฟ กำหนดกลุ่มเป้าหมาย และส่งการแจ้งเตือนทันที'
              : 'ติดตามข่าวสาร งานซ่อมบำรุงประจำเดือน และกิจกรรมของโครงการ'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างประกาศใหม่</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="all">ทุกหมวดหมู่ประกาศ</option>
            <option value="utility_cut">แจ้งตัดน้ำ/ตัดไฟ</option>
            <option value="payment_reminder">แจ้งเตือนชำระเงิน</option>
            <option value="maintenance">งานซ่อมบำรุงส่วนกลาง</option>
            <option value="emergency">เหตุฉุกเฉิน / ซ้อมหนีไฟ</option>
            <option value="activity">กิจกรรมคอนโด</option>
            <option value="regulation">กฎระเบียบ</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหาหัวข้อประกาศ..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAnnouncements.map(ann => (
          <div
            key={ann.id}
            onClick={() => setSelectedAnnForView(ann)}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all cursor-pointer hover:shadow-lg flex flex-col justify-between ${
              ann.isPinned
                ? 'border-brand-500/60 shadow-xs ring-1 ring-brand-500/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(ann.category)}
                  {ann.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full">
                      <Pin className="w-3 h-3" /> ปักหมุด
                    </span>
                  )}
                </div>
                {ann.priority === 'urgent' && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                    ด่วนที่สุด
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white font-heading line-clamp-2">
                {ann.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {ann.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatThaiDate(ann.startDate)}
              </span>
              <span className="font-medium text-slate-500">
                โดย: {ann.authorName}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View Detail Modal */}
      {selectedAnnForView && (
        <Modal
          isOpen={!!selectedAnnForView}
          onClose={() => setSelectedAnnForView(null)}
          title={selectedAnnForView.title}
          description={`เผยแพร่เมื่อ: ${formatThaiDate(selectedAnnForView.startDate)} โดย ${selectedAnnForView.authorName}`}
          maxWidth="lg"
          footer={
            <button
              onClick={() => setSelectedAnnForView(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white"
            >
              ปิดหน้าต่าง
            </button>
          }
        >
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="flex items-center gap-2">
              {getCategoryBadge(selectedAnnForView.category)}
              {selectedAnnForView.isPinned && (
                <span className="text-brand-600 font-semibold flex items-center gap-1">
                  <Pin className="w-3 h-3" /> ปักหมุดประกาศ
                </span>
              )}
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-line p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700">
              {selectedAnnForView.content}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-500 text-[11px] space-y-1">
              <p>กลุ่มเป้าหมาย: <strong>{selectedAnnForView.targetAudience.toUpperCase()}</strong></p>
              <p>ระยะเวลาเผยแพร่: {formatThaiDate(selectedAnnForView.startDate)} ถึง {formatThaiDate(selectedAnnForView.endDate)}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Announcement Modal (Admin Flow FR-20) */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsPreview(false);
          }}
          title={isPreview ? "ตัวอย่างประกาศ (Preview Announcement)" : "สร้างประกาศโครงการใหม่"}
          description="กรอกเนื้อหา เลือกกลุ่มเป้าหมาย และส่งการแจ้งเตือนแบบเรียลไทม์"
          maxWidth="xl"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200"
              >
                {isPreview ? "กลับไปแก้ไข" : "ดูตัวอย่าง (Preview)"}
              </button>
              <button
                type="button"
                onClick={handleCreateSubmit}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow"
              >
                ยืนยันเผยแพร่ประกาศ
              </button>
            </>
          }
        >
          {!isPreview ? (
            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">หัวข้อประกาศ <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="เช่น ประกาศกำหนดการทำความสะอาดแท้งก์น้ำส่วนกลาง..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">หมวดหมู่ประกาศ</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="general">ข่าวทั่วไป</option>
                    <option value="utility_cut">แจ้งตัดน้ำ / ตัดไฟฟ้า</option>
                    <option value="payment_reminder">แจ้งเตือนชำระเงิน</option>
                    <option value="maintenance">งานซ่อมบำรุงส่วนกลาง</option>
                    <option value="emergency">เหตุฉุกเฉิน</option>
                    <option value="activity">กิจกรรมโครงการ</option>
                    <option value="regulation">กฎระเบียบคอนโด</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">กลุ่มเป้าหมาย</label>
                  <select
                    value={form.targetAudience}
                    onChange={e => setForm({ ...form, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="all">ทุกคน (All Residents)</option>
                    <option value="tenants">เฉพาะผู้เช่า (Tenants Only)</option>
                    <option value="owners">เฉพาะเจ้าของห้อง (Owners Only)</option>
                    <option value="building">เฉพาะอาคารที่กำหนด</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">รายละเอียดประกาศ <span className="text-rose-500">*</span></label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="ระบุข้อความ วันเวลา และรายละเอียดที่ผู้พักอาศัยควรทราบ..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">ระดับความสำคัญ</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="normal">ปกติ (Normal)</option>
                    <option value="important">สำคัญ (Important)</option>
                    <option value="urgent">ด่วนที่สุด (Urgent)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isPinned}
                      onChange={e => setForm({ ...form, isPinned: e.target.checked })}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">ปักหมุดไว้บนสุด (Pin)</span>
                  </label>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                {getCategoryBadge(form.category)}
                {form.isPinned && (
                  <span className="font-semibold text-brand-600 flex items-center gap-1">
                    <Pin className="w-3 h-3" /> ปักหมุด
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-heading">{form.title || '(ไม่มีหัวข้อ)'}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{form.content || '(ไม่มีเนื้อหา)'}</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
