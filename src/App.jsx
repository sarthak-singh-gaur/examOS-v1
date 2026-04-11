import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { ExamProvider } from './context/ExamContext';

import Dashboard from './pages/Dashboard';
import SubjectPage from './pages/SubjectPage';
import ConceptLearningPage from './pages/ConceptLearningPage';
import PracticeHub from './pages/PracticeHub';


import { useExam } from './context/ExamContext';
import BootScreen from './pages/BootScreen';
import { Power, PlayCircle, Sun, Moon } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto p-3 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
        <nav className="glass flex items-center justify-between p-3 sm:p-4 rounded-2xl shadow-lg border-primary/20">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mr-1 sm:mr-4">ExamOS</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/" className="hover:text-primary transition-colors font-bold text-text-dim text-[10px] sm:text-sm uppercase tracking-wider">Dashboard</Link>
              <Link to="/practice" className="hover:text-primary transition-colors font-bold text-text-dim text-[10px] sm:text-sm uppercase tracking-wider">Practice</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-3 border-l pl-2 sm:pl-4 ml-1 sm:ml-2 border-border-subtle">
            <button 
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-90"
            >
              {state.isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <span className="text-xs font-medium text-text-soft hidden lg:inline-block">User: <b className="text-text-main uppercase">{userId}</b></span>
            
            {state.lastVisited !== '/' && (
               <Link to={state.lastVisited} className="flex items-center gap-1 text-[10px] sm:text-sm bg-primary text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:bg-primary-hover font-bold transition-all shadow-md shadow-primary/20">
                 <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Resume</span>
               </Link>
            )}

            <button onClick={resetOS} className="p-1.5 sm:p-2 text-error bg-error/10 hover:bg-error hover:text-white rounded-xl transition-all">
               <Power className="w-4 h-4 sm:w-5 sm:h-5" />
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
