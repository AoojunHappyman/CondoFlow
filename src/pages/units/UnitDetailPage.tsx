import React, { useState } from 'react';
import {
  ArrowLeft,
  Building,
  Check,
  CreditCard,
  FileText,
  Home,
  MapPin,
  Share2,
  Shield,
  User,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatThaiDate } from '../../lib/utils';
import { getUnitStatusBadge, getContractStatusBadge, getInvoiceStatusBadge } from '../../components/common/Badge';

export const UnitDetailPage: React.FC<{ unitId: string }> = ({ unitId }) => {
  const { units, contracts, invoices, repairs, activeRole, navigateTo, addToast } = useApp();

  const unit = units.find(u => u.id === unitId) || units.find(u => u.unitNumber === 'A-1205') || units[0];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const isAdmin = activeRole === 'admin';
  const isOwner = activeRole === 'owner';
  const isTenant = activeRole === 'tenant';

  // Active Contract
  const activeContract = contracts.find(
    c => c.unitId === unit.id && (c.status === 'active' || c.status === 'expiring_soon')
  );

  // Invoices for this room
  const unitInvoices = invoices.filter(i => i.unitId === unit.id || i.unitNumber === unit.unitNumber);

  // Repairs for this room
  const unitRepairs = repairs.filter(r => r.location.includes(unit.unitNumber));

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('success', 'คัดลอกลิงก์ห้องชุดเรียบร้อยแล้ว');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Nav Back & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo(isAdmin ? '/admin/units' : '/units')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้ารายการห้องชุด</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>แชร์ห้องชุด</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => navigateTo('/admin/contracts')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
            >
              จัดการสัญญาห้องนี้
            </button>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400">โครงการ CondoFlow พระราม 9</span>
            <span>•</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">อาคาร {unit.building} ชั้น {unit.floor}</span>
            <span>•</span>
            {getUnitStatusBadge(unit.status)}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
            ห้องชุดเลขที่ {unit.unitNumber}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {unit.roomType} • {unit.sizeSqm} ตารางเมตร • {unit.bedrooms} ห้องนอน • {unit.bathrooms} ห้องน้ำ
          </p>
        </div>

        <div className="text-left md:text-right bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 min-w-[200px]">
          <span className="text-xs text-slate-400">อัตราค่าเช่ารายเดือน</span>
          <div className="text-2xl font-bold text-brand-600 font-heading">
            {formatCurrency(unit.rentPrice)}
          </div>
          <span className="text-xs text-slate-500">
            ค่าส่วนกลาง: {formatCurrency(unit.commonFee)} / เดือน
          </span>
        </div>
      </div>

      {/* Photo Gallery Carousel */}
      <div className="space-y-3">
        <div className="h-80 sm:h-96 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 relative">
          <img
            src={unit.images[selectedPhotoIndex] || unit.images[0]}
            alt={unit.unitNumber}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
            รูปที่ {selectedPhotoIndex + 1} จาก {unit.images.length}
          </div>
        </div>

        {unit.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {unit.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedPhotoIndex === idx
                    ? 'border-brand-600 shadow-md scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Left Description & Specs, Right Active Lease & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Features */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white">
              รายละเอียดและสิ่งอำนวยความสะดวกในห้อง
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {unit.description}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                คุณสมบัติและอุปกรณ์พิเศษ (Features)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(unit.features || ['ระเบียงวิวเมือง', 'เฟอร์นิเจอร์ Built-in', 'แอร์ Inverter', 'Digital Door Lock']).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions for Room */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-brand-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                ต้องการแจ้งเรื่องหรือส่งคำร้องเกี่ยวกับห้องนี้?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                แจ้งซ่อมแอร์ ท่อน้ำ ไฟฟ้า หรือทรัพย์สินภายในห้องชุดได้ตลอด 24 ชม.
              </p>
            </div>
            <button
              onClick={() => navigateTo('/maintenance')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              <span>แจ้งซ่อมห้องนี้</span>
            </button>
          </div>
        </div>

        {/* Right Col: Lease Info & Stakeholders */}
        <div className="space-y-6">
          {/* Active Lease Box (Admin, Owner, Tenant only) */}
          {(isAdmin || isOwner || isTenant) && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                ข้อมูลสัญญาเช่าปัจจุบัน
              </h3>

              {activeContract ? (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activeContract.contractNumber}</span>
                    {getContractStatusBadge(activeContract.status)}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2 border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ผู้เช่า:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{activeContract.tenantName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">เจ้าของห้อง:</span>
                      <span className="text-slate-800 dark:text-slate-200">{activeContract.ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">วันเริ่มสัญญา:</span>
                      <span>{formatThaiDate(activeContract.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">วันสิ้นสุดสัญญา:</span>
                      <span className="font-semibold text-brand-600">{formatThaiDate(activeContract.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">เงินประกันสัญญา:</span>
                      <span>{formatCurrency(activeContract.depositAmount)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  ห้องชุดนี้ยังไม่มีสัญญาเช่าที่เปิดใช้งาน (ห้องว่าง)
                </div>
              )}
            </div>
          )}

          {/* Privacy Note for Public Users */}
          {!isAdmin && !isOwner && !isTenant && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>นโยบายความเป็นส่วนตัว (PDPA)</span>
              </div>
              <p className="leading-relaxed">
                ระบบทำการปกปิดข้อมูลส่วนบุคคลของเจ้าของร่วมและประวัติสัญญาตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
              </p>
            </div>
          )}

          {/* Room Summary Specs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
              ข้อมูลสรุปห้องชุด
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Unit ID:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{unit.id}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">อาคาร:</span>
                <span className="text-slate-700 dark:text-slate-300">อาคาร {unit.building}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">ชั้น:</span>
                <span className="text-slate-700 dark:text-slate-300">ชั้น {unit.floor}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">ขนาด:</span>
                <span className="text-slate-700 dark:text-slate-300">{unit.sizeSqm} ตร.ม.</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">ห้องนอน / ห้องน้ำ:</span>
                <span className="text-slate-700 dark:text-slate-300">{unit.bedrooms} นอน / {unit.bathrooms} น้ำ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
