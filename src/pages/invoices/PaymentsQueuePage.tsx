import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  Receipt,
  FileCheck,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Payment } from '../../types';
import { formatCurrency, formatThaiDate } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const PaymentsQueuePage: React.FC = () => {
  const { payments, verifyPayment, addToast } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('pending_verification');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected payment for verification
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [internalNote, setInternalNote] = useState('');

  const filteredPayments = payments.filter(p => {
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchSearch =
      p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleApprove = async (paymentId: string) => {
    await verifyPayment(paymentId, true, undefined, internalNote);
    setSelectedPayment(null);
    setInternalNote('');
  };

  const handleReject = async (paymentId: string) => {
    if (!rejectionReason.trim()) {
      addToast('error', 'กรุณาระบุเหตุผลในการปฏิเสธการชำระเงิน');
      return;
    }
    await verifyPayment(paymentId, false, rejectionReason, internalNote);
    setSelectedPayment(null);
    setIsRejecting(false);
    setRejectionReason('');
    setInternalNote('');
  };

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'pending_verification':
        return <Badge variant="warning" dot>รอการตรวจสอบ (Pending)</Badge>;
      case 'approved':
        return <Badge variant="success" dot>อนุมัติแล้ว (Approved)</Badge>;
      case 'rejected':
        return <Badge variant="danger" dot>ถูกปฏิเสธ (Rejected)</Badge>;
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
            คิวตรวจสอบและยืนยันการชำระเงิน (Payment Verification Queue)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ตรวจสอบสลิปโอนเงิน อนุมัติการชำระเงินเพื่อออกใบเสร็จรับเงิน หรือปฏิเสธพร้อมระบุเหตุผล
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="pending_verification">รอการตรวจสอบ (Pending Queue)</option>
            <option value="approved">อนุมัติแล้ว (Approved)</option>
            <option value="rejected">ถูกปฏิเสธ (Rejected)</option>
            <option value="all">รายการชำระเงินทั้งหมด</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหาเลขบิล, ห้อง, ชื่อผู้ชำระ..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                <th className="py-3 px-4">สลิปโอนเงิน</th>
                <th className="py-3 px-4">เลขที่แจ้งชำระ</th>
                <th className="py-3 px-4">ห้องชุด / ผู้ชำระ</th>
                <th className="py-3 px-4">เลขที่ใบแจ้งหนี้</th>
                <th className="py-3 px-4">ยอดเงิน</th>
                <th className="py-3 px-4">วันเวลาที่โอน</th>
                <th className="py-3 px-4">ธนาคาร / ช่องทาง</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayments.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <img
                      src={pay.slipUrl}
                      alt="Slip"
                      onClick={() => setSelectedPayment(pay)}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 cursor-pointer hover:scale-110 transition-transform shadow-xs"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {pay.paymentNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-brand-600 dark:text-brand-400">ห้อง {pay.unitNumber}</div>
                    <div className="text-[11px] text-slate-500">{pay.payerName}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                    {pay.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600 text-sm">
                    {formatCurrency(pay.paidAmount)}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    <div>{pay.paymentDate}</div>
                    <div className="text-[10px] text-slate-400">{pay.paymentTime} น.</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    <div>{pay.sourceBank}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{pay.referenceNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(pay.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPayment(pay)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 hover:bg-brand-100 transition-colors"
                      >
                        ตรวจสอบ
                      </button>

                      {pay.status === 'pending_verification' && (
                        <button
                          onClick={() => handleApprove(pay.id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          title="อนุมัติทันที"
                        >
                          <Check className="w-4 h-4" />
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

      {/* Slip Verification Modal */}
      {selectedPayment && (
        <Modal
          isOpen={!!selectedPayment}
          onClose={() => {
            setSelectedPayment(null);
            setIsRejecting(false);
          }}
          title={`ตรวจสอบหลักฐานการชำระเงิน: ${selectedPayment.paymentNumber}`}
          description={`ห้อง ${selectedPayment.unitNumber} • ผู้ชำระ: ${selectedPayment.payerName}`}
          maxWidth="xl"
          footer={
            selectedPayment.status === 'pending_verification' ? (
              !isRejecting ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsRejecting(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-300 dark:border-rose-800"
                  >
                    ปฏิเสธการชำระเงิน
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedPayment.id)}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow"
                  >
                    อนุมัติการชำระเงิน (ออกใบเสร็จ)
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsRejecting(false)}
                    className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedPayment.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow"
                  >
                    ยืนยันการปฏิเสธ
                  </button>
                </>
              )
            ) : (
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                ปิดหน้าต่าง
              </button>
            )
          }
        >
          <div className="space-y-4 text-xs">
            {/* Slip Zoomable Image */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl flex justify-center max-h-72 overflow-hidden border border-slate-200 dark:border-slate-700">
              <img
                src={selectedPayment.slipUrl}
                alt="Slip Proof"
                className="max-h-64 object-contain rounded-xl shadow-md hover:scale-125 transition-transform cursor-zoom-in"
              />
            </div>

            {/* Verification Comparison Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400">เลขที่ใบแจ้งหนี้:</span>
                <span className="block font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">ยอดตามใบแจ้งหนี้:</span>
                <span className="block font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(selectedPayment.invoiceAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400">ยอดที่แจ้งโอน:</span>
                <span className="block font-bold text-emerald-600 text-sm">{formatCurrency(selectedPayment.paidAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400">วันเวลาที่โอน:</span>
                <span className="block font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.paymentDate} เวลา {selectedPayment.paymentTime} น.</span>
              </div>
              <div>
                <span className="text-slate-400">ธนาคาร:</span>
                <span className="block text-slate-700 dark:text-slate-300">{selectedPayment.sourceBank}</span>
              </div>
              <div>
                <span className="text-slate-400">เลขอ้างอิง:</span>
                <span className="block font-mono text-slate-700 dark:text-slate-300">{selectedPayment.referenceNumber}</span>
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">หมายเหตุภายใน (Internal Note)</label>
              <input
                type="text"
                value={internalNote}
                onChange={e => setInternalNote(e.target.value)}
                placeholder="เช่น ตรวจสอบยอดเงินเข้าบัญชีเรียบร้อย..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            {/* Rejection Reason Form */}
            {isRejecting && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 space-y-2">
                <label className="block text-xs font-semibold text-rose-800 dark:text-rose-200">
                  ระบุเหตุผลที่ปฏิเสธการชำระเงิน <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="เช่น ยอดเงินที่โอนไม่ตรงกับบิล, ภาพสลิปตัดขอบไม่เห็นเวลา, เลขอ้างอิงซ้ำ..."
                  className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-rose-300 dark:border-rose-800 text-xs focus:outline-none"
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
