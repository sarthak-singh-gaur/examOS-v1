import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, ProgressBar, Badge } from '../components/ui';
import { useExam } from '../context/ExamContext';
import { Calculator, Code, Binary, Cpu, Landmark, ArrowRight, Play, BookOpen } from 'lucide-react';
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
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-text-secondary mt-2 text-lg">Pick up right where you left off or start a new topic.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const Icon = iconMap[subject.icon] || BookOpen;
          const progress = calculateOverallProgress(subject.id);
          const hasStarted = progress > 0;

          return (
            <Card 
              key={subject.id} 
              className="p-6 flex flex-col hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => navigate(`/subject/${subject.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${subject.color}-100 text-${subject.color}-600`}>
                   <Icon className="w-6 h-6" />
                </div>
                {hasStarted ? (
                  <Badge variant="success">In Progress</Badge>
                ) : (
                  <Badge>Not Started</Badge>
                )}
              </div>
              
              <div className="mb-6 flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{subject.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2">{subject.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-text-secondary">Progress</span>
                  <span className="font-bold">{progress}%</span>
                </div>
                <ProgressBar progress={progress} />
              </div>
              
              <Button className="w-full mt-6 group-hover:bg-primary-hover gap-2">
                {hasStarted ? 'Continue Learning' : 'Start Learning'} 
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          );
        })}
      </div>

      {state.weakTopics && state.weakTopics.length > 0 && (
        <div className="mt-12 bg-error/5 border border-error/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-error mb-4 flex items-center gap-2">
            ⚠️ Topics needing attention
          </h3>
          <div className="flex flex-wrap gap-2">
            {state.weakTopics.map(topic => (
              <Badge key={topic} variant="error">{topic}</Badge>
            ))}
          </div>
          <Button variant="outline" className="mt-6 border-error text-error hover:bg-error hover:text-white" onClick={() => navigate('/practice')}>
             Target Weak Topics
          </Button>
        </div>
      )}
    </div>
  );
}
