import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, ProgressBar, Badge } from '../components/ui';
import { useExam } from '../context/ExamContext';
import { Calculator, Code, Binary, Cpu, Landmark, ArrowRight, Play, BookOpen, AlertTriangle } from 'lucide-react';
import subjectsData from '../data/subjects.json';

const iconMap = {
  Calculator,
  Code,
  Binary,
  Cpu,
  Landmark
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useExam();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    // In a real app this might be a fetch or dynamic injection
    setSubjects(subjectsData);
  }, []);

  const calculateOverallProgress = (subjectId) => {
    const subjectProgress = state.progress?.[subjectId];
    if (!subjectProgress) return 0;
    
    const units = Object.values(subjectProgress);
    if (units.length === 0) return 0;
    
    const total = units.reduce((acc, curr) => acc + curr, 0);
    return parseFloat((total / units.length).toFixed(2));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-text-main">Welcome back!</h1>
        <p className="text-text-dim mt-2 text-base sm:text-xl">Pick up right where you left off or start a new topic.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Practice Hub Quick Access Card */}
        <Card 
          className="p-5 sm:p-8 flex flex-col glass glass-hover border-success/30 cursor-pointer group rounded-[2rem] sm:rounded-[2.5rem] bg-success/5 min-h-[320px]"
          onClick={() => navigate('/practice')}
        >
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-success/10 text-success shadow-inner">
               <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
            </div>
            <Badge variant="success" className="text-[10px] sm:text-xs">Live Engine</Badge>
          </div>
          
          <div className="mb-6 sm:mb-8 flex-1">
            <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3 group-hover:text-success transition-colors text-text-main">Practice Hub</h3>
            <p className="text-sm sm:text-lg text-text-dim line-clamp-2 leading-relaxed">Dynamic MCQ engine to test your mastery across all subjects.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-bold text-text-dim uppercase tracking-widest opacity-60">Engine Status</span>
              <span className="font-black text-success">READY</span>
            </div>
            <div className="h-2.5 sm:h-3 w-full bg-success/10 rounded-full overflow-hidden">
              <div className="h-full bg-success w-full opacity-30" />
            </div>
          </div>
          
          <Button className="w-full mt-4 sm:mt-6 bg-success hover:bg-success-hover text-white gap-2 shadow-lg shadow-success/20 h-10 sm:h-auto text-sm sm:text-base">
            Open Practice Hub
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Card>

        {subjects.map((subject) => {
          const Icon = iconMap[subject.icon] || BookOpen;
          const progress = calculateOverallProgress(subject.id);
          const hasStarted = progress > 0;

          return (
            <Card 
              key={subject.id} 
              className="p-5 sm:p-8 flex flex-col glass glass-hover cursor-pointer group rounded-[2rem] sm:rounded-[2.5rem]"
              onClick={() => navigate(`/subject/${subject.id}`)}
            >
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-${subject.color}-500/10 text-${subject.color}-500 shadow-inner`}>
                   <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                {hasStarted ? (
                  <Badge variant="success">In Progress</Badge>
                ) : (
                  <Badge>Not Started</Badge>
                )}
              </div>
              
              <div className="mb-6 sm:mb-8 flex-1">
                <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3 group-hover:text-primary transition-colors text-text-main">{subject.title}</h3>
                <p className="text-sm sm:text-lg text-text-dim line-clamp-2 leading-relaxed">{subject.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-text-dim">Progress</span>
                  <span className="font-black text-text-main">{progress}%</span>
                </div>
                <ProgressBar progress={progress} />
              </div>
              
              <Button className="w-full mt-4 sm:mt-6 group-hover:bg-primary-hover gap-2 h-10 sm:h-auto text-sm sm:text-base">
                {hasStarted ? 'Continue Learning' : 'Start Learning'} 
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          );
        })}
      </div>

      {state.weakTopics && state.weakTopics.length > 0 && (
        <div className="mt-12 glass border-error/20 rounded-[2.5rem] p-10 bg-error/5">
          <h3 className="text-2xl font-black text-error mb-6 flex items-center gap-3">
             <AlertTriangle className="w-8 h-8" /> Topics needing attention
          </h3>
          <div className="flex flex-wrap gap-3">
            {state.weakTopics.map(topic => (
              <Badge key={topic} variant="error" className="py-2 px-4 text-sm">{topic}</Badge>
            ))}
          </div>
          <Button variant="outline" className="mt-8 border-error/50 text-error hover:bg-error hover:text-white px-8 py-4 h-auto text-lg rounded-2xl" onClick={() => navigate('/practice')}>
             Target Weak Topics
          </Button>
        </div>
      )}
    </div>
  );
}
