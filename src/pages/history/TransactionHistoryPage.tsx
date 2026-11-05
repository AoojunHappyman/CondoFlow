import React, { useState, useMemo } from 'react';
import {
  Clock,
  Search,
  Filter,
  Receipt,
  CreditCard,
  Wrench,
  Package,
  FileText,
  Eye,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatThaiDate } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const TransactionHistoryPage: React.FC = () => {
  const {
    currentUser,
    invoices,
    payments,
    repairs,
    parcels,
    contracts,
    activeRole,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  // Compile unified personal transaction items
  const historyItems = useMemo(() => {
    const items: any[] = [];
    const myUnitNumber = currentUser?.unitNumber || 'A-1205';

    // 1. Invoices
    invoices
      .filter(i => activeRole === 'admin' || i.recipientId === currentUser?.id || i.unitNumber === myUnitNumber)
      .forEach(i => {
        items.push({
          id: i.id,
          type: 'invoice',
          typeName: 'ใบแจ้งหนี้',
          title: `ใบแจ้งหนี้ ${i.invoiceNumber} (${i.billingCycle})`,
          detail: `ยอดรวม ${formatCurrency(i.totalAmount)} • ห้อง ${i.unitNumber}`,
          timestamp: i.createdAt || i.issueDate,
          status: i.status,
          amount: i.totalAmount,
          raw: i,
        });
      });

    // 2. Payments
    payments
      .filter(p => activeRole === 'admin' || p.payerId === currentUser?.id || p.unitNumber === myUnitNumber)
      .forEach(p => {
        items.push({
          id: p.id,
          type: 'payment',
          typeName: 'การชำระเงิน',
          title: `แจ้งชำระเงิน ${p.paymentNumber}`,
          detail: `ยอดโอน ${formatCurrency(p.paidAmount)} ผ่าน ${p.sourceBank}`,
          timestamp: `${p.paymentDate}T${p.paymentTime || '12:00'}:00Z`,
          status: p.status,
          amount: p.paidAmount,
          raw: p,
        });
      });

    // 3. Repairs
    repairs
      .filter(r => activeRole === 'admin' || r.requesterId === currentUser?.id || r.location.includes(myUnitNumber))
      .forEach(r => {
        items.push({
          id: r.id,
          type: 'repair',
          typeName: 'งานแจ้งซ่อม',
          title: `แจ้งซ่อม ${r.ticketNumber}: ${r.title}`,
          detail: `สถานที่: ${r.location} • ความเร่งด่วน: ${r.urgency}`,
          timestamp: r.createdAt,
          status: r.status,
          raw: r,
        });
      });

    // 4. Parcels
    parcels
      .filter(p => activeRole === 'admin' || p.recipientId === currentUser?.id || p.unitNumber === myUnitNumber)
      .forEach(p => {
        items.push({
          id: p.id,
          type: 'parcel',
          typeName: 'พัสดุ',
          title: `พัสดุ ${p.courier} (${p.trackingNumber})`,
          detail: `รหัสรับ: ${p.pickupCode} • จุดรับ: ${p.pickupPoint}`,
          timestamp: p.arrivedAt,
          status: p.status,
          raw: p,
        });
      });

    // Sort descending by timestamp
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [currentUser, invoices, payments, repairs, parcels, activeRole]);

  // Filtered
  const filteredItems = historyItems.filter(item => {
    const matchCat = selectedCategory === 'all' || item.type === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <Receipt className="w-4 h-4 text-brand-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'repair':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'parcel':
        return <Package className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2.5">
          <Clock className="w-6 h-6 text-brand-600" />
          ประวัติการทำรายการย้อนหลัง (Transaction History)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          ประวัติใบแจ้งหนี้ การชำระเงิน งานซ่อมบำรุง และการรับพัสดุที่เกี่ยวข้องกับบัญชีของคุณ (ข้อมูลแยกเป็นส่วนตัว)
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="all">ทุกประเภทรายการ ({historyItems.length})</option>
            <option value="invoice">ใบแจ้งหนี้ (Invoices)</option>
            <option value="payment">การชำระเงิน (Payments)</option>
            <option value="repair">งานแจ้งซ่อม (Repairs)</option>
            <option value="parcel">พัสดุ (Parcels)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหาประวัติรายการ..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {filteredItems.map(item => (
          <div
            key={item.id + item.type}
            onClick={() => setSelectedDetail(item)}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                {getTypeIcon(item.type)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {item.typeName}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-slate-400">
                    {formatThaiDate(item.timestamp, { includeTime: true })}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {item.detail}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 flex items-center gap-3">
              {item.amount !== undefined && (
                <div className="hidden sm:block">
                  <span className="text-sm font-bold text-slate-900 dark:text-white block font-heading">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              )}
              <Badge variant="neutral" size="sm">{item.status}</Badge>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <Modal
          isOpen={!!selectedDetail}
          onClose={() => setSelectedDetail(null)}
          title={selectedDetail.title}
          description={`ประเภท: ${selectedDetail.typeName} • วันที่: ${formatThaiDate(selectedDetail.timestamp, { includeTime: true })}`}
          maxWidth="md"
          footer={
            <button
              onClick={() => setSelectedDetail(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white shadow"
            >
              ปิดหน้าต่าง
            </button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-700">
              <p><strong>รายละเอียด:</strong> {selectedDetail.detail}</p>
              <p><strong>สถานะ:</strong> {selectedDetail.status}</p>
              {selectedDetail.amount !== undefined && (
                <p><strong>ยอดเงิน:</strong> {formatCurrency(selectedDetail.amount)}</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
