import React, { useState } from 'react';
import { usePlanner, TaskCategory } from '@/contexts/PlannerContext';
import { cn } from '@/lib/utils';
import { Plus, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function PackingPlanner() {
  const { state, addTask, updateTask, toggleTask, deleteTask } = usePlanner();
  
  const [newCheckin, setNewCheckin] = useState('');
  const [newCheckinWeight, setNewCheckinWeight] = useState('');
  const [newCabin, setNewCabin] = useState('');
  const [newCabinWeight, setNewCabinWeight] = useState('');

  const packingTasks = state.tasks.filter(t => t.categoryId === 'packing');
  const checkinTasks = packingTasks.filter(t => t.bag === 'checkin');
  const cabinTasks = packingTasks.filter(t => t.bag === 'cabin');

  const checkinTotal = checkinTasks.reduce((acc, t) => acc + (t.weight || 0), 0);
  const cabinTotal = cabinTasks.reduce((acc, t) => acc + (t.weight || 0), 0);

  const checkinLimit = state.packingLimits.checkin;
  const cabinLimit = state.packingLimits.cabin;

  const handleAdd = (bag: 'checkin' | 'cabin', e: React.FormEvent) => {
    e.preventDefault();
    if (bag === 'checkin' && newCheckin.trim()) {
      addTask({ categoryId: 'packing', title: newCheckin.trim(), bag, weight: parseFloat(newCheckinWeight) || 0 });
      setNewCheckin('');
      setNewCheckinWeight('');
    } else if (bag === 'cabin' && newCabin.trim()) {
      addTask({ categoryId: 'packing', title: newCabin.trim(), bag, weight: parseFloat(newCabinWeight) || 0 });
      setNewCabin('');
      setNewCabinWeight('');
    }
  };

  const getWeightColor = (total: number, limit: number) => {
    if (total >= limit - 2) return "text-[#E29578]"; // Terracotta
    return "text-[#A3B18A]"; // Sage
  };

  const renderBag = (title: string, tasks: any[], bag: 'checkin' | 'cabin', total: number, limit: number, newTitle: string, setNewTitle: any, newWeight: string, setNewWeight: any) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-end mb-6">
        <h3 className="text-lg font-serif text-gray-800">{title}</h3>
        <div className="text-right">
          <span className={cn("text-2xl font-serif", getWeightColor(total, limit))}>
            {total.toFixed(1)}
          </span>
          <span className="text-gray-400 text-sm"> / {limit} kg</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div 
              key={task.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              drag="x"
              dragConstraints={{ left: -100, right: 0 }}
              onDragEnd={(e, { offset }) => {
                if (offset.x < -80) {
                  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                  deleteTask(task.id);
                }
              }}
              whileDrag={{ scale: 1.02 }}
              className="group flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-50 transition-colors relative overflow-hidden bg-white"
            >
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-red-50 flex items-center justify-center -z-10 text-red-400 opacity-0 group-active:opacity-100 transition-opacity">
                 <Trash2 size={20} />
              </div>
              <button
                onClick={() => toggleTask(task.id)}
                className="flex-shrink-0 w-11 h-11 flex items-center justify-center -ml-1"
                aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                  task.completed ? "bg-[#A3B18A] border-[#A3B18A] text-white" : "border-gray-300 group-hover:border-[#A3B18A]"
                )}>
                  {task.completed && <Check size={14} strokeWidth={3} />}
                </div>
              </button>
              <input
                type="text"
                value={task.title}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                className={cn(
                  "flex-1 bg-transparent border-none focus:ring-0 text-[16px] outline-none py-2.5",
                  task.completed ? "text-gray-400 line-through" : "text-gray-700"
                )}
              />
              <div className="flex items-center space-x-1 border-b border-gray-200">
                <input 
                  type="number"
                  value={task.weight || ''}
                  onChange={(e) => updateTask(task.id, { weight: parseFloat(e.target.value) || 0 })}
                  className="w-12 text-right bg-transparent border-none text-sm text-gray-500 outline-none h-11"
                  placeholder="0"
                />
                <span className="text-xs text-gray-400">kg</span>
              </div>
              <button 
                onClick={() => deleteTask(task.id)} 
                className="hidden md:flex md:opacity-0 md:group-hover:opacity-100 text-gray-300 hover:text-red-400 p-2 transition-opacity flex-shrink-0 w-11 h-11 items-center justify-center"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={(e) => handleAdd(bag, e)} className="flex items-center space-x-2 px-1 border-t border-gray-50 pt-4 mt-4">
        <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center -ml-1">
          <Plus size={20} className="text-gray-400" />
        </div>
        <input
          type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add item..." className="flex-1 bg-transparent border-none outline-none text-[16px] py-3"
        />
        <input
          type="number" value={newWeight} onChange={(e) => setNewWeight(e.target.value)}
          placeholder="Wt (kg)" className="w-16 bg-transparent border-b border-gray-200 outline-none text-sm text-right px-1 h-11"
        />
        <button type="submit" className="hidden">Add</button>
      </form>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif text-gray-900">Packing Planner</h1>
        <p className="text-gray-500 text-sm tracking-wide">Manage weight allowances across bags</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderBag("Check-in Luggage", checkinTasks, "checkin", checkinTotal, checkinLimit, newCheckin, setNewCheckin, newCheckinWeight, setNewCheckinWeight)}
        {renderBag("Cabin Luggage", cabinTasks, "cabin", cabinTotal, cabinLimit, newCabin, setNewCabin, newCabinWeight, setNewCabinWeight)}
      </div>
    </div>
  );
}
