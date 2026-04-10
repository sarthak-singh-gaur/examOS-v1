import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ExamProvider } from './context/ExamContext';

import Dashboard from './pages/Dashboard';
import SubjectPage from './pages/SubjectPage';
import ConceptLearningPage from './pages/ConceptLearningPage';
import PracticeHub from './pages/PracticeHub';


import { useExam } from './context/ExamContext';
import BootScreen from './pages/BootScreen';
import { Power, PlayCircle, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const TrackLocation = () => {
  const location = useLocation();
  const { updateLastVisited } = useExam();
  
  React.useEffect(() => {
    if (location.pathname !== '/') {
       updateLastVisited(location.pathname);
    }
  }, [location]);
  return null;
};

const Layout = ({ children }) => {
  const { userId, resetOS, state, toggleTheme } = useExam();

  React.useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  if (!userId) {
    return <BootScreen />;
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-6">
        <nav className="glass flex items-center justify-between p-4 rounded-2xl shadow-lg border-primary/20">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mr-4">ExamOS</h1>
            <a href="/" className="hover:text-primary transition-colors font-semibold text-text-dim">Dashboard</a>
            <a href="/practice" className="hover:text-primary transition-colors font-semibold text-text-dim">Practice Hub</a>
          </div>
          
          <div className="flex items-center gap-3 border-l pl-4 ml-2 border-border-subtle">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-90"
            >
              {state.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <span className="text-sm font-medium text-text-soft hidden md:inline-block">User: <b className="text-text-main uppercase">{userId}</b></span>
            
            {state.lastVisited !== '/' && (
               <a href={state.lastVisited} className="flex items-center gap-1 text-sm bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover font-bold transition-all shadow-md shadow-primary/20">
                 <PlayCircle className="w-4 h-4" /> Resume
               </a>
            )}

            <button onClick={resetOS} className="p-2 text-error bg-error/10 hover:bg-error hover:text-white rounded-xl transition-all">
               <Power className="w-5 h-5" />
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
