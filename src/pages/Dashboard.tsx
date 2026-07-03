import React, { useState } from 'react';
import { usePlanner, TaskCategory, Task } from '@/contexts/PlannerContext';
import { getDaysUntilDeparture } from '@/lib/dateUtils';
import { Plus, Search, ChevronDown, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { TaskBreakdownChart } from '@/components/TaskBreakdownChart';

export function Dashboard() {
  const { state, addTask, toggleTask, deleteTask } = usePlanner();
  const daysLeft = getDaysUntilDeparture();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<TaskCategory | 'all'>('all');
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddCat, setQuickAddCat] = useState<TaskCategory>('admin');
  const [quickAddTitle, setQuickAddTitle] = useState('');

  const incompleteTasks = state.tasks.filter(t => !t.completed);
  
  // Progress calculations
  const categories: TaskCategory[] = ['projects', 'packing', 'medical', 'cooking', 'yoga', 'habits', 'content', 'family', 'research', 'admin', 'shopping'];
  
  const categoryStats = categories.map(cat => {
    const catTasks = state.tasks.filter(t => t.categoryId === cat);
    const completed = catTasks.filter(t => t.completed).length;
    const total = catTasks.length;
    const percent = total === 0 ? 100 : Math.round((completed / total) * 100);
    return { category: cat, percent, total, completed };
  }).sort((a, b) => a.percent - b.percent);

  const totalTasks = state.tasks.length;
  const totalCompleted = state.tasks.filter(t => t.completed).length;
  const overallProgress = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);

  // Today's Focus: just take the first 3 incomplete
  const focusTasks = incompleteTasks.slice(0, 3);

  // Search & Filter results
  const filteredTasks = incompleteTasks.filter(t => {
    if (selectedFilter !== 'all' && t.categoryId !== selectedFilter) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAddTitle.trim()) {
      addTask({ categoryId: quickAddCat, title: quickAddTitle.trim() });
      setQuickAddTitle('');
      setIsQuickAddOpen(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="text-center space-y-4 pt-8">
        <h2 className="text-sm uppercase tracking-widest text-gray-400 font-medium">Time until Departure</h2>
        <div className="text-7xl md:text-9xl font-serif text-gray-900 tracking-tighter">
          {daysLeft}
        </div>
        <p className="text-gray-500 tracking-wide">days remaining</p>
      </header>

      <section className="max-w-xl mx-auto space-y-4">
        <div 
          onClick={() => setShowProgressDetails(true)}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex justify-between items-end mb-3 relative z-10">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overall Readiness</span>
            <span className="text-xl font-serif text-gray-800">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 relative z-10">
            <motion.div 
              className="bg-[#A3B18A] h-2 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </section>

      <section className="max-w-xl mx-auto space-y-6">
        <h3 className="text-lg font-serif text-gray-800 border-b border-gray-200 pb-2">Today's Focus</h3>
        <div className="space-y-3">
          {focusTasks.length === 0 ? (
            <p className="text-gray-400 italic text-center py-4">All caught up!</p>
          ) : (
            focusTasks.map(task => (
              <div key={task.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-2">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors -ml-1"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                    task.completed ? "bg-[#A3B18A] border-[#A3B18A] text-white" : "border-gray-300 group-hover:border-[#A3B18A]"
                  )}>
                    {task.completed && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
                <span className="text-gray-700 flex-1 pt-3 text-[16px]">{task.title}</span>
                <span className="mt-2.5 text-[10px] md:text-xs text-gray-400 uppercase tracking-wider border border-gray-100 px-2 py-1 rounded bg-gray-50 capitalize flex-shrink-0">
                  {task.categoryId}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="max-w-xl mx-auto space-y-6">
        <h3 className="text-lg font-serif text-gray-800 border-b border-gray-200 pb-2">Remaining Effort Breakdown</h3>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-center">
           <TaskBreakdownChart data={categoryStats} />
        </div>
      </section>

      <section className="max-w-xl mx-auto pt-8">
        <h3 className="text-lg font-serif text-gray-800 border-b border-gray-200 pb-2 mb-4">Task Library</h3>
        <div className="flex space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search incomplete tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 md:py-2 bg-white border border-gray-200 rounded-xl text-[16px] md:text-sm focus:outline-none focus:border-[#A3B18A] transition-colors min-h-[44px]"
            />
          </div>
          <div className="relative">
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-3 md:py-2 text-[16px] md:text-sm focus:outline-none focus:border-[#A3B18A] capitalize transition-colors min-h-[44px]"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="space-y-2 bg-white p-4 rounded-xl border border-gray-100 max-h-[400px] overflow-y-auto shadow-sm">
          {filteredTasks.length === 0 ? (
             <p className="text-gray-400 italic text-sm text-center py-4">No tasks found.</p>
          ) : (
            filteredTasks.map(task => (
              <motion.div 
                key={task.id} 
                layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                drag="x"
                dragConstraints={{ left: -100, right: 0 }}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -80) {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                    deleteTask(task.id);
                  }
                }}
                whileDrag={{ scale: 1.02 }}
                className="group flex items-start space-x-2 text-[16px] py-1 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg relative overflow-hidden bg-white"
              >
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-red-50 flex items-center justify-center -z-10 text-red-400 opacity-0 group-active:opacity-100 transition-opacity">
                   <Trash2 size={20} />
                </div>
                <button 
                  onClick={() => toggleTask(task.id)} 
                  className="mt-0.5 w-11 h-11 flex-shrink-0 flex items-center justify-center transition-colors -ml-1"
                >
                  <div className={cn(
                    "w-6 h-6 rounded border flex items-center justify-center transition-colors",
                    task.completed ? "bg-[#A3B18A] border-[#A3B18A] text-white" : "border-gray-300 group-hover:border-[#A3B18A]"
                  )}>
                    {task.completed && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
                <div className="flex-1 min-w-0 pt-3">
                  <p className="text-gray-700 truncate">{task.title}</p>
                </div>
                <span className="mt-3 text-[10px] text-gray-400 uppercase tracking-widest capitalize flex-shrink-0">{task.categoryId}</span>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* FAB Quick Add */}
      <div className="fixed bottom-8 right-8 z-40 md:hidden">
        <button 
          onClick={() => setIsQuickAddOpen(true)}
          className="w-14 h-14 bg-[#A3B18A] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#8f9d78] transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isQuickAddOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-lg text-gray-800">Quick Add Task</h3>
                <button onClick={() => setIsQuickAddOpen(false)} className="text-gray-400 w-11 h-11 flex items-center justify-center -mr-2">✕</button>
              </div>
              <form onSubmit={handleQuickAdd} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">Category</label>
                  <select 
                    value={quickAddCat} onChange={(e) => setQuickAddCat(e.target.value as any)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none capitalize"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-500 mb-1 block">Task</label>
                  <input 
                    type="text" autoFocus value={quickAddTitle} onChange={(e) => setQuickAddTitle(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    placeholder="What needs to be done?"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-[#A3B18A] text-white rounded-lg font-medium tracking-wide">
                  Add to Planner
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProgressDetails && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowProgressDetails(false)}
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-lg text-gray-800">Category Progress</h3>
                <button onClick={() => setShowProgressDetails(false)} className="text-gray-400 w-11 h-11 flex items-center justify-center -mr-2">✕</button>
              </div>
              <div className="space-y-4">
                {categoryStats.map(stat => (
                  <div key={stat.category} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 capitalize">{stat.category}</span>
                    <div className="flex items-center space-x-3 w-1/2">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          className="bg-[#E29578] h-1.5 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.percent}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{stat.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
