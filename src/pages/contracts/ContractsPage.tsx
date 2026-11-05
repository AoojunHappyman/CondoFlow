import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  Download,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Calendar,
  Building,
  User,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeaseContract, ContractStatus } from '../../types';
import { formatCurrency, formatThaiDate } from '../../lib/utils';
import { Badge, getContractStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const ContractsPage: React.FC = () => {
  const {
    contracts,
    units,
    owners,
    tenants,
    createContract,
    terminateContract,
    activeRole,
    currentUser,
    addToast,
  } = useApp();

  const isAdmin = activeRole === 'admin';
  const isOwner = activeRole === 'owner';
  const isTenant = activeRole === 'tenant';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedContractForView, setSelectedContractForView] = useState<LeaseContract | null>(null);
  const [contractToTerminate, setContractToTerminate] = useState<LeaseContract | null>(null);
  const [terminationReason, setTerminationReason] = useState('');

  // Create Form State
  const [form, setForm] = useState({
    unitId: units[0]?.id || '',
    ownerId: owners[0]?.id || '',
    tenantId: tenants[0]?.id || '',
    startDate: '2026-12-01',
    endDate: '2027-11-30',
    monthlyRent: 16000,
    depositAmount: 32000,
    paymentDueDay: 5,
    additionalTerms: 'ห้ามสูบบุหรี่ในห้องชุด ห้ามเลี้ยงสัตว์เลี้ยงทุกชนิด ผู้เช่ารับผิดชอบค่าน้ำและค่าไฟฟ้าตามจริง',
    status: 'active' as ContractStatus,
  });

  // Filtered Contracts
  const filteredContracts = contracts.filter(c => {
    // If tenant, only see own contract
    if (isTenant && c.tenantId !== currentUser?.id && c.unitNumber !== currentUser?.unitNumber) {
      return false;
    }
    // If owner, only see own units
    if (isOwner && !currentUser?.ownedUnitIds?.includes(c.unitId)) {
      return false;
    }

    const matchSearch =
      c.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUnit = units.find(u => u.id === form.unitId);
    const targetOwner = owners.find(o => o.id === form.ownerId);
    const targetTenant = tenants.find(t => t.id === form.tenantId);

    if (!targetUnit || !targetOwner || !targetTenant) {
      addToast('error', 'ข้อมูลไม่ครบถ้วน');
      return;
    }

    const res = await createContract({
      unitId: targetUnit.id,
      unitNumber: targetUnit.unitNumber,
      ownerId: targetOwner.id,
      ownerName: `${targetOwner.firstName} ${targetOwner.lastName}`,
      tenantId: targetTenant.id,
      tenantName: `${targetTenant.firstName} ${targetTenant.lastName}`,
      startDate: form.startDate,
      endDate: form.endDate,
      monthlyRent: form.monthlyRent,
      depositAmount: form.depositAmount,
      paymentDueDay: form.paymentDueDay,
      additionalTerms: form.additionalTerms,
      attachments: ['ร่างสัญญาเช่า.pdf'],
      status: form.status,
    });

    if (res.success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleTerminateSubmit = async () => {
    if (!contractToTerminate || !terminationReason.trim()) {
      addToast('error', 'กรุณาระบุเหตุผลในการยกเลิกสัญญา');
      return;
    }
    await terminateContract(contractToTerminate.id, terminationReason);
    setContractToTerminate(null);
    setTerminationReason('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            {isAdmin ? 'จัดการสัญญาเช่าห้องชุด (Lease Contracts)' : 'สัญญาเช่าห้องชุดของฉัน'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            สัญญาเช่าที่มีผลใช้งาน ใกล้หมดอายุ ฉบับร่าง และประวัติการยกเลิกสัญญา
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ทำสัญญาเช่าใหม่</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
          >
            <option value="all">ทุกสถานะสัญญา</option>
            <option value="active">มีผลใช้งาน (Active)</option>
            <option value="expiring_soon">ใกล้หมดอายุ (Expiring Soon)</option>
            <option value="pending_start">รอเริ่มสัญญา (Pending)</option>
            <option value="draft">ฉบับร่าง (Draft)</option>
            <option value="expired">หมดอายุ (Expired)</option>
            <option value="terminated">ยกเลิกแล้ว (Terminated)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหาเลขที่สัญญา, เลขห้อง, ผู้เช่า..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                <th className="py-3 px-4">เลขที่สัญญา</th>
                <th className="py-3 px-4">ห้องชุด</th>
                <th className="py-3 px-4">ผู้เช่า</th>
                <th className="py-3 px-4">เจ้าของห้อง</th>
                <th className="py-3 px-4">ระยะเวลาสัญญา</th>
                <th className="py-3 px-4">ค่าเช่า / มัดจำ</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredContracts.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {c.contractNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-brand-600 dark:text-brand-400">
                    ห้อง {c.unitNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {c.tenantName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {c.ownerName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    <div>{formatThaiDate(c.startDate, { short: true })} -</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{formatThaiDate(c.endDate, { short: true })}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{formatCurrency(c.monthlyRent)}/ด.</div>
                    <div className="text-[10px] text-slate-400">มัดจำ: {formatCurrency(c.depositAmount)}</div>
                  </td>
                  <td className="py-3 px-4">
                    {getContractStatusBadge(c.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedContractForView(c)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="ดูสัญญา / พิมพ์ PDF จำลอง"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isAdmin && (c.status === 'active' || c.status === 'expiring_soon') && (
                        <button
                          onClick={() => setContractToTerminate(c)}
                          className="px-2 py-1 rounded-lg text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800"
                        >
                          ยกเลิก/สิ้นสุด
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

      {/* Printable Simulated PDF Preview Modal */}
      {selectedContractForView && (
        <Modal
          isOpen={!!selectedContractForView}
          onClose={() => setSelectedContractForView(null)}
          title={`เอกสารสัญญาเช่าห้องชุด: ${selectedContractForView.contractNumber}`}
          description={`ห้อง ${selectedContractForView.unitNumber} โครงการ CondoFlow พระราม 9`}
          maxWidth="2xl"
          footer={
            <>
              <button
                type="button"
                onClick={() => setSelectedContractForView(null)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ปิดหน้าต่าง
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>พิมพ์เอกสาร (Print PDF)</span>
              </button>
            </>
          }
        >
          {/* Printable Layout */}
          <div className="p-6 bg-white text-slate-900 rounded-xl border border-slate-200 space-y-5 text-xs font-serif leading-relaxed">
            <div className="text-center border-b pb-4">
              <h2 className="text-lg font-bold font-heading">สัญญาเช่าห้องชุดเพื่ออยู่อาศัย</h2>
              <p className="text-xs text-slate-500 mt-1">โครงการ คอนโดโฟลว์ พระราม 9 (CondoFlow Rama 9)</p>
              <p className="font-mono text-xs font-bold text-slate-700 mt-1">เลขที่สัญญา: {selectedContractForView.contractNumber}</p>
            </div>

            <p>
              สัญญาฉบับนี้ทำขึ้น ณ นิติบุคคลอาคารชุด คอนโดโฟลว์ พระราม 9 เมื่อวันที่{' '}
              <strong>{formatThaiDate(selectedContractForView.createdAt || selectedContractForView.startDate)}</strong> ระหว่าง:
            </p>

            <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
              <p><strong>ผู้ให้เช่า (เจ้าของห้องชุด):</strong> คุณ {selectedContractForView.ownerName}</p>
              <p><strong>ผู้เช่า:</strong> คุณ {selectedContractForView.tenantName}</p>
              <p><strong>ทรัพย์สินที่เช่า:</strong> ห้องชุดเลขที่ <strong>{selectedContractForView.unitNumber}</strong></p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold">ข้อกำหนดและเงื่อนไขการเช่า:</h4>
              <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                <li>
                  <strong>ระยะเวลาการเช่า:</strong> มีกำหนด 1 ปี เริ่มตั้งแต่วันที่{' '}
                  <strong>{formatThaiDate(selectedContractForView.startDate)}</strong> ถึงวันที่{' '}
                  <strong>{formatThaiDate(selectedContractForView.endDate)}</strong>
                </li>
                <li>
                  <strong>อัตราค่าเช่า:</strong> ตกลงชำระค่าเช่าในอัตราเดือนละ{' '}
                  <strong>{formatCurrency(selectedContractForView.monthlyRent)}</strong> โดยกำหนดชำระภายในวันที่{' '}
                  {selectedContractForView.paymentDueDay} ของทุกเดือน
                </li>
                <li>
                  <strong>เงินประกันความเสียหาย:</strong> ผู้เช่าได้วางเงินประกันสัญญาจำนวน{' '}
                  <strong>{formatCurrency(selectedContractForView.depositAmount)}</strong> ไว้แก่ผู้ให้เช่าแล้ว
                </li>
                <li>
                  <strong>ข้อกำหนดเพิ่มเติม:</strong> {selectedContractForView.additionalTerms}
                </li>
              </ol>
            </div>

            <div className="pt-8 grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="border-b border-dotted border-slate-400 w-3/4 mx-auto mb-2" />
                <p>ลงชื่อ ({selectedContractForView.ownerName})</p>
                <p className="text-[10px] text-slate-400">ผู้ให้เช่า</p>
              </div>
              <div>
                <div className="border-b border-dotted border-slate-400 w-3/4 mx-auto mb-2" />
                <p>ลงชื่อ ({selectedContractForView.tenantName})</p>
                <p className="text-[10px] text-slate-400">ผู้เช่า</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Contract Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="สร้างสัญญาเช่าห้องชุดฉบับใหม่"
          description="ทำสัญญาเช่าพร้อมตรวจสอบสถานะห้องว่างและเชื่อมโยงผู้เช่า"
          maxWidth="2xl"
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
                บันทึกและเปิดใช้งานสัญญา
              </button>
            </>
          }
        >
          <form className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">เลือกห้องชุด <span className="text-rose-500">*</span></label>
                <select
                  value={form.unitId}
                  onChange={e => {
                    const u = units.find(unit => unit.id === e.target.value);
                    setForm({
                      ...form,
                      unitId: e.target.value,
                      monthlyRent: u ? u.rentPrice : form.monthlyRent,
                      depositAmount: u ? u.rentPrice * 2 : form.depositAmount,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  {units.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.unitNumber} ({u.status === 'vacant' ? 'ว่าง' : u.status}) - {formatCurrency(u.rentPrice)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">เลือกเจ้าของห้อง <span className="text-rose-500">*</span></label>
                <select
                  value={form.ownerId}
                  onChange={e => setForm({ ...form, ownerId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  {owners.map(o => (
                    <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">เลือกผู้เช่า <span className="text-rose-500">*</span></label>
                <select
                  value={form.tenantId}
                  onChange={e => setForm({ ...form, tenantId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.status})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">วันเริ่มสัญญา</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">วันสิ้นสุดสัญญา</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">ค่าเช่ารายเดือน (บาท)</label>
                <input
                  type="number"
                  value={form.monthlyRent}
                  onChange={e => setForm({ ...form, monthlyRent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">เงินมัดจำประกัน (บาท)</label>
                <input
                  type="number"
                  value={form.depositAmount}
                  onChange={e => setForm({ ...form, depositAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">กำหนดชำระทุกวันที่</label>
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={form.paymentDueDay}
                  onChange={e => setForm({ ...form, paymentDueDay: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">เงื่อนไขเพิ่มเติม</label>
              <textarea
                rows={2}
                value={form.additionalTerms}
                onChange={e => setForm({ ...form, additionalTerms: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Terminate Contract Modal */}
      {contractToTerminate && (
        <Modal
          isOpen={!!contractToTerminate}
          onClose={() => setContractToTerminate(null)}
          title={`ยกเลิก/สิ้นสุดสัญญา ${contractToTerminate.contractNumber}`}
          description={`ห้อง ${contractToTerminate.unitNumber} ผู้เช่า: ${contractToTerminate.tenantName}`}
          maxWidth="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setContractToTerminate(null)}
                className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleTerminateSubmit}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow"
              >
                ยืนยันการสิ้นสุดสัญญา
              </button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              เมื่อสิ้นสุดสัญญา ระบบจะดำเนินการ:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>เปลี่ยนสถานะสัญญาเป็น "ยกเลิกแล้ว (Terminated)"</li>
              <li>ปรับปรุงสถานะห้องชุด <strong>{contractToTerminate.unitNumber}</strong> กลับเป็น "ว่าง (Vacant)"</li>
              <li>ปรับปรุงสถานะผู้เช่าเป็น "ย้ายออกแล้ว (Moved Out)"</li>
            </ul>

            <div className="pt-2">
              <label className="block text-slate-700 font-semibold mb-1">
                ระบุเหตุผลการสิ้นสุดสัญญา <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={terminationReason}
                onChange={e => setTerminationReason(e.target.value)}
                placeholder="เช่น ครบกำหนดระยะเวลาสัญญาและไม่ต่ออายุ, ผู้เช่าแจ้งย้ายออกล่วงหน้า..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
