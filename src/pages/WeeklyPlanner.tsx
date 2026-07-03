import React from 'react';
import { getWeekDays } from '@/lib/dateUtils';
import { format } from 'date-fns';
import { usePlanner } from '@/contexts/PlannerContext';
import { Checklist } from '@/components/Checklist';

export function WeeklyPlanner() {
  const weekDays = getWeekDays();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif text-gray-900">Weekly Overview</h1>
        <p className="text-gray-500 text-sm tracking-wide">
          {format(weekDays[0], 'MMMM d')} — {format(weekDays[6], 'MMMM d, yyyy')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map(day => (
          <div key={day.toISOString()} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{format(day, 'EEE')}</p>
            <p className="text-xl font-serif text-gray-800">{format(day, 'd')}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <Checklist category="weekly" title="This Week's Priorities" />
        </div>
        <div>
          <Checklist category="shopping" title="Errands & Shopping" />
        </div>
      </div>
    </div>
  );
}
