import React, { useState } from 'react';
import { usePlanner, TaskCategory } from '@/contexts/PlannerContext';
import { cn } from '@/lib/utils';
import { Check, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChecklistProps {
  category: TaskCategory;
  title?: string;
  hideAdd?: boolean;
}

export function Checklist({ category, title, hideAdd }: ChecklistProps) {
  const { state, toggleTask, addTask, deleteTask } = usePlanner();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const tasks = state.tasks.filter(t => t.categoryId === category);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask({ categoryId: category, title: newTaskTitle.trim() });
      setNewTaskTitle('');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {title && <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>}
      
      <div className="space-y-2">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div 
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              drag="x"
              dragConstraints={{ left: -100, right: 0 }}
              onDragEnd={(e, { offset }) => {
                if (offset.x < -80) {
                  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                  deleteTask(task.id);
                }
              }}
              whileDrag={{ scale: 1.02 }}
              className="group flex items-start space-x-2 p-1 rounded-xl hover:bg-gray-50 transition-colors bg-white relative overflow-hidden"
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
              <span className={cn(
                "flex-1 text-[16px] pt-2.5 transition-all duration-300",
                task.completed ? "text-gray-400 line-through" : "text-gray-700"
              )}>
                {task.title}
              </span>
              {task.isCustom && (
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="hidden md:flex md:opacity-0 md:group-hover:opacity-100 text-gray-300 hover:text-red-400 p-2 pt-2.5 transition-opacity flex-shrink-0 w-11 h-11 items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!hideAdd && (
        <form onSubmit={handleAdd} className="mt-6 flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-xl">
          <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center -ml-1">
            <Plus size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new item..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[16px] placeholder-gray-400 outline-none py-3"
          />
        </form>
      )}
    </div>
  );
}
