import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Xmark } from 'iconoir-react';
import { clearToast } from '../redux/cartSlice';
import Tape from './Tape';

const ToastNotification = () => {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.cart?.toast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-20 right-6 z-50 bg-[#FAF7F2] text-[#191817] p-4 border border-[#2C2A29]/20 shadow-[0_12px_35px_rgba(0,0,0,0.12)] max-w-sm"
        >
          {/* Tape on top right */}
          <div className="absolute -top-3 -right-2 pointer-events-none">
            <Tape rotate="6deg" variant="kraft" text="PINNED" width="w-20" height="h-5" />
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#191817] text-[#FAF7F2] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check width={12} height={12} />
            </div>

            <div className="flex-1 pr-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#A66551] font-bold block">
                {toast.title || 'ADDED TO SARTORIAL BAG'}
              </span>
              <p className="font-serif text-sm font-normal text-[#191817] leading-snug">
                {toast.name}
              </p>
              <p className="font-mono text-[9px] text-[#7A756F] mt-0.5">
                Size: {toast.size} • Color: {toast.color}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dispatch(clearToast())}
              className="text-[#7A756F] hover:text-[#191817] p-1"
              aria-label="Dismiss toast"
            >
              <Xmark width={14} height={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification;
