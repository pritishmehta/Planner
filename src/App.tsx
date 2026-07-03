import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlannerProvider } from './contexts/PlannerContext';
import { Layout } from './components/layout/Layout';

import { Dashboard } from './pages/Dashboard';
import { ProjectDashboard } from './pages/ProjectDashboard';
import { PackingPlanner } from './pages/Packing';
import { WeeklyPlanner } from './pages/WeeklyPlanner';

// Placeholder for remaining pages that use the generic GenericPage
import { GenericPage } from './pages/GenericPage';

export default function App() {
  return (
    <PlannerProvider>
      <BrowserRouter basename="/Planner">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectDashboard />} />
            <Route path="packing" element={<PackingPlanner />} />
            
            {/* Generic Checklists */}
            <Route path="master" element={<GenericPage title="Master Checklist" category="admin" />} />
            <Route path="medical" element={<GenericPage title="Medical & Health" category="medical" />} />
            <Route path="cooking" element={<GenericPage title="Cooking Tracker" category="cooking" />} />
            <Route path="yoga" element={<GenericPage title="Yoga & Habits" category="yoga" />} />
            <Route path="habits" element={<GenericPage title="Habit Tracker" category="habits" />} />
            <Route path="content" element={<GenericPage title="Content Planner" category="content" />} />
            <Route path="family" element={<GenericPage title="Family & Friends" category="family" />} />
            <Route path="research" element={<GenericPage title="Ireland Research" category="research" />} />
            <Route path="budget" element={<GenericPage title="Budget & Finances" category="admin" />} />
            <Route path="shopping" element={<GenericPage title="Shopping Planner" category="shopping" />} />
            <Route path="timeline" element={<GenericPage title="Departure Timeline" category="admin" />} />
            <Route path="braindump" element={<GenericPage title="Brain Dump" category="admin" />} />
            <Route path="weekly" element={<WeeklyPlanner />} />
            <Route path="final7" element={<GenericPage title="Final 7 Days" category="admin" />} />
            <Route path="departure" element={<GenericPage title="Departure Day" category="admin" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlannerProvider>
  );
}
