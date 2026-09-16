/**
 * Toast 容器：底部弹出，黑底黄字
 */
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useToastStore } from '@/hooks/useToast';

export function ToastHost() {
  const toasts = useToastStore((state) => state.toasts);

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 bottom-8 z-[300] flex flex-col items-center gap-2 px-4"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            className="border-3 border-nb-black bg-nb-black px-6 py-3 text-sm font-bold text-nb-yellow shadow-nb"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}