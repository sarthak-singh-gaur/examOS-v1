import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../components/ui';
import { useExam } from '../context/ExamContext';
import subjectsData from '../data/subjects.json';
import dsaData from '../data/dsa_data.json'; 
import coData from '../data/co_data.json'; 
import oopsData from '../data/oops_data.json';
import mathsData from '../data/maths_data.json';
import financeData from '../data/finance_data.json';
import { ArrowLeft, Play, LayoutGrid, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

const SubjectDatabases = {
  dsa: dsaData,
  co: coData,
  oops: oopsData,
  maths: mathsData,
  finance: financeData
};

const ProgressRing = ({ progress, size = 60, strokeWidth = 6, color = 'primary' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-text-soft/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`text-${color}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <span className="absolute text-[10px] font-black text-text-main">{parseFloat(progress).toFixed(0)}%</span>
    </div>
  );
};

export default function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { state } = useExam();
  
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [curriculum, setCurriculum] = useState(null);

  useEffect(() => {
    const info = subjectsData.find(s => s.id === subjectId);
    setSubjectInfo(info);
    const db = SubjectDatabases[subjectId] || dsaData;
    setCurriculum(db);
  }, [subjectId]);

  if (!subjectInfo || !curriculum) return <div className="p-8">Loading syllabus...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="relative p-12 rounded-[3.5rem] glass border-primary/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center text-sm font-bold text-text-secondary hover:text-primary mb-8 transition-all group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          <div className="flex items-start gap-8">
            <div className={`p-6 rounded-3xl bg-primary shadow-xl shadow-primary/20 text-white`}>
               <LayoutGrid className="w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black tracking-tight">{subjectInfo.title}</h1>
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Core Subject</Badge>
              </div>
              <p className="text-text-dim text-xl max-w-3xl leading-relaxed">{subjectInfo.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-black text-text-main">Learning Pathway</h2>
          <div className="flex items-center gap-2 text-sm font-bold text-text-dim glass px-5 py-2.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-success" />
            Adaptive curriculum enabled
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {curriculum.units.map((unit, unitIdx) => {
            const unitProgress = state.progress?.[subjectId]?.[unit.id] || 0;
            const isCompleted = unitProgress === 100;
            const isAccessible = true; // Unlocked by user request

            return (
              <Card key={unit.id} className={`group overflow-hidden border-2 transition-all duration-300 ${isAccessible ? 'hover:border-primary/50 shadow-md hover:shadow-2xl glass' : 'opacity-70 grayscale bg-text-soft/5 cursor-not-allowed'}`}>
                <div className="flex flex-col lg:flex-row">
                  <div className="p-8 flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Unit 0{unitIdx + 1}</span>
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                          {unit.title}
                          {isCompleted && <CheckCircle2 className="w-6 h-6 text-success fill-success/10" />}
                        </h3>
                      </div>
                      <ProgressRing progress={unitProgress} color={isCompleted ? 'success' : 'primary'} />
                    </div>

                    <p className="text-text-dim text-lg leading-relaxed">{unit.description || "Deep dive into the core architecture and problem-solving methodologies of this unit."}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {unit.topics.map((topic, tIdx) => {
                        const isTopicLocked = false; // Unlocked by user request
                        return (
                          <div 
                            key={topic.id} 
                            onClick={() => !isTopicLocked && isAccessible && navigate(`/subject/${subjectId}/unit/${unit.id}/topic/${topic.id}`)}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer
                              ${isTopicLocked ? 'bg-text-soft/5 text-text-soft border-border-subtle opacity-50' : 'bg-text-soft/5 hover:bg-primary/10 hover:border-primary/50 border-border-subtle shadow-sm'}
                            `}
                          >
                            <span className="text-[10px] font-bold truncate pr-1 text-text-main">{topic.title}</span>
                            {isTopicLocked ? <Lock className="w-3 h-3 text-text-soft" /> : <ChevronRight className="w-3 h-3 text-primary" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`lg:w-72 p-8 flex flex-col justify-center gap-4 bg-primary/5 border-l border-border-subtle`}>
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-text-dim">Overall Mastery</p>
                       <div className="h-2 w-full bg-text-soft/20 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-success' : 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`} style={{ width: `${unitProgress}%` }} />
                       </div>
                    </div>
                    
                    <Button 
                      disabled={!isAccessible}
                      className="w-full py-6 text-lg font-bold shadow-lg" 
                      variant={isCompleted ? 'outline' : 'primary'}
                      onClick={() => navigate(`/subject/${subjectId}/unit/${unit.id}/topic/${unit.topics[0].id}`)}
                    >
                      {isAccessible ? (unitProgress > 0 ? (isCompleted ? 'Review Mastery' : 'Resume Flow') : 'Start Journey') : 'Locked Unit'}
                      {isAccessible ? <Play className="w-5 h-5 ml-2 fill-current" /> : <Lock className="w-5 h-5 ml-2" />}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
