import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ExamProvider } from './context/ExamContext';

import Dashboard from './pages/Dashboard';
import SubjectPage from './pages/SubjectPage';
import ConceptLearningPage from './pages/ConceptLearningPage';
import PracticeHub from './pages/PracticeHub';


import { useExam } from './context/ExamContext';
import BootScreen from './pages/BootScreen';
import { Power, PlayCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const TrackLocation = () => {
  const location = useLocation();
  const { updateLastVisited } = useExam();
  
  React.useEffect(() => {
    // We don't save '/' as a resume point usually, but let's save everywhere except maybe PracticeHub for simplicity
    if (location.pathname !== '/') {
       updateLastVisited(location.pathname);
    }
  }, [location]);
  return null;
};

const Layout = ({ children }) => {
  const { userId, resetOS, state } = useExam();

  if (!userId) {
    return <BootScreen />;
  }

  return (
    <div className="min-h-screen bg-background-main font-sans text-text-primary p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <nav className="flex items-center justify-between p-4 bg-card rounded-2xl shadow-sm border border-border">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mr-4">ExamOS</h1>
            <a href="/" className="hover:text-primary transition-colors font-medium">Dashboard</a>
            <a href="/practice" className="hover:text-primary transition-colors font-medium">Practice Hub</a>
          </div>
          
          <div className="flex items-center gap-4 border-l pl-4 ml-2 border-border">
            <span className="text-sm font-medium text-text-secondary hidden sm:inline-block">Logged in as <b className="text-text-primary uppercase">{userId}</b></span>
            
            {state.lastVisited !== '/' && (
               <a href={state.lastVisited} className="flex items-center gap-1 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 font-medium transition-colors">
                 <PlayCircle className="w-4 h-4" /> Resume Action
               </a>
            )}

            <button onClick={resetOS} className="flex items-center gap-1 text-sm text-error bg-error/10 hover:bg-error hover:text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
               <Power className="w-4 h-4" /> Reset OS
            </button>
          </div>
        </nav>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ExamProvider>
      <Router>
        <TrackLocation />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subject/:subjectId" element={<SubjectPage />} />
            <Route path="/subject/:subjectId/unit/:unitId/topic/:topicId" element={<ConceptLearningPage />} />
            <Route path="/practice" element={<PracticeHub />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </ExamProvider>
  );
}

export default App;
