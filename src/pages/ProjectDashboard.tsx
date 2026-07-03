import React from 'react';
import { usePlanner } from '@/contexts/PlannerContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const STATUSES = ['Not Started', 'In Progress', 'Completed'] as const;

export function ProjectDashboard() {
  const { state, updateTask } = usePlanner();
  const projectTasks = state.tasks.filter(t => t.categoryId === 'projects');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif text-gray-900">Space Planners</h1>
        <p className="text-gray-500 text-sm tracking-wide">Family Business Transition Projects</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectTasks.map(task => (
          <div key={task.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className={cn(
              "absolute top-0 left-0 w-1 h-full transition-colors duration-500",
              task.status === 'Completed' ? 'bg-[#A3B18A]' : 
              task.status === 'In Progress' ? 'bg-[#E2C792]' : 'bg-gray-200'
            )} />
            
            <h3 className="text-lg font-medium text-gray-800 mb-4 ml-2">{task.title}</h3>
            
            <div className="ml-2 space-y-4">
              <div className="flex space-x-2">
                {STATUSES.map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                      updateTask(task.id, { 
                        status, 
                        completed: status === 'Completed' 
                      });
                    }}
                    className={cn(
                      "flex-1 md:flex-none px-3 py-3 md:py-2 text-[13px] rounded-full border transition-all duration-300 min-h-[44px] flex items-center justify-center",
                      task.status === status 
                        ? (status === 'Completed' ? "bg-[#A3B18A] border-[#A3B18A] text-white" :
                           status === 'In Progress' ? "bg-[#E2C792] border-[#E2C792] text-white" :
                           "bg-gray-500 border-gray-500 text-white")
                        : "bg-transparent border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 block">Next Action</label>
                <input
                  type="text"
                  value={task.nextAction || ''}
                  onChange={(e) => updateTask(task.id, { nextAction: e.target.value })}
                  placeholder="What's the next step?"
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-[16px] md:text-sm text-gray-700 outline-none focus:border-[#A3B18A] transition-colors min-h-[44px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
