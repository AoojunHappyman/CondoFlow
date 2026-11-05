import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  CreditCard,
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  XCircle,
  CheckCircle,
  Layers,
  Upload,
  Calendar,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, ExpenseCategory, InvoiceStatus } from '../../types';
import { formatCurrency, formatThaiDate, exportToCSV } from '../../lib/utils';
import { Badge, getInvoiceStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const InvoicesPage: React.FC = () => {
  const {
    invoices,
    units,
    owners,
    tenants,
    createInvoice,
    batchCreateInvoices,
    cancelInvoice,
    submitPayment,
    activeRole,
    currentUser,
    navigateTo,
    addToast,
  } = useApp();

  const isAdmin = activeRole === 'admin';
  const isOwner = activeRole === 'owner';
  const isTenant = activeRole === 'tenant';

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);
  const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);

  // Single Invoice Form
  const [singleForm, setSingleForm] = useState({
    recipientId: tenants[0]?.id || '',
    recipientRole: 'tenant' as 'tenant' | 'owner',
    unitId: units[0]?.id || '',
    billingCycle: 'พฤศจิกายน 2569',
    category: 'rent' as ExpenseCategory,
    items: [{ id: '1', description: 'ค่าเช่าห้องชุด ประจำเดือนพฤศจิกายน 2569', amount: 16500 }],
    dueDate: '2026-11-15',
    note: '',
  });

  // Batch Invoice Form
  const [batchForm, setBatchForm] = useState({
    billingCycle: 'ไตรมาส 1/2570',
    category: 'common_fee' as ExpenseCategory,
    selectedBuilding: 'all' as 'all' | 'A' | 'B',
  });

  // Payment Form for Tenant
  const [payForm, setPayForm] = useState({
    paidAmount: 0,
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentTime: '12:00',
    sourceBank: 'ธนาคารกสิกรไทย (KBANK)',
    paymentMethod: 'promptpay' as 'transfer' | 'promptpay' | 'credit_card',
    referenceNumber: 'KBANK-' + Math.floor(1000000000 + Math.random() * 9000000000),
    slipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    note: '',
  });

  // Filtered Invoices
  const filteredInvoices = invoices.filter(inv => {
    // Role scope
    if (isTenant && inv.recipientId !== currentUser?.id && inv.unitNumber !== currentUser?.unitNumber) {
      return false;
    }
    if (isOwner && !currentUser?.ownedUnitIds?.includes(inv.unitId) && inv.recipientId !== currentUser?.id) {
      return false;
    }

    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.recipientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = selectedCategory === 'all' || inv.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || inv.status === selectedStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  // Summary figures
  const totalBilled = filteredInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = filteredInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const totalUnpaid = filteredInvoices
    .filter(i => i.status === 'pending' || i.status === 'due_soon' || i.status === 'overdue' || i.status === 'verifying')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  // Single Form Submit
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = units.find(u => u.id === singleForm.unitId);
    const targetRecipient =
      singleForm.recipientRole === 'tenant'
        ? tenants.find(t => t.id === singleForm.recipientId)
        : owners.find(o => o.id === singleForm.recipientId);

    const totalAmount = singleForm.items.reduce((sum, it) => sum + Number(it.amount), 0);

    await createInvoice({
      recipientId: singleForm.recipientId,
      recipientName: targetRecipient ? `${targetRecipient.firstName} ${targetRecipient.lastName}` : 'ผู้พักอาศัย',
      recipientRole: singleForm.recipientRole,
      unitId: singleForm.unitId,
      unitNumber: targetUnit ? targetUnit.unitNumber : 'A-1205',
      billingCycle: singleForm.billingCycle,
      category: singleForm.category,
      items: singleForm.items,
      totalAmount,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: singleForm.dueDate,
      status: 'pending',
      note: singleForm.note,
    });

    setIsSingleModalOpen(false);
  };

  // Batch Form Submit
  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnits = units.filter(u =>
      batchForm.selectedBuilding === 'all' ? true : u.building === batchForm.selectedBuilding
    );

    await batchCreateInvoices(
      batchForm.billingCycle,
      batchForm.category,
      targetUnits.map(u => u.id)
    );

    setIsBatchModalOpen(false);
  };

  // Submit Payment for Invoice
  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceToPay) return;

    await submitPayment({
      invoiceId: invoiceToPay.id,
      paidAmount: Number(payForm.paidAmount),
      paymentDate: payForm.paymentDate,
      paymentTime: payForm.paymentTime,
      sourceBank: payForm.sourceBank,
      paymentMethod: payForm.paymentMethod,
      referenceNumber: payForm.referenceNumber,
      slipUrl: payForm.slipUrl,
      note: payForm.note,
    });

    setInvoiceToPay(null);
  };

  const handleExportCSV = () => {
    const data = filteredInvoices.map(i => ({
      'Invoice No': i.invoiceNumber,
      'ห้อง': i.unitNumber,
      'ผู้รับบิล': i.recipientName,
      'รอบบิล': i.billingCycle,
      'ประเภท': i.category,
      'ยอดรวม (บาท)': i.totalAmount,
      'วันครบกำหนด': i.dueDate,
      'สถานะ': i.status,
      'เลขที่ใบเสร็จ': i.receiptNumber || '-',
    }));
    exportToCSV(`CondoFlow_Invoices_${new Date().toISOString().slice(0, 10)}`, data);
    addToast('success', 'ส่งออกไฟล์ CSV สำเร็จ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            {isAdmin ? 'จัดการใบแจ้งหนี้และค่าใช้จ่ายโครงการ' : 'ใบแจ้งหนี้และประวัติการชำระเงินของฉัน'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'ออกใบแจ้งหนี้รายบุคคล แบบกลุ่ม ตรวจสอบสถานะ และดาวน์โหลดใบเสร็จรับเงิน'
              : 'ตรวจสอบค่าเช่า ค่าน้ำ ค่าไฟ และแจ้งชำระเงินออนไลน์พร้อมแนบหลักฐาน'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors shadow-xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>ออกบิลแบบกลุ่ม (Batch)</span>
              </button>

              <button
                onClick={() => setIsSingleModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>ออกใบแจ้งหนี้ใหม่</span>
              </button>
            </>
          )}

          {isAdmin && (
            <button
              onClick={() => navigateTo('/admin/payments')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>คิวตรวจสลิป</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">ยอดเรียกเก็บรวม ({filteredInvoices.length} ใบ)</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-heading mt-0.5">
              {formatCurrency(totalBilled)}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">ชำระแล้ว (Paid)</span>
            <div className="text-xl font-bold text-emerald-600 font-heading mt-0.5">
              {formatCurrency(totalPaid)}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">รอชำระ / รอตรวจ</span>
            <div className="text-xl font-bold text-rose-600 font-heading mt-0.5">
              {formatCurrency(totalUnpaid)}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="all">ทุกประเภทค่าใช้จ่าย</option>
            <option value="rent">ค่าเช่าห้องชุด</option>
            <option value="common_fee">ค่าส่วนกลาง</option>
            <option value="water">ค่าน้ำประปา</option>
            <option value="electric">ค่าไฟฟ้า</option>
            <option value="penalty">ค่าปรับ</option>
            <option value="damage">ค่าเสียหาย</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="all">ทุกสถานะใบแจ้งหนี้</option>
            <option value="pending">รอชำระ (Pending)</option>
            <option value="verifying">รอตรวจสอบ (Verifying)</option>
            <option value="paid">ชำระแล้ว (Paid)</option>
            <option value="overdue">เกินกำหนด (Overdue)</option>
            <option value="cancelled">ยกเลิก (Cancelled)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหาเลขที่บิล, เลขห้อง, ชื่อผู้รับ..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                <th className="py-3 px-4">เลขที่ใบแจ้งหนี้</th>
                <th className="py-3 px-4">ห้องชุด</th>
                <th className="py-3 px-4">ผู้รับใบแจ้งหนี้</th>
                <th className="py-3 px-4">รอบบิล</th>
                <th className="py-3 px-4">ประเภท</th>
                <th className="py-3 px-4">ยอดรวม</th>
                <th className="py-3 px-4">วันครบกำหนด</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-brand-600 dark:text-brand-400">
                    ห้อง {inv.unitNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                    {inv.recipientName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {inv.billingCycle}
                  </td>
                  <td className="py-3 px-4 text-slate-500 capitalize">
                    {inv.category.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {formatCurrency(inv.totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {formatThaiDate(inv.dueDate, { short: true })}
                  </td>
                  <td className="py-3 px-4">
                    {getInvoiceStatusBadge(inv.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Tenant/Owner Submit Payment Button */}
                      {(isTenant || isOwner) && (inv.status === 'pending' || inv.status === 'due_soon' || inv.status === 'overdue') && (
                        <button
                          onClick={() => {
                            setInvoiceToPay(inv);
                            setPayForm({
                              ...payForm,
                              paidAmount: inv.totalAmount,
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        >
                          แจ้งชำระเงิน
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedInvoiceForView(inv)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="ดูใบแจ้งหนี้ / พิมพ์"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isAdmin && inv.status !== 'paid' && inv.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelInvoice(inv.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="ยกเลิกใบแจ้งหนี้"
                        >
                          <XCircle className="w-4 h-4" />
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

      {/* Tenant Submit Payment Modal (FR-06 Flow) */}
      {invoiceToPay && (
        <Modal
          isOpen={!!invoiceToPay}
          onClose={() => setInvoiceToPay(null)}
          title={`แจ้งชำระเงิน: ${invoiceToPay.invoiceNumber}`}
          description={`ห้อง ${invoiceToPay.unitNumber} ยอดตามบิล: ${formatCurrency(invoiceToPay.totalAmount)}`}
          maxWidth="lg"
          footer={
            <>
              <button
                type="button"
                onClick={() => setInvoiceToPay(null)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handlePaySubmit}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow"
              >
                ยืนยันการแจ้งชำระเงิน
              </button>
            </>
          }
        >
          <form onSubmit={handlePaySubmit} className="space-y-3.5 text-xs">
            <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <div>
                <span className="text-brand-700 dark:text-brand-300 font-semibold block">ยอดที่ต้องชำระตามใบแจ้งหนี้:</span>
                <span className="text-[11px] text-slate-500">กรุณาตรวจสอบยอดเงินในสลิปให้ตรงกัน</span>
              </div>
              <span className="text-lg font-bold text-brand-600 font-heading">
                {formatCurrency(invoiceToPay.totalAmount)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">จำนวนเงินที่โอน (บาท) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payForm.paidAmount}
                  onChange={e => setPayForm({ ...payForm, paidAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ธนาคารต้นทาง <span className="text-rose-500">*</span></label>
                <select
                  value={payForm.sourceBank}
                  onChange={e => setPayForm({ ...payForm, sourceBank: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="ธนาคารกสิกรไทย (KBANK)">ธนาคารกสิกรไทย (KBANK)</option>
                  <option value="ธนาคารไทยพาณิชย์ (SCB)">ธนาคารไทยพาณิชย์ (SCB)</option>
                  <option value="ธนาคารกรุงเทพ (BBL)">ธนาคารกรุงเทพ (BBL)</option>
                  <option value="ธนาคารกรุงไทย (KTB)">ธนาคารกรุงไทย (KTB)</option>
                  <option value="พร้อมเพย์ PromptPay">พร้อมเพย์ PromptPay</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">วันที่โอนเงิน</label>
                <input
                  type="date"
                  required
                  value={payForm.paymentDate}
                  onChange={e => setPayForm({ ...payForm, paymentDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">เวลาที่โอน (น.)</label>
                <input
                  type="time"
                  required
                  value={payForm.paymentTime}
                  onChange={e => setPayForm({ ...payForm, paymentTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">เลขอ้างอิงสลิป / Transaction No.</label>
              <input
                type="text"
                required
                value={payForm.referenceNumber}
                onChange={e => setPayForm({ ...payForm, referenceNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">แนบหลักฐานสลิปการโอนเงิน (JPG, PNG, PDF &lt; 5MB)</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <img
                  src={payForm.slipUrl}
                  alt="Slip preview"
                  className="w-14 h-14 object-cover rounded-lg border shadow-xs"
                />
                <div className="text-slate-500 text-[11px]">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">slip_transfer_receipt.jpg (245 KB)</p>
                  <p className="text-emerald-600">จำลองอัปโหลดสำเร็จแล้ว พร้อมตรวจสอบ</p>
                </div>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Printable Invoice PDF Preview Modal */}
      {selectedInvoiceForView && (
        <Modal
          isOpen={!!selectedInvoiceForView}
          onClose={() => setSelectedInvoiceForView(null)}
          title={`ใบแจ้งหนี้ / ใบเสร็จ: ${selectedInvoiceForView.invoiceNumber}`}
          description={`ห้อง ${selectedInvoiceForView.unitNumber} • รอบ ${selectedInvoiceForView.billingCycle}`}
          maxWidth="2xl"
          footer={
            <>
              <button
                type="button"
                onClick={() => setSelectedInvoiceForView(null)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>พิมพ์ใบแจ้งหนี้ (Print)</span>
              </button>
            </>
          }
        >
          <div className="p-6 bg-white text-slate-900 rounded-xl border border-slate-200 space-y-5 text-xs font-serif leading-relaxed">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-base font-bold font-heading">นิติบุคคลอาคารชุด คอนโดโฟลว์ พระราม 9</h2>
                <p className="text-[11px] text-slate-500">เลขประจำตัวผู้เสียภาษี 0105569001234</p>
                <p className="text-[11px] text-slate-500">ชั้น 1 อาคาร A โครงการ CondoFlow ถ.พระราม 9 ห้วยขวาง กทม. 10310</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm font-heading block">
                  {selectedInvoiceForView.status === 'paid' ? 'ใบเสร็จรับเงิน (RECEIPT)' : 'ใบแจ้งหนี้ (INVOICE)'}
                </span>
                <span className="font-mono text-slate-700 font-bold block">{selectedInvoiceForView.invoiceNumber}</span>
                {selectedInvoiceForView.receiptNumber && (
                  <span className="font-mono text-emerald-600 block">เลขที่ใบเสร็จ: {selectedInvoiceForView.receiptNumber}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-slate-500">เรียน:</p>
                <p className="font-bold">{selectedInvoiceForView.recipientName}</p>
                <p>ห้องชุดเลขที่: <strong>{selectedInvoiceForView.unitNumber}</strong></p>
              </div>
              <div className="text-right">
                <p>รอบบิล: <strong>{selectedInvoiceForView.billingCycle}</strong></p>
                <p>วันออกใบแจ้งหนี้: {formatThaiDate(selectedInvoiceForView.issueDate)}</p>
                <p>วันครบกำหนดชำระ: <strong className="text-rose-600">{formatThaiDate(selectedInvoiceForView.dueDate)}</strong></p>
              </div>
            </div>

            <table className="w-full text-left border">
              <thead>
                <tr className="bg-slate-100 border-b">
                  <th className="py-2 px-3">ลำดับ</th>
                  <th className="py-2 px-3">รายการค่าใช้จ่าย</th>
                  <th className="py-2 px-3 text-right">จำนวนเงิน (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedInvoiceForView.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 text-center">{idx + 1}</td>
                    <td className="py-2 px-3">{item.description}</td>
                    <td className="py-2 px-3 text-right">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-bold bg-slate-50">
                  <td colSpan={2} className="py-2 px-3 text-right">ยอดรวมสุทธิ (Total Due):</td>
                  <td className="py-2 px-3 text-right text-brand-600 text-sm">
                    {formatCurrency(selectedInvoiceForView.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="pt-4 border-t text-[11px] text-slate-500 space-y-1">
              <p><strong>ช่องทางการชำระเงิน:</strong> บัญชี นิติบุคคลอาคารชุด คอนโดโฟลว์ พระราม 9</p>
              <p>ธนาคารกสิกรไทย เลขที่บัญชี: 123-4-56789-0 หรือ PromptPay QR Code นิติบุคคล</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Batch Create Invoices Modal */}
      {isBatchModalOpen && (
        <Modal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          title="ออกใบแจ้งหนี้แบบกลุ่มพร้อมกันหลายห้อง (Batch Generator)"
          description="สร้างใบแจ้งหนี้ค่าส่วนกลางหรือค่าใช้จ่ายประจำงวดอัตโนมัติ"
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsBatchModalOpen(false)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleBatchSubmit}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow"
              >
                สร้างใบแจ้งหนี้แบบกลุ่ม
              </button>
            </>
          }
        >
          <form className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">รอบบิลที่จะออก</label>
              <input
                type="text"
                value={batchForm.billingCycle}
                onChange={e => setBatchForm({ ...batchForm, billingCycle: e.target.value })}
                placeholder="เช่น ไตรมาส 1/2570 หรือ ธันวาคม 2569"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">ประเภทค่าใช้จ่าย</label>
              <select
                value={batchForm.category}
                onChange={e => setBatchForm({ ...batchForm, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="common_fee">ค่าส่วนกลาง (คำนวณตามขนาด ตร.ม. x 50 บาท x 3 เดือน)</option>
                <option value="rent">ค่าเช่าห้องชุด</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">กลุ่มเป้าหมายห้องชุด</label>
              <select
                value={batchForm.selectedBuilding}
                onChange={e => setBatchForm({ ...batchForm, selectedBuilding: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="all">ทุกอาคาร (ทั้งอาคาร A และ อาคาร B รวม 20 ห้อง)</option>
                <option value="A">เฉพาะอาคาร A (10 ห้อง)</option>
                <option value="B">เฉพาะอาคาร B (10 ห้อง)</option>
              </select>
            </div>
          </form>
        </Modal>
      )}

      {/* Single Invoice Create Modal */}
      {isSingleModalOpen && (
        <Modal
          isOpen={isSingleModalOpen}
          onClose={() => setIsSingleModalOpen(false)}
          title="ออกใบแจ้งหนี้ใหม่รายบุคคล"
          maxWidth="lg"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsSingleModalOpen(false)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSingleSubmit}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow"
              >
                ออกใบแจ้งหนี้
              </button>
            </>
          }
        >
          <form className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">ผู้รับใบแจ้งหนี้</label>
                <select
                  value={singleForm.recipientRole}
                  onChange={e => setSingleForm({ ...singleForm, recipientRole: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="tenant">ผู้เช่า (Tenant)</option>
                  <option value="owner">เจ้าของห้อง (Owner)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">เลือกห้องชุด</label>
                <select
                  value={singleForm.unitId}
                  onChange={e => setSingleForm({ ...singleForm, unitId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  {units.map(u => (
                    <option key={u.id} value={u.id}>ห้อง {u.unitNumber} (อาคาร {u.building})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">รอบบิล</label>
                <input
                  type="text"
                  value={singleForm.billingCycle}
                  onChange={e => setSingleForm({ ...singleForm, billingCycle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">วันครบกำหนดชำระ</label>
                <input
                  type="date"
                  value={singleForm.dueDate}
                  onChange={e => setSingleForm({ ...singleForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">รายการและจำนวนเงิน (บาท)</label>
              <div className="space-y-2">
                {singleForm.items.map((it, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={it.description}
                      onChange={e => {
                        const newItems = [...singleForm.items];
                        newItems[idx].description = e.target.value;
                        setSingleForm({ ...singleForm, items: newItems });
                      }}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={it.amount}
                      onChange={e => {
                        const newItems = [...singleForm.items];
                        newItems[idx].amount = Number(e.target.value);
                        setSingleForm({ ...singleForm, items: newItems });
                      }}
                      className="w-28 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
