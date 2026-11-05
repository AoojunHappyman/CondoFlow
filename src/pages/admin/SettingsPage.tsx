import React, { useState } from 'react';
import {
  Settings,
  RotateCcw,
  ShieldAlert,
  Clock,
  Server,
  Lock,
  Database,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  FileQuestion,
  AlertOctagon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const SettingsPage: React.FC = () => {
  const {
    resetDemoData,
    isMaintenanceMode,
    setMaintenanceMode,
    setSessionTimeoutWarning,
    navigateTo,
    addToast,
  } = useApp();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setIsResetConfirmOpen(false);
  };

  const handleTestTimeout = () => {
    setSessionTimeoutWarning(true);
    addToast('warning', 'จำลองการเตือน Session Timeout แล้ว', 'หน้าต่างเตือนหมดอายุแสดงขึ้นแล้ว');
  };

  const handleToggleMaintenance = () => {
    const nextState = !isMaintenanceMode;
    setMaintenanceMode(nextState);
    if (nextState) {
      addToast('warning', 'เปิดโหมดบำรุงรักษาแล้ว (Maintenance Mode Active)');
    } else {
      addToast('info', 'ปิดโหมดบำรุงรักษาแล้ว');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-brand-600" />
          ตั้งค่าระบบและสถาปัตยกรรม (System Settings & Non-Functional Architecture)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          เครื่องมือควบคุม Prototype, รีเซ็ตข้อมูลจำลอง และเอกสารข้อกำหนด Non-Functional Requirements
        </p>
      </div>

      {/* Prototype Control Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-brand-600" />
          เครื่องมือทดสอบการทำงานของ Prototype (Simulation Controls)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Reset Demo Data */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">รีเซ็ตข้อมูล Mock Data</span>
              <p className="text-[11px] text-slate-500 mt-1">
                ล้างข้อมูลใน Local Storage และคืนค่า Mock Data 20 ห้องชุด, 10 สัญญา, 20 บิล, 10 งานซ่อม
              </p>
            </div>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="w-full py-2 px-3 rounded-xl font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>

          {/* Maintenance Mode Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Maintenance Mode</span>
              <p className="text-[11px] text-slate-500 mt-1">
                จำลองหน้าจอระบบปิดปรับปรุง (503 Service Unavailable) ตามเป้าหมาย 99% SLA
              </p>
            </div>
            <button
              onClick={handleToggleMaintenance}
              className={`w-full py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                isMaintenanceMode
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isMaintenanceMode ? 'เปิดใช้งานอยู่ (คลิกเพื่อปิด)' : 'จำลองเปิดโหมดปิดปรับปรุง'}</span>
            </button>
          </div>

          {/* Session Timeout Simulator */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Session Timeout Warning</span>
              <p className="text-[11px] text-slate-500 mt-1">
                จำลองการตรวจจับไม่มีการเคลื่อนไหว 30 นาที และแสดงหน้าต่างเตือนพร้อมนับถอยหลัง 60 วิ
              </p>
            </div>
            <button
              onClick={handleTestTimeout}
              className="w-full py-2 px-3 rounded-xl font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>ทดสอบเตือน Session หมดอายุ</span>
            </button>
          </div>
        </div>

        {/* Test Error Routes */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex flex-wrap items-center gap-3">
          <span className="text-slate-500 font-medium">ทดลองดูหน้า Error Pages:</span>
          <button
            onClick={() => navigateTo('/error/403')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[11px] flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3 text-rose-500" />
            <span>403 Forbidden</span>
          </button>
          <button
            onClick={() => navigateTo('/error/404')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[11px] flex items-center gap-1"
          >
            <FileQuestion className="w-3 h-3 text-amber-500" />
            <span>404 Not Found</span>
          </button>
          <button
            onClick={() => navigateTo('/error/500')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[11px] flex items-center gap-1"
          >
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            <span>500 Server Error</span>
          </button>
        </div>
      </div>

      {/* Production Architecture & Non-Functional Compliance Notes (Section 27) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div>
          <h3 className="font-heading font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            แนวทางการบังคับใช้สำหรับระบบจริง (Production Architecture & Non-Functional Requirements)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            สรุปการออกแบบด้านประสิทธิภาพ ความปลอดภัย การสำรองข้อมูล และ SLA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs leading-relaxed">
          {/* 27.1 Performance */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              27.1 ประสิทธิภาพ (Performance & Scalability)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              <li>รองรับผู้ใช้งานพร้อมกัน (Concurrent Users) อย่างน้อย 100 คน</li>
              <li>เวลาตอบสนองการทำรายการทั่วไปไม่เกิน 3 วินาที (Latency &lt; 3s)</li>
              <li>ใช้ระบบ Pagination และ Lazy Loading หลีกเลี่ยงการ Render ข้อมูลพร้อมกันจำนวนมาก</li>
              <li>ใช้ Skeleton Loading จำลอง Latency 300-500ms ระหว่างโหลดข้อมูล</li>
              <li>ช่องค้นหาใช้เทคนิค Debouncing ลดการส่ง Query ถี่เกินไป</li>
            </ul>
          </div>

          {/* 27.2 Availability */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              27.2 ความพร้อมใช้งาน (High Availability)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              <li>เป้าหมายความพร้อมใช้งาน (Availability SLA) ไม่น้อยกว่า 99.0%</li>
              <li>จัดทำหน้า Maintenance Mode สำหรับช่วงเวลาอัปเกรดฐานข้อมูลประจำเดือน</li>
              <li>หน้าจัดการ Error 404, 403 และ 500 พร้อมปุ่ม Retry กู้คืนการทำงาน</li>
              <li>รองรับสภาวะ Offline / Network Disconnected พร้อมการแจ้งเตือน</li>
            </ul>
          </div>

          {/* 27.3 Security */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              27.3 ความปลอดภัย (Security & Compliance)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              <li>Role-Based Access Control (RBAC) บังคับใช้ทั้งเมนู URL และ API Endpoint ใน Server</li>
              <li>รหัสผ่านต้องผ่านการ Hash ด้วย bcrypt / Argon2 ที่ Server-side เสมอ</li>
              <li>การสื่อสารผ่านโปรโตคอลเข้ารหัส HTTPS / TLS 1.3 เท่านั้น</li>
              <li>มาตรการคุ้มครองข้อมูลส่วนบุคคล (PDPA): Masking เลขบัตรประชาชนและเบอร์โทรศัพท์</li>
              <li>ตัดสิทธิ์ Session อัตโนมัติหลังไม่มีการใช้งาน 30 นาที และปุ่ม Logout All Devices</li>
            </ul>
          </div>

          {/* 27.4 Backup & Retention */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              27.4 การสำรองและกู้คืนข้อมูล (Backup & Retention)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              <li>สำรองฐานข้อมูลอัตโนมัติประจำวัน (Daily Automated Backup) และเก็บข้าม Availability Zones</li>
              <li>เก็บสำเนาสำรองแบบ Multi-version (Daily 30 วัน, Monthly 12 เดือน)</li>
              <li>ทดสอบขั้นตอน Disaster Recovery (DR Drill) ทุกไตรมาส</li>
              <li>จัดเก็บประวัติการเงิน ใบแจ้งหนี้ ใบเสร็จ และงานแจ้งซ่อมอย่างน้อย 5 ปี ตามระเบียบข้อกฎหมายอาคารชุด</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleReset}
        title="ยืนยันการรีเซ็ตข้อมูล Mock Data"
        message="การดำเนินการนี้จะลบข้อมูลที่บันทึกไว้ใน Local Storage ทั้งหมด และคืนค่าเริ่มต้นสำหรับทดสอบระบบ ท่านแน่ใจหรือไม่?"
        confirmLabel="ยืนยันการรีเซ็ต"
        variant="danger"
      />
    </div>
  );
};
