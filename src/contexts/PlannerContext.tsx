import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '@/lib/utils';
import confetti from 'canvas-confetti';

export type TaskCategory = 
  | 'projects' 
  | 'packing' 
  | 'medical' 
  | 'cooking' 
  | 'yoga' 
  | 'habits' 
  | 'content' 
  | 'family' 
  | 'research' 
  | 'admin'
  | 'shopping'
  | 'weekly';

export interface Task {
  id: string;
  categoryId: TaskCategory;
  title: string;
  completed: boolean;
  weight?: number;
  bag?: 'checkin' | 'cabin';
  status?: 'Not Started' | 'In Progress' | 'Completed';
  nextAction?: string;
  isCustom?: boolean; // True if added by user
}

export interface PlannerState {
  tasks: Task[];
  notes: Record<string, string>;
  packingLimits: { checkin: number; cabin: number };
}

const defaultTasks: Task[] = [
  // Projects
  { id: 'p1', categoryId: 'projects', title: 'Website', completed: false, status: 'Not Started' },
  { id: 'p2', categoryId: 'projects', title: 'Branding', completed: false, status: 'Not Started' },
  { id: 'p3', categoryId: 'projects', title: 'Company Profile', completed: false, status: 'Not Started' },
  { id: 'p4', categoryId: 'projects', title: 'Portfolio', completed: false, status: 'Not Started' },
  { id: 'p5', categoryId: 'projects', title: 'Google Drive Organization', completed: false, status: 'Not Started' },
  { id: 'p6', categoryId: 'projects', title: 'Remote Work Setup', completed: false, status: 'Not Started' },

  // Admin / Master Checklist
  { id: 'a1', categoryId: 'admin', title: 'Flight booked', completed: true },
  { id: 'a2', categoryId: 'admin', title: 'Visa applied', completed: true },
  { id: 'a3', categoryId: 'admin', title: 'Visa appointment completed', completed: true },
  
  // Medical
  { id: 'm1', categoryId: 'medical', title: 'Dentist Appointment', completed: false },
  { id: 'm2', categoryId: 'medical', title: 'Eye Doctor Appointment', completed: false },
  { id: 'm3', categoryId: 'medical', title: 'ENT Appointment', completed: false },
  { id: 'm4', categoryId: 'medical', title: 'Gastroenterologist Appointment', completed: false },
  { id: 'm5', categoryId: 'medical', title: 'General Physician', completed: false },
  { id: 'm6', categoryId: 'medical', title: 'Blood Tests (Iron, Ferritin, Vit D, Vit B12, CBC, Thyroid, LFT, KFT)', completed: false },
  { id: 'm7', categoryId: 'medical', title: 'Medical certificate for Celiac Disease', completed: false },
  { id: 'm8', categoryId: 'medical', title: 'Prescription copies', completed: false },
  { id: 'm9', categoryId: 'medical', title: 'Medicine inventory packed', completed: false },

  // Habits / Yoga
  { id: 'h1', categoryId: 'yoga', title: 'Morning Yoga (90 mins)', completed: false },
  { id: 'h2', categoryId: 'yoga', title: 'Meditation', completed: false },
  { id: 'h3', categoryId: 'yoga', title: 'Pranayama', completed: false },

  // Content
  { id: 'c1', categoryId: 'content', title: 'Resume Travel Content Course', completed: false },
  { id: 'c2', categoryId: 'content', title: 'Draft first week of Ireland content', completed: false },
  { id: 'c3', categoryId: 'content', title: 'Update LinkedIn profile for transition', completed: false },

  // Family
  { id: 'f1', categoryId: 'family', title: 'Plan Family Dinner', completed: false },
  { id: 'f2', categoryId: 'family', title: 'Collect 30 Recipes from Mom', completed: false },
  { id: 'f3', categoryId: 'family', title: 'Digitize Family Photos', completed: false },

  // Shopping
  { id: 's1', categoryId: 'shopping', title: 'Winter Coat', completed: false },
  { id: 's2', categoryId: 'shopping', title: 'Universal Adapters', completed: false },
  
  // Packing placeholders
  { id: 'pk1', categoryId: 'packing', title: 'Winter Clothing', completed: false, bag: 'checkin', weight: 5 },
  { id: 'pk2', categoryId: 'packing', title: 'Toiletries', completed: false, bag: 'checkin', weight: 2 },
  { id: 'pk3', categoryId: 'packing', title: 'Laptop & Electronics', completed: false, bag: 'cabin', weight: 3 },
  { id: 'pk4', categoryId: 'packing', title: 'Important Documents', completed: false, bag: 'cabin', weight: 0.5 },
];

const initialState: PlannerState = {
  tasks: defaultTasks,
  notes: {},
  packingLimits: { checkin: 40, cabin: 8 }
};

interface PlannerContextType {
  state: PlannerState;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateNote: (id: string, content: string) => void;
  exportData: () => void;
  importData: (file: File) => void;
  completedTaskMsg: string | null;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

const MOTIVATIONAL_MESSAGES = [
  "One step closer to Ireland.",
  "Great progress.",
  "Well done.",
  "Moving forward smoothly.",
  "A small step, a big win.",
];

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlannerState>(() => {
    try {
      const saved = localStorage.getItem('shruti-planner');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge missing default tasks if needed, or just use saved
        // For simplicity, just use saved if valid
        return { ...initialState, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load planner state", e);
    }
    return initialState;
  });

  const [completedTaskMsg, setCompletedTaskMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('shruti-planner', JSON.stringify(state));
  }, [state]);

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...task, id: generateId(), completed: false, isCustom: true }]
    }));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ['#A3B18A', '#E29578', '#D4A373', '#FAEDCD'],
      origin: { y: 0.8 },
      disableForReducedMotion: true,
      zIndex: 100
    });
  };

  const toggleTask = (id: string) => {
    setState(prev => {
      const newTasks = prev.tasks.map(t => {
        if (t.id === id) {
          const newlyCompleted = !t.completed;
          if (newlyCompleted) {
            triggerMotivation();
            triggerVibration();
            triggerConfetti();
          }
          return { ...t, completed: newlyCompleted, status: newlyCompleted ? 'Completed' : t.status };
        }
        return t;
      });
      return { ...prev, tasks: newTasks };
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const updateNote = (id: string, content: string) => {
    setState(prev => ({
      ...prev,
      notes: { ...prev.notes, [id]: content }
    }));
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `shruti-planner-backup-${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedState = JSON.parse(e.target?.result as string);
        if (window.confirm("Are you sure you want to overwrite your current planner data?")) {
          setState(importedState);
        }
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const triggerMotivation = () => {
    const msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    setCompletedTaskMsg(msg);
    setTimeout(() => setCompletedTaskMsg(null), 3000);
  };

  const triggerVibration = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <PlannerContext.Provider value={{ state, addTask, toggleTask, updateTask, deleteTask, updateNote, exportData, importData, completedTaskMsg }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
