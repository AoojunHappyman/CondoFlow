import React, { useState, useMemo } from 'react';
import { Search, Building, User, Receipt, Wrench, Package, Megaphone, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatCurrency, formatThaiDate } from '../../lib/utils';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { units, tenants, invoices, repairs, parcels, announcements, navigateTo, activeRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return null;

    const matchedUnits = units.filter(u =>
      u.unitNumber.toLowerCase().includes(q) ||
      u.building.toLowerCase().includes(q) ||
      u.roomType.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedTenants = activeRole === 'admin'
      ? tenants.filter(t =>
          t.firstName.toLowerCase().includes(q) ||
          t.lastName.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          (t.currentUnitNumber && t.currentUnitNumber.toLowerCase().includes(q))
        ).slice(0, 3)
      : [];

    const matchedInvoices = invoices.filter(i =>
      i.invoiceNumber.toLowerCase().includes(q) ||
      i.unitNumber.toLowerCase().includes(q) ||
      i.recipientName.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedRepairs = repairs.filter(r =>
      r.ticketNumber.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedParcels = parcels.filter(p =>
      p.trackingNumber.toLowerCase().includes(q) ||
      p.pickupCode.toLowerCase().includes(q) ||
      p.unitNumber.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAnnouncements = announcements.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      units: matchedUnits,
      tenants: matchedTenants,
      invoices: matchedInvoices,
      repairs: matchedRepairs,
      parcels: matchedParcels,
      announcements: matchedAnnouncements,
    };
  }, [searchTerm, units, tenants, invoices, repairs, parcels, announcements, activeRole]);

  const handleSelect = (route: string) => {
    navigateTo(route);
    onClose();
    setSearchTerm('');
  };

  const hasAnyResult = results && (
    results.units.length > 0 ||
    results.tenants.length > 0 ||
    results.invoices.length > 0 ||
    results.repairs.length > 0 ||
    results.parcels.length > 0 ||
    results.announcements.length > 0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ค้นหาข้อมูลในระบบ CondoFlow"
      description="ค้นหาห้องชุด, ผู้เช่า, ใบแจ้งหนี้, งานแจ้งซ่อม, พัสดุ หรือประกาศ"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="พิมพ์เลขห้อง (เช่น A-1205), ชื่อผู้เช่า, เลขบิล, หรือรหัสพัสดุ..."
            className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none text-slate-900 dark:text-slate-100 transition-all text-sm font-medium"
          />
        </div>

        {/* Results */}
        {!searchTerm && (
          <div className="py-8 text-center text-xs text-slate-400">
            ลองค้นหา เช่น <button onClick={() => setSearchTerm('A-1205')} className="text-brand-600 underline">A-1205</button>,{' '}
            <button onClick={() => setSearchTerm('สมบัติ')} className="text-brand-600 underline">สมบัติ</button>, หรือ{' '}
            <button onClick={() => setSearchTerm('REP-2026')} className="text-brand-600 underline">REP-2026</button>
          </div>
        )}

        {searchTerm && !hasAnyResult && (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            ไม่พบข้อมูลที่ตรงกับคำค้นหา "{searchTerm}"
          </div>
        )}

        {results && hasAnyResult && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Units */}
            {results.units.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> ห้องชุด ({results.units.length})
                </h4>
                <div className="space-y-1.5">
                  {results.units.map(u => (
                    <div
                      key={u.id}
                      onClick={() => handleSelect(`/units/${u.id}`)}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <div>
                        <span className="font-semibold text-brand-600 dark:text-brand-400 mr-2">{u.unitNumber}</span>
                        <span className="text-xs text-slate-600 dark:text-slate-300">อาคาร {u.building} ชั้น {u.floor} • {u.roomType} • {formatCurrency(u.rentPrice)}/ด.</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tenants */}
            {results.tenants.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> ผู้เช่า ({results.tenants.length})
                </h4>
                <div className="space-y-1.5">
                  {results.tenants.map(t => (
                    <div
                      key={t.id}
                      onClick={() => handleSelect('/admin/owners-tenants')}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="font-medium text-slate-800 dark:text-slate-200 mr-2">{t.firstName} {t.lastName}</span>
                        <span className="text-xs text-slate-500">ห้อง: {t.currentUnitNumber || 'ไม่มี'} • {t.phone}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices */}
            {results.invoices.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5" /> ใบแจ้งหนี้ ({results.invoices.length})
                </h4>
                <div className="space-y-1.5">
                  {results.invoices.map(i => (
                    <div
                      key={i.id}
                      onClick={() => handleSelect(activeRole === 'admin' ? '/admin/invoices' : '/payments')}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">{i.invoiceNumber}</span>
                        <span className="text-xs text-slate-500">ห้อง {i.unitNumber} • {formatCurrency(i.totalAmount)} • ครบกำหนด {formatThaiDate(i.dueDate, { short: true })}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Repairs */}
            {results.repairs.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" /> งานแจ้งซ่อม ({results.repairs.length})
                </h4>
                <div className="space-y-1.5">
                  {results.repairs.map(r => (
                    <div
                      key={r.id}
                      onClick={() => handleSelect(activeRole === 'admin' ? '/admin/repairs' : '/maintenance')}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">{r.ticketNumber}</span>
                        <span className="text-xs text-slate-500">{r.title} ({r.location})</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parcels */}
            {results.parcels.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> พัสดุ ({results.parcels.length})
                </h4>
                <div className="space-y-1.5">
                  {results.parcels.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(activeRole === 'admin' ? '/admin/parcels' : '/parcels')}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">{p.trackingNumber}</span>
                        <span className="text-xs text-slate-500">{p.courier} • ห้อง {p.unitNumber} • รหัส: {p.pickupCode}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Announcements */}
            {results.announcements.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5" /> ประกาศ ({results.announcements.length})
                </h4>
                <div className="space-y-1.5">
                  {results.announcements.map(a => (
                    <div
                      key={a.id}
                      onClick={() => handleSelect('/announcements')}
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="truncate pr-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{a.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
