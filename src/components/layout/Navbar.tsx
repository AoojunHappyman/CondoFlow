import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Search,
  Bell,
  Moon,
  Sun,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  Check,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import { Badge } from '../common/Badge';
import { formatRelativeTimeThai } from '../../lib/utils';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    activeRole,
    isDarkMode,
    toggleDarkMode,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    navigateTo,
    logout,
    currentRoute,
    isMaintenanceMode,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter notifications for current user or all
  const userNotifications = notifications.filter(
    n => n.userId === 'all' || (currentUser && n.userId === currentUser.id)
  );
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  // Breadcrumbs text mapper
  const getBreadcrumbTitle = () => {
    if (currentRoute === '/dashboard') return 'ภาพรวม (Dashboard)';
    if (currentRoute === '/admin/dashboard') return 'ภาพรวมระบบ (Admin Dashboard)';
    if (currentRoute === '/units' || currentRoute === '/admin/units') return 'จัดการห้องชุด (Units)';
    if (currentRoute.startsWith('/units/')) return 'รายละเอียดห้องชุด (Unit Details)';
    if (currentRoute === '/admin/owners-tenants') return 'เจ้าของห้องและผู้เช่า (Owners & Tenants)';
    if (currentRoute === '/admin/contracts' || currentRoute === '/owner/contracts') return 'สัญญาเช่า (Contracts)';
    if (currentRoute === '/payments' || currentRoute === '/admin/invoices' || currentRoute === '/owner/expenses') return 'ค่าใช้จ่ายและใบแจ้งหนี้ (Invoices)';
    if (currentRoute === '/admin/payments') return 'คิวตรวจสอบการชำระเงิน (Payment Queue)';
    if (currentRoute === '/maintenance' || currentRoute === '/admin/repairs') return 'งานแจ้งซ่อมบำรุง (Maintenance)';
    if (currentRoute === '/parcels' || currentRoute === '/admin/parcels') return 'ระบบพัสดุ (Parcels)';
    if (currentRoute === '/announcements' || currentRoute === '/admin/announcements') return 'ประกาศและข่าวสาร (Announcements)';
    if (currentRoute === '/notifications') return 'การแจ้งเตือน (Notifications)';
    if (currentRoute === '/history') return 'ประวัติการทำรายการ (Transaction History)';
    if (currentRoute === '/admin/roles') return 'บทบาทและสิทธิ์ (Roles & Permissions)';
    if (currentRoute === '/admin/reports') return 'รายงานสรุป (Reports & Analytics)';
    if (currentRoute === '/admin/audit-log') return 'Audit Log (บันทึกกิจกรรม)';
    if (currentRoute === '/admin/system-coverage') return 'System Coverage (FR-01 - FR-25)';
    if (currentRoute === '/admin/settings') return 'ตั้งค่าระบบ (Settings)';
    if (currentRoute === '/team' || currentRoute === '/developer-team') return 'ทีมผู้พัฒนา (Developer Team)';
    if (currentRoute === '/profile') return 'ข้อมูลส่วนตัว (Profile)';
    return 'หน้าหลัก';
  };

  return (
    <>
      <header className="sticky top-[37px] z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Logo / Breadcrumbs */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div
                onClick={() => navigateTo(activeRole === 'admin' ? '/admin/dashboard' : '/dashboard')}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="hidden sm:block">
                  <span className="font-heading font-bold text-lg bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                    CondoFlow
                  </span>
                  <span className="block text-[10px] text-slate-400 -mt-1 font-medium">
                    ระบบบริหารห้องชุดและผู้เช่า
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                <span>/</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{getBreadcrumbTitle()}</span>
              </div>
            </div>
          </div>

          {/* Center / Search Trigger */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-xl text-xs text-slate-400 dark:text-slate-500 border border-transparent focus:border-brand-500 transition-all text-left"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>ค้นหาห้องชุด, ผู้เช่า, บิล, แจ้งซ่อม...</span>
              </span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions, Notifications, Dark Mode, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Maintenance Mode Alert Banner Icon */}
            {isMaintenanceMode && (
              <span
                onClick={() => navigateTo('/admin/settings')}
                title="ระบบอยู่ในโหมดบำรุงรักษา (Maintenance Mode)"
                className="cursor-pointer flex items-center gap-1 text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-300 animate-pulse"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden md:inline">โหมดบำรุงรักษา</span>
              </span>
            )}

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors sm:hidden"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(prev => !prev)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="การแจ้งเตือน"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white font-heading">
                        การแจ้งเตือน
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                          {unreadCount} ใหม่
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        อ่านทั้งหมด
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        ไม่มีการแจ้งเตือนในขณะนี้
                      </div>
                    ) : (
                      userNotifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.linkUrl) {
                              navigateTo(n.linkUrl);
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                            !n.isRead ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className={`text-xs font-medium text-slate-900 dark:text-slate-100 ${!n.isRead ? 'font-semibold' : ''}`}>
                              {n.title}
                            </h5>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1.5 block">
                            {formatRelativeTimeThai(n.createdAt)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => {
                        navigateTo('/notifications');
                        setIsNotifOpen(false);
                      }}
                      className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-1 w-full py-1"
                    >
                      ดูประวัติการแจ้งเตือนทั้งหมด
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(prev => !prev)}
                className="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <img
                  src={
                    currentUser?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
                  }
                  alt={currentUser?.firstName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'ผู้ใช้งาน'}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                    {activeRole} {currentUser?.unitNumber ? `(${currentUser.unitNumber})` : ''}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Menu Popover */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-4">
                    <p className="text-xs text-slate-400">เข้าสู่ระบบด้วย</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <Badge variant="purple" size="sm">
                        สิทธิ์: {activeRole.toUpperCase()}
                      </Badge>
                      {currentUser?.unitNumber && (
                        <Badge variant="info" size="sm">
                          ห้อง {currentUser.unitNumber}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        navigateTo('/profile');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>ข้อมูลส่วนตัวของฉัน (Profile)</span>
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('/team');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-purple-500" />
                      <span>ทีมผู้พัฒนา (Developer Team)</span>
                    </button>
                    {activeRole === 'admin' && (
                      <button
                        onClick={() => {
                          navigateTo('/admin/settings');
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>ตั้งค่าระบบและ Architecture</span>
                      </button>
                    )}
                  </div>

                  <div className="p-1.5 bg-slate-50 dark:bg-slate-900/60">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ออกจากระบบ (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
