import React, { useState } from 'react';
import { StudyOSProvider, useStudyOS } from './context/StudyOSContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { SyllabusView } from './components/syllabus/SyllabusView';
import { PYQView } from './components/pyqs/PYQView';
import { AIDoubtSolverView } from './components/solver/AIDoubtSolverView';
import { StudyPlannerView } from './components/planner/StudyPlannerView';
import { WeakTopicView } from './components/weakness/WeakTopicView';
import { QuizView } from './components/quizzes/QuizView';
import { RevisionView } from './components/revision/RevisionView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { NotesView } from './components/notes/NotesView';
import { AICoachView } from './components/coach/AICoachView';
import { ExamModeModal } from './components/exam/ExamModeModal';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { DatabaseModal } from './components/common/DatabaseModal';

const AppContent: React.FC = () => {
  const { activeView } = useStudyOS();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'subjects':
        return <SubjectsView />;
      case 'syllabus':
        return <SyllabusView />;
      case 'pyqs':
        return <PYQView />;
      case 'solver':
        return <AIDoubtSolverView />;
      case 'planner':
        return <StudyPlannerView />;
      case 'weakness':
        return <WeakTopicView />;
      case 'quizzes':
        return <QuizView />;
      case 'revision':
        return <RevisionView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'notes':
        return <NotesView />;
      case 'coach':
        return <AICoachView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-brand-200">
      <Navbar
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        onOpenDatabaseModal={() => setShowDatabaseModal(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderActiveView()}
        </main>
      </div>

      <ExamModeModal />
      <ApiKeyModal isOpen={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} />
      <DatabaseModal isOpen={showDatabaseModal} onClose={() => setShowDatabaseModal(false)} />
    </div>
  );
};

export function App() {
  return (
    <StudyOSProvider>
      <AppContent />
    </StudyOSProvider>
  );
}

export default App;
