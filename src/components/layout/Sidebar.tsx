import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { usePlanner } from '@/contexts/PlannerContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, CheckSquare, ListTodo, Briefcase, 
  Stethoscope, Utensils, Heart, Share2, Users, Search, 
  Wallet, Calendar, BrainCircuit, CalendarDays, Flag
} from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Project Dashboard', icon: Briefcase },
  { path: '/master', label: 'Master Checklist', icon: CheckSquare },
  { path: '/weekly', label: 'Weekly Overview', icon: CalendarDays },
  { path: '/shopping', label: 'Shopping Planner', icon: ListTodo },
  { path: '/packing', label: 'Packing Planner', icon: Briefcase },
  { path: '/medical', label: 'Medical & Health', icon: Stethoscope },
  { path: '/cooking', label: 'Cooking Tracker', icon: Utensils },
  { path: '/yoga', label: 'Yoga & Habits', icon: Heart },
  { path: '/content', label: 'Content Planner', icon: Share2 },
  { path: '/family', label: 'Family & Friends', icon: Users },
  { path: '/research', label: 'Ireland Research', icon: Search },
  { path: '/budget', label: 'Budget', icon: Wallet },
  { path: '/timeline', label: 'Departure Timeline', icon: Calendar },
  { path: '/braindump', label: 'Brain Dump', icon: BrainCircuit },
  { path: '/final7', label: 'Final 7 Days', icon: Flag },
  { path: '/departure', label: 'Departure Day', icon: Flag },
];

export function Sidebar() {
  const { state, exportData, importData } = usePlanner();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      importData(e.target.files[0]);
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-4 fixed top-0 left-0 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-white rounded shadow">
          <LayoutDashboard size={20} className="text-gray-600"/>
        </button>
      </div>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#FAF9F6] border-r border-gray-200 flex flex-col transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <h1 className="text-lg font-medium text-gray-800 tracking-wide font-serif">Shruti's Transition</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Mumbai to Ireland</p>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Progress</span>
            <span className="text-xs font-medium text-gray-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
            <motion.div 
              className="bg-[#A3B18A] h-1.5 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex space-x-2">
            <button onClick={exportData} className="text-[10px] text-gray-500 hover:text-gray-800 uppercase tracking-wider bg-white border border-gray-200 px-2 py-1 rounded">Export</button>
            <button onClick={handleImportClick} className="text-[10px] text-gray-500 hover:text-gray-800 uppercase tracking-wider bg-white border border-gray-200 px-2 py-1 rounded">Import</button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <ul className="space-y-1 px-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                    setIsOpen(false);
                  }}
                  className={({ isActive }) => cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon size={16} className={cn("opacity-70")} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
