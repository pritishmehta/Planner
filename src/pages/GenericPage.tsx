import React from 'react';
import { TaskCategory } from '@/contexts/PlannerContext';
import { Checklist } from '@/components/Checklist';

interface GenericPageProps {
  title: string;
  category: TaskCategory;
}

export function GenericPage({ title, category }: GenericPageProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-serif text-gray-900">{title}</h1>
        <div className="w-12 h-1 bg-[#A3B18A] rounded-full mt-4" />
      </header>

      <div className="max-w-2xl">
        <Checklist category={category} />
      </div>
    </div>
  );
}
