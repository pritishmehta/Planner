import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { usePlanner } from '@/contexts/PlannerContext';
import { AnimatePresence, motion } from 'motion/react';

export function Layout() {
  const { completedTaskMsg } = usePlanner();

  return (
    <div className="flex h-screen bg-[#FDFDFC] text-gray-800 font-sans selection:bg-[#A3B18A] selection:text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto md:ml-64 relative">
        <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32">
          <Outlet />
        </div>

        <AnimatePresence>
          {completedTaskMsg && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#A3B18A] text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center"
            >
              <span className="text-sm font-medium tracking-wide whitespace-nowrap">{completedTaskMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
