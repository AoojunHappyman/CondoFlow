import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Shield,
  Download,
  Clock,
  Laptop,
  Globe,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatThaiDate, exportToCSV } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';

export const AuditLogPage: React.FC = () => {
  const { auditLogs, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchMod = selectedModule === 'all' || log.module === selectedModule;
    const matchSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.newValue && log.newValue.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchMod && matchSearch;
  });

  const handleExportCSV = () => {
    const data = filteredLogs.map(l => ({
      'Timestamp': l.timestamp,
      'Actor': l.actorName,
      'Role': l.role,
      'Action': l.action,
      'Module': l.module,
      'Record ID': l.recordId,
      'Old Value': l.oldValue || '-',
      'New Value': l.newValue || '-',
      'IP Address': l.ipAddress,
      'Device': l.device,
    }));
    exportToCSV(`CondoFlow_AuditLog_${new Date().toISOString().slice(0, 10)}`, data);
    addToast('success', 'ส่งออกบันทึก Audit Log เป็นไฟล์ CSV เรียบร้อยแล้ว');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2.5">
            <History className="w-6 h-6 text-brand-600" />
            Audit Log (บันทึกกิจกรรมและการเปลี่ยนแปลงระบบ)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            บันทึกการทำธุรกรรมความปลอดภัย การเข้าสู่ระบบ การอนุมัติ และการแก้ไขข้อมูลย้อนหลัง (Read-Only บังคับใช้ตามมาตรฐานความปลอดภัย)
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-emerald-400 block">Immutable Audit Trail Guaranteed</span>
            <span className="text-slate-300">
              ข้อมูล Audit Log ได้รับการบันทึกแบบ Append-only ไม่สามารถแก้ไขหรือลบผ่านหน้าจอผู้ใช้งานได้ เพื่อความโปร่งใสและตรวจสอบย้อนหลังได้ 5 ปี
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 shrink-0">
          {auditLogs.length} Events Logged
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <select
            value={selectedModule}
            onChange={e => setSelectedModule(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            <option value="all">ทุกโมดูลระบบ ({auditLogs.length})</option>
            <option value="users">ผู้ใช้งานและการเข้าสู่ระบบ (users)</option>
            <option value="units">ห้องชุด (units)</option>
            <option value="owners">เจ้าของห้อง (owners)</option>
            <option value="tenants">ผู้เช่า (tenants)</option>
            <option value="contracts">สัญญาเช่า (contracts)</option>
            <option value="invoices">ใบแจ้งหนี้ (invoices)</option>
            <option value="payments">การชำระเงิน (payments)</option>
            <option value="repairs">งานแจ้งซ่อม (repairs)</option>
            <option value="parcels">พัสดุ (parcels)</option>
            <option value="announcements">ประกาศ (announcements)</option>
            <option value="roles">บทบาทและสิทธิ์ (roles)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ค้นหากิจกรรม, ผู้ดำเนินการ, Record ID..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase">
                <th className="py-3 px-4">วันและเวลา (Timestamp)</th>
                <th className="py-3 px-4">ผู้ดำเนินการ / บทบาท</th>
                <th className="py-3 px-4">กิจกรรม (Action)</th>
                <th className="py-3 px-4">โมดูล</th>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">รายละเอียดการเปลี่ยนแปลง</th>
                <th className="py-3 px-4">IP / Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-sans">
                    {formatThaiDate(log.timestamp, { includeTime: true })}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-slate-900 dark:text-white">{log.actorName}</div>
                    <div className="text-[10px] text-slate-400">{log.role}</div>
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-800 dark:text-slate-200">
                    {log.action}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-brand-600 dark:text-brand-400 font-bold">
                    {log.recordId}
                  </td>
                  <td className="py-3 px-4 max-w-xs font-sans text-slate-600 dark:text-slate-300 truncate">
                    {log.newValue || log.oldValue || '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-sans text-[10px]">
                    <div>{log.ipAddress}</div>
                    <div className="truncate max-w-[120px]">{log.device}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
