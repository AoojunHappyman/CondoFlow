import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />,
        };

        const borders = {
          success: 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/95 dark:bg-emerald-950/90',
          error: 'border-rose-200 dark:border-rose-900/60 bg-rose-50/95 dark:bg-rose-950/90',
          warning: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/95 dark:bg-amber-950/90',
          info: 'border-sky-200 dark:border-sky-900/60 bg-sky-50/95 dark:bg-sky-950/90',
        };

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-bottom-5 duration-300 text-slate-800 dark:text-slate-100',
              borders[toast.type]
            )}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
