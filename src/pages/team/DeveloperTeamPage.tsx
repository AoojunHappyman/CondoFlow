import React, { useState } from 'react';
import {
  Users,
  Code2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Globe,
  Mail,
  Award,
  BookOpen,
  Layers,
  Cpu,
  Database,
  Palette,
  Terminal,
  FileCheck,
  ArrowRight,
  ChevronRight,
  Heart,
  Star,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

interface TeamMember {
  id: string;
  nameEn: string;
  nameTh: string;
  role: string;
  roleTh: string;
  tagline: string;
  avatarColor: string;
  avatarBg: string;
  initials: string;
  icon: any;
  featuredBadge: string;
  bio: string;
  contributions: string[];
  skills: string[];
  quote: string;
  email: string;
  github: string;
  dfdFocus: string;
}

export const DeveloperTeamPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 'chayanin',
      nameEn: 'Chayanin Preechapanij',
      nameTh: 'ชยานิน ปรีชาพานิช',
      role: 'Project Manager & Full-Stack Architect',
      roleTh: 'ผู้จัดการโครงการและหัวหน้าสถาปัตยกรรมระบบ',
      tagline: 'ผู้นำทีม ออกแบบโครงสร้างระบบแกนหลัก และ Data Flow Diagram 7 กระบวนการ',
      avatarColor: 'text-purple-600 dark:text-purple-400',
      avatarBg: 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white',
      initials: 'CP',
      icon: Terminal,
      featuredBadge: 'Team Leader & Architect',
      bio: 'รับผิดชอบการวางสถาปัตยกรรมระบบโดยรวม (System Architecture) ของ CondoFlow ออกแบบกระบวนการทำงาน 7 ส่วนตาม Data Flow Diagram (DFD) พัฒนาระบบจัดการสถานะส่วนกลาง (Global State Engine) ร่วมกับ LocalStorage Persistence และดูแลการเงินระบบใบแจ้งหนี้แบบกลุ่ม (Batch Invoicing)',
      contributions: [
        'ออกแบบสถาปัตยกรรมโครงสร้างโปรเจกต์ React 19 + TypeScript + Vite แบบ Scalable SaaS',
        'วิเคราะห์และวางผัง Data Flow Diagram (DFD) ทั้ง 7 ส่วนครอบคลุมทุก Input/Output Data Stores',
        'พัฒนาระบบ Context Engine (AppContext.tsx) และ LocalStorage persistence สำหรับจัดเก็บข้อมูล 10+ Entity',
        'พัฒนาระบบออกใบแจ้งหนี้แบบกลุ่ม (Batch Invoicing) ประจำงวด และคิวตรวจสอบการชำระเงิน (Payments Queue)',
        'ควบคุมคุณภาพโค้ดและการส่งมอบให้ตรงตามเป้าหมายของระบบบริหารจัดการคอนโดมิเนียมยุคใหม่',
      ],
      skills: ['System Architecture', 'React 19', 'TypeScript', 'DFD Analysis', 'State Persistence', 'Batch Billing'],
      quote: 'มุ่งมั่นพัฒนาระบบการจัดการคอนโดมิเนียมที่ลดการใช้เอกสาร และเชื่อมต่อลูกบ้านกับนิติบุคคลอย่างไร้รอยต่อ',
      email: 'chayanin.pree@condoflow.local',
      github: 'github.com/chayanin-p',
      dfdFocus: 'DFD 1 (RBAC Engine) & DFD 3 (Billing & Invoices)',
    },
    {
      id: 'pattanachai',
      nameEn: 'Pattanachai Sawetbunchoed',
      nameTh: 'พัฒนชัย เศวตบุญเชิด',
      role: 'Senior Frontend Engineer & UI Architect',
      roleTh: 'วิศวกรส่วนหน้าอาวุโสและผู้ออกแบบสถาปัตยกรรม UI',
      tagline: 'เชี่ยวชาญ Component Engineering, Responsive Design และ Kanban Interactive',
      avatarColor: 'text-emerald-600 dark:text-emerald-400',
      avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white',
      initials: 'PS',
      icon: Code2,
      featuredBadge: 'Frontend Architecture',
      bio: 'ดูแลการสร้าง Component-driven Architecture ที่สามารถนำกลับมาใช้ซ้ำได้อย่างมีประสิทธิภาพ พัฒนาระบบแจ้งซ่อมบำรุงด้วยกระดาน Kanban Board 4 สถานะ พร้อมรองรับ Responsive Design สมบูรณ์แบบบน Desktop, Tablet และ Mobile Bottom Navigation Bar',
      contributions: [
        'ออกแบบและสร้างโครงสร้าง Component Hierarchy ด้วย Tailwind CSS และ Lucide React Icons',
        'พัฒนาระบบแจ้งซ่อมบำรุงห้องชุด (Maintenance Module) ด้วยกระดาน Kanban Board และมุมมอง Table View',
        'ออกแบบระบบ Mobile Navigation พร้อม Bottom Bar และ Slide-over Drawer อำนวยความสะดวกบนสมาร์ตโฟน',
        'จำลองระบบความหน่วง Network Latency (300-700ms) ร่วมกับ Skeleton Loading เพื่อสร้างประสบการณ์สมจริง',
        'พัฒนาระบบ Modal, Confirmation Dialogs และ Toast Notification Feedback แบบ Real-time',
      ],
      skills: ['React & TypeScript', 'Tailwind CSS', 'Kanban Board Logic', 'Mobile UX', 'Skeleton Loaders'],
      quote: 'ใส่ใจในทุกรายละเอียดการโต้ตอบ เพื่อมอบประสบการณ์การใช้งานที่ลื่นไหลและไร้สะดุดบนทุกหน้าจอ',
      email: 'pattanachai.saw@condoflow.local',
      github: 'github.com/pattanachai-s',
      dfdFocus: 'DFD 4 (Repairs & Maintenance Ticketing)',
    },
    {
      id: 'phattaranan',
      nameEn: 'Phattaranan Bunlalert',
      nameTh: 'ภัทรนันท์ บุญเลิศ',
      role: 'Lead UX/UI Designer & Design System Specialist',
      roleTh: 'หัวหน้านักออกแบบ UX/UI และระบบดีไซน์',
      tagline: 'สร้างสรรค์ Design System, Color Tokens และความสวยงามทันสมัยระดับสากล',
      avatarColor: 'text-pink-600 dark:text-pink-400',
      avatarBg: 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white',
      initials: 'PB',
      icon: Palette,
      featuredBadge: 'UX/UI & Design System',
      bio: 'ผู้ออกแบบประสบการณ์ผู้ใช้ (User Experience) และส่วนติดต่อผู้ใช้งาน (User Interface) ทั้งหมดของ CondoFlow คัดสรรโทนสี Design Tokens สไตล์ Modern Indigo/Slate พร้อมจัดวาง Typography ด้วยฟอนต์ภาษาไทยมาตรฐาน Prompt และ IBM Plex Sans Thai พร้อมระบบ Dark/Light Mode สมบูรณ์แบบ',
      contributions: [
        'ออกแบบ CondoFlow Design System กำหนดโทนสี Brand Indigo, Alert Badges และ Micro-interactions',
        'ออกแบบและปรับแต่งแดชบอร์ด 4 บทบาท (Admin, Tenant, Owner, General User) ให้ตอบโจทย์ผู้ใช้แต่ละกลุ่ม',
        'พัฒนาระบบ Theme Switcher สลับ Dark Mode และ Light Mode ได้อย่างราบรื่นและจำลองเก็บลง LocalStorage',
        'จัดทำหน้าจอรายละเอียดห้องชุด (Unit Detail) สไตล์พรีเมียม พร้อมแกลเลอรีรูปภาพและสเปกห้องพัก',
        'สร้าง Demo Role Switcher Bar ด้านบนสุดเพื่อความสะดวกในการตรวจประเมิน Prototype',
      ],
      skills: ['Design System', 'Dark Mode Architecture', 'Typography & Accessibility', 'Tailwind CSS', 'UX Research'],
      quote: 'ความสวยงามที่มาพร้อมกับฟังก์ชันการใช้งานที่เข้าใจง่าย คือหัวใจสำคัญของแอปพลิเคชันระดับองค์กร',
      email: 'phattaranan.bun@condoflow.local',
      github: 'github.com/phattaranan-b',
      dfdFocus: 'UX/UI Across All 7 Modules & Design Tokens',
    },
    {
      id: 'aunthikarn',
      nameEn: 'Aunthikarn Neamtang',
      nameTh: 'อันธิการ เนียมแตง',
      role: 'Senior Business Analyst & Requirements Engineer',
      roleTh: 'นักวิเคราะห์ระบบอาวุโสและวิศวกรข้อกำหนดทางธุรกิจ',
      tagline: 'วิเคราะห์กระบวนการทำงาน กำกับข้อกำหนด 25 FR และนโยบายความปลอดภัย RBAC',
      avatarColor: 'text-amber-600 dark:text-amber-400',
      avatarBg: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white',
      initials: 'AN',
      icon: BookOpen,
      featuredBadge: 'Business Analysis Lead',
      bio: 'รับผิดชอบการแปลงความต้องการของฝ่ายจัดการคอนโดมิเนียมและลูกบ้าน ออกมาเป็นข้อกำหนดฟังก์ชันระบบครบถ้วนทั้ง 25 Functional Requirements (FR-01 ถึง FR-25) กำหนด Business Rules การปกป้องข้อมูลห้องชุดที่มีสัญญาเช่า และออกแบบโครงสร้างการควบคุมสิทธิ์ RBAC',
      contributions: [
        'วิเคราะห์และจัดทำเอกสารความต้องการระบบครอบคลุมทั้ง 25 Functional Requirements (FR-01 ถึง FR-25)',
        'ออกแบบตารางสิทธิ์การเข้าถึง Role-Based Access Control (RBAC Permission Matrix) ทั้ง 4 บทบาท',
        'กำหนด Business Rule ที่สำคัญ: การบล็อกคำสั่งลบห้องชุดที่มีสัญญาเช่าผูกอยู่ (Active Lease Guard)',
        'ออกแบบกระบวนการเปลี่ยนสถานะผู้เช่า (Tenant Lifecycle 5 ระดับ) พร้อมบันทึกเหตุผลและผลกระทบ',
        'จัดทำหน้า Interactive System Coverage Dashboard เพื่อใช้ในการ Audit ความสมบูรณ์ของระบบ',
      ],
      skills: ['Business Analysis', 'RBAC Matrix Design', 'Business Rules Logic', 'Requirement Engineering', 'Contract Management'],
      quote: 'ถ่ายทอดข้อกำหนดทางธุรกิจที่ซับซ้อน ออกมาเป็นกระบวนการทำงานที่เป็นมาตรฐานและตรวจสอบได้',
      email: 'aunthikarn.nea@condoflow.local',
      github: 'github.com/aunthikarn-n',
      dfdFocus: 'DFD 2 (Units, Owners, Tenants & Leases) & FR-01-25 Verification',
    },
    {
      id: 'thanyathon',
      nameEn: 'Thanyathon Kitsakun',
      nameTh: 'ธัญธร กิจสกุล',
      role: 'QA Engineer & Security Specialist',
      roleTh: 'วิศวกรทดสอบคุณภาพและผู้เชี่ยวชาญความมั่นคงปลอดภัย',
      tagline: 'ดูแลความปลอดภัยข้อมูล PDPA Masking, Session Timeout และ Error Scenarios',
      avatarColor: 'text-cyan-600 dark:text-cyan-400',
      avatarBg: 'bg-gradient-to-tr from-cyan-600 to-sky-600 text-white',
      initials: 'TK',
      icon: ShieldCheck,
      featuredBadge: 'Security & Quality Assurance',
      bio: 'ดูแลความมั่นคงปลอดภัยและคุณภาพของระบบตามมาตรฐาน Non-Functional Requirements ออกแบบการรักษาความปลอดภัยข้อมูลส่วนบุคคล (PDPA Data Masking) ระบบเตือนหมดอายุเซสชัน 30 นาที และจำลองหน้าจอความพร้อมใช้งาน 99% SLA ด้วย Maintenance Mode',
      contributions: [
        'พัฒนาระบบ Data Masking ซ่อนหมายเลขบัตรประชาชน 13 หลัก และเบอร์โทรศัพท์ตามหลักคุ้มครองข้อมูลส่วนบุคคล (PDPA)',
        'สร้างกลไกจำลอง Session Timeout Warning 30 นาที พร้อมหน้าต่างนับถอยหลัง 60 วินาทีเพื่อต่ออายุเซสชัน',
        'ออกแบบและพัฒนา Error Handling Pages ครอบคลุม 403 Forbidden, 404 Not Found, และ 500 Internal Error',
        'พัฒนาระบบจำลองโหมดปิดปรับปรุงระบบ (Maintenance Mode 503) เพื่อทดสอบเป้าหมายความพร้อมใช้งาน 99% SLA',
        'ตรวจสอบความถูกต้องของแบบฟอร์ม (Validation) และระบบป้องกันปุ่มที่ไม่ทำงาน (Zero Dead Buttons)',
      ],
      skills: ['Quality Assurance', 'PDPA Data Masking', 'Session Security', 'Error Scenarios', 'Non-Functional Compliance'],
      quote: 'สร้างความเชื่อมั่นในความปลอดภัยของข้อมูล และความเสถียรของระบบในทุกสภาวะการใช้งาน',
      email: 'thanyathon.kit@condoflow.local',
      github: 'github.com/thanyathon-k',
      dfdFocus: 'Non-Functional Architecture, Security & Error Handling',
    },
    {
      id: 'rawinan',
      nameEn: 'Rawinan Bunsai',
      nameTh: 'รวินันท์ บุญสาย',
      role: 'Database & Data Analytics Engineer',
      roleTh: 'วิศวกรฐานข้อมูลและระบบวิเคราะห์ข้อมูลเชิงลึก',
      tagline: 'พัฒนาการวิเคราะห์ข้อมูลด้วย Recharts, Data Modeling และ Audit Log',
      avatarColor: 'text-blue-600 dark:text-blue-400',
      avatarBg: 'bg-gradient-to-tr from-blue-600 to-indigo-700 text-white',
      initials: 'RB',
      icon: Database,
      featuredBadge: 'Data Modeling & Analytics',
      bio: 'ออกแบบโครงสร้างข้อมูลจำลอง (Data Models & Schemas) สำหรับการบริหารจัดการคอนโดมิเนียมกว่า 10 เอนทิตี พัฒนาระบบรายงานสถิติแบบอินเตอร์แอคทีฟ 5 มิติด้วย Recharts และพัฒนาระบบบันทึกกิจกรรมย้อนหลังที่แก้ไขไม่ได้ (Immutable System Audit Log)',
      contributions: [
        'ออกแบบ Data Models & Mock Datasets 20 ห้องชุด, 10 สัญญา, 20 บิล, 10 งานซ่อม, และ 12 พัสดุ',
        'พัฒนาระบบรายงานสถิติขั้นสูง 5 แท็บใน ReportsPage.tsx ด้วย Recharts (Bar, Line, Area, Pie Charts)',
        'พัฒนาระบบบันทึกประวัติการทำรายการ (Transaction History) แยกตามบัญชีผู้ใช้แต่ละคนแบบ User-isolated',
        'พัฒนาระบบ System Audit Log ที่บันทึก Timestamp (Asia/Bangkok), Actor, Action, IP Address แบบ Read-only',
        'พัฒนาฟังก์ชันการส่งออกและนำเข้าข้อมูลเป็นไฟล์ CSV พร้อมมาตรฐาน UTF-8 BOM รองรับภาษาไทยใน Excel',
      ],
      skills: ['Recharts Analytics', 'Data Modeling', 'Audit Logging Engine', 'UTF-8 BOM CSV Export', 'Parcel Tracking Engine'],
      quote: 'เปลี่ยนข้อมูลการบริหารจัดการคอนโดมิเนียม ให้กลายเป็นภาพสรุปสถิติที่ช่วยให้ฝ่ายบริหารตัดสินใจได้แม่นยำ',
      email: 'rawinan.bun@condoflow.local',
      github: 'github.com/rawinan-b',
      dfdFocus: 'DFD 5 (Parcels) & DFD 7 (Reports, Transaction History & Audit Log)',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-2xl border border-indigo-900/50">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 border border-brand-400/30 text-brand-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
              <span>CondoFlow Engineering Team • คณะผู้พัฒนา</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-heading tracking-tight text-white">
              Developer Team & System Architects
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              ทีมงานผู้ร่วมออกแบบ วิจัยกระบวนการทางธุรกิจ และพัฒนาเว็บแอปพลิเคชันต้นแบบความละเอียดสูง
              <strong> “ระบบบริหารจัดการห้องชุดและผู้เช่าในคอนโดมิเนียม” (CondoFlow)</strong>
              ตอบสนองตามข้อกำหนด DFD ทั้ง 7 ส่วน และ 25 Functional Requirements อย่างสมบูรณ์
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => navigateTo('/admin/system-coverage')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading shadow-lg shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ดูผลตรวจประเมิน 25 FR</span>
            </button>
            <button
              onClick={() => navigateTo('/dashboard')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <span>กลับสู่หน้า Dashboard</span>
            </button>
          </div>
        </div>

        {/* Quick Team Stats Banner */}
        <div className="mt-8 pt-6 border-t border-indigo-900/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-2xl font-bold text-white font-heading">6</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ทีมงานผู้พัฒนา (Core Team)</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-2xl font-bold text-emerald-400 font-heading">25 / 25</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Functional Requirements</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-2xl font-bold text-brand-400 font-heading">7 / 7</div>
            <div className="text-[11px] text-slate-400 mt-0.5">DFD Workflows ครบวงจร</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-2xl font-bold text-amber-400 font-heading">100%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Interactive Prototype</div>
          </div>
        </div>
      </div>

      {/* Team Members Grid (6 Members) */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              <span>สมาชิกทีมผู้พัฒนา (Developer Team Members)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              คลิกที่การ์ดสมาชิกเพื่อเปิดดูรายละเอียดบทบาท ผลงาน และหน้าที่ความรับผิดชอบเชิงลึก
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Top Badge & Number */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/60 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                    <Icon className="w-3 h-3" />
                    <span>{member.featuredBadge}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300 dark:text-slate-700">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Avatar and Name */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl ${member.avatarBg} flex items-center justify-center font-heading font-bold text-lg shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                      {member.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {member.nameEn}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {member.nameTh}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <div className="text-xs font-semibold text-brand-700 dark:text-brand-300 font-heading">
                      {member.role}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {member.tagline}
                    </p>
                  </div>
                </div>

                {/* DFD Focus Pill */}
                <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    ขอบเขตหลักในระบบ (DFD Focus)
                  </div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg truncate">
                    {member.dfdFocus}
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {member.skills.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium text-slate-400">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Bottom Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                  <span>ดูผลงานและหน้าที่รับผิดชอบ</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Competencies & Methodology Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-600" />
            <span>กระบวนการพัฒนาและมาตรฐานทางวิศวกรรมซอฟต์แวร์ (Engineering Standards)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            หลักการที่คณะผู้พัฒนายึดถือในการสร้างสรรค์ระบบบริหารจัดการคอนโดมิเนียม CondoFlow
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
              Component-Driven SaaS
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              สถาปัตยกรรมระดับโมดูลาร์ แยกส่วนประกอบ UI ชัดเจน มีความยืดหยุ่นสูง พร้อมรองรับการต่อยอดเชื่อมต่อ REST API หรือ GraphQL ในอนาคต
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
              Strict RBAC & Least Privilege
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              ควบคุมการเข้าถึงข้อมูลตามบทบาททั้ง 4 อย่างเคร่งครัด แยกแดชบอร์ดตามหน้าที่ และแสดงหน้า 403 Forbidden ทันทีเมื่อพยายามเข้าถึงนอกขอบเขต
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
              Zero Dead Buttons Guarantee
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              ทุกปุ่ม ทุกฟอร์ม และทุก Modal สามารถกดคลิก ส่งค่า และเปลี่ยนสถานะลงใน LocalStorage ได้จริง ไม่มีข้อความ Placeholder หรือ Coming Soon
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Member Modal */}
      {selectedMember && (
        <Modal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title={`ประวัติและผลงาน: ${selectedMember.nameEn}`}
          maxWidth="2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-slate-400">
                CondoFlow Developer Profile
              </span>
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          }
        >
          <div className="space-y-6 text-slate-800 dark:text-slate-200">
            {/* Header in Modal */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className={`w-16 h-16 rounded-2xl ${selectedMember.avatarBg} flex items-center justify-center font-heading font-bold text-2xl shadow-lg shrink-0`}>
                {selectedMember.initials}
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                  {selectedMember.nameEn}
                </h3>
                <div className="text-sm text-slate-500 font-medium">{selectedMember.nameTh}</div>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  {selectedMember.role}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-heading">
                บทบาทและภาพรวมการทำงาน (Role Overview)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedMember.bio}
              </p>
            </div>

            {/* Quote */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-brand-500 text-xs italic text-slate-600 dark:text-slate-300">
              "{selectedMember.quote}"
            </div>

            {/* Key Contributions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 font-heading flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span>ผลงานและความรับผิดชอบหลักในโครงการ CondoFlow:</span>
              </h4>
              <ul className="space-y-2 text-xs">
                {selectedMember.contributions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-heading">
                ทักษะและความเชี่ยวชาญ (Technical Stack)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-slate-300 border border-brand-100 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact / Links Mock */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-brand-500" />
                  <span>{selectedMember.email}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Code2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span>{selectedMember.github}</span>
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
