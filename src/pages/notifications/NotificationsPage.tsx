import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatThaiDate, formatRelativeTimeThai } from '../../lib/utils';
import { EmptyState } from '../../components/common/EmptyState';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    markAllNotificationsRead,
    navigateTo,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Filter for current user
  const userNotifs = notifications.filter(
    n => n.userId === 'all' || (currentUser && n.userId === currentUser.id)
  );

  const filtered = userNotifs.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = userNotifs.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-brand-600" />
            ศูนย์การแจ้งเตือน (Notification Center)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ประวัติการแจ้งเตือนพัสดุ บิลค่าใช้จ่าย งานซ่อม และประกาศสำคัญ
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <CheckCheck className="w-4 h-4" />
            <span>ทำเครื่องหมายว่าอ่านแล้วทั้งหมด ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ทั้งหมด ({userNotifs.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'unread'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ยังไม่อ่าน ({unreadCount})
        </button>

        <button
          onClick={() => setFilter('read')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'read'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          อ่านแล้ว ({userNotifs.length - unreadCount})
        </button>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8 text-slate-400" />}
          title="ไม่มีการแจ้งเตือนในหมวดนี้"
          description="เมื่อมีพัสดุใหม่ บิลเรียกเก็บ หรืออัปเดตงานซ่อม จะแสดงขึ้นที่นี่"
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {filtered.map(notif => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                !notif.isRead ? 'bg-brand-50/30 dark:bg-brand-950/20' : ''
              }`}
            >
              {getIcon(notif.type)}

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className={`text-sm text-slate-900 dark:text-white ${!notif.isRead ? 'font-bold' : 'font-medium'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {formatRelativeTimeThai(notif.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {notif.message}
                </p>

                <div className="pt-2 flex items-center gap-3 text-xs">
                  {notif.linkUrl && (
                    <button
                      onClick={() => {
                        markNotificationRead(notif.id);
                        navigateTo(notif.linkUrl!);
                      }}
                      className="font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <span>ไปยังหน้าที่เกี่ยวข้อง</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!notif.isRead && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-[11px]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>ทำเครื่องหมายว่าอ่านแล้ว</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
