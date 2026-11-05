import React from 'react';
import { Building, Search, Megaphone, ArrowRight, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../lib/utils';
import { Badge, getUnitStatusBadge } from '../../components/common/Badge';

export const UserDashboard: React.FC = () => {
  const { currentUser, units, announcements, navigateTo } = useApp();

  const vacantUnits = units.filter(u => u.status === 'vacant').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              ยินดีต้อนรับสู่ CondoFlow
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold font-heading">
              สวัสดีคุณ {currentUser?.firstName} {currentUser?.lastName}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              คุณเข้าใช้งานในฐานะ "ผู้ใช้งานทั่วไป" สามารถค้นหาห้องชุดที่เปิดให้เช่า/ขาย และอ่านประกาศข่าวสารของคอนโดมิเนียมได้
            </p>
          </div>

          <button
            onClick={() => navigateTo('/units')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow transition-all active:scale-95 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span>ค้นหาห้องชุดทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Featured Vacant Units */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-600" />
              ห้องชุดว่างพร้อมเข้าอยู่ (Vacant Units for Rent)
            </h3>
            <p className="text-xs text-slate-500">เลือกดูห้องชุดเพื่อติดต่อขอเข้าชมสถานที่จริง</p>
          </div>
          <button
            onClick={() => navigateTo('/units')}
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
          >
            ดูทั้ง {units.length} ยูนิต <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vacantUnits.map(unit => (
            <div
              key={unit.id}
              onClick={() => navigateTo(`/units/${unit.id}`)}
              className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-brand-500 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-40 rounded-xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={unit.images[0]}
                    alt={unit.unitNumber}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    {getUnitStatusBadge(unit.status)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white font-heading">
                      ห้อง {unit.unitNumber}
                    </h4>
                    <span className="font-bold text-brand-600 text-sm">
                      {formatCurrency(unit.rentPrice)}/ด.
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    อาคาร {unit.building} • ชั้น {unit.floor} • {unit.roomType} ({unit.sizeSqm} ตร.ม.)
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5">
                    {unit.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-brand-600 font-medium">
                <span>ดูรายละเอียดห้องชุด</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-brand-600" />
            ข่าวสารและประกาศสาธารณะ
          </h3>
          <button
            onClick={() => navigateTo('/announcements')}
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
          >
            ดูประกาศทั้งหมด
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.slice(0, 4).map(a => (
            <div
              key={a.id}
              onClick={() => navigateTo('/announcements')}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-all"
            >
              <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                {a.title}
              </h5>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                {a.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
