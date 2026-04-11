import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, ProgressBar } from '../components/ui';
import subjectsData from '../data/subjects.json';
import dsaMcqs from '../data/mcq_bank_dsa.json';
import coMcqs from '../data/mcq_bank_co.json';
import oopsMcqs from '../data/mcq_bank_oops.json';
import mathsMcqs from '../data/mcq_bank_maths.json';
import financeMcqs from '../data/mcq_bank_finance.json';
import { playFeedback } from '../utils/audio';
import { Filter, CheckCircle, XCircle, AlertTriangle, RotateCcw, Trophy, BookOpen, ChevronRight } from 'lucide-react';

const McqBanks = {
  dsa: dsaMcqs,
  co: coMcqs,
  oops: oopsMcqs,
  maths: mathsMcqs,
  finance: financeMcqs
};

export default function PracticeHub() {
  const [selectedSubject, setSelectedSubject] = useState('dsa');
  const [selectedTopics, setSelectedTopics] = useState(new Set());
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [status, setStatus] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [mode, setMode] = useState('select'); // 'select' | 'quiz'

  const currentBank = McqBanks[selectedSubject];
  const allTopics = currentBank?.topics || [];

  // Build filtered question pool
  const questions = useMemo(() => {
    if (selectedTopics.size === 0) {
      return allTopics.flatMap(t => t.questions.map(q => ({ ...q, topicTitle: t.title, unit: t.unit })));
    }
    return allTopics
      .filter(t => selectedTopics.has(t.id))
      .flatMap(t => t.questions.map(q => ({ ...q, topicTitle: t.title, unit: t.unit })));
  }, [selectedSubject, selectedTopics, allTopics]);

  const question = questions[activeQuestionIndex];

  // Reset when subject changes
  useEffect(() => {
    setSelectedTopics(new Set());
    resetQuiz();
  }, [selectedSubject]);

  const resetQuiz = () => {
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setStatus(null);
    setScore({ correct: 0, incorrect: 0, total: 0 });
    setQuizCompleted(false);
    setMode('select');
  };

  const startQuiz = () => {
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setStatus(null);
    setScore({ correct: 0, incorrect: 0, total: 0 });
    setQuizCompleted(false);
    setMode('quiz');
  };

  const toggleTopic = (topicId) => {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedTopics(new Set());
  };

  const checkAnswer = (index) => {
    setSelectedOption(index);
    const isCorrect = index === question.correctAnswer;
    setStatus(isCorrect ? 'correct' : 'incorrect');
    playFeedback(isCorrect);
    
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1, total: prev.total + 1 }));
    }
  };

  const nextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setStatus(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const skipQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setStatus(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const scorePercent = score.total > 0 ? parseFloat(((score.correct / score.total) * 100).toFixed(2)) : 0;

  // --- TOPIC SELECTION MODE ---
  if (mode === 'select') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <header>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-text-main mb-2 leading-tight">Practice Engine</h1>
          <p className="text-text-dim text-base sm:text-xl">Choose a subject and filter topics to begin.</p>
        </header>

        {/* Subject Selector */}
        <div className="flex flex-wrap gap-3">
          {subjectsData.map(sub => (
            <button
              key={sub.id}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all border-2 ${
                selectedSubject === sub.id 
                  ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30 scale-105' 
                  : 'glass border-primary/10 text-text-dim hover:border-primary/50 hover:text-primary'
              }`}
              onClick={() => setSelectedSubject(sub.id)}
            >
              {sub.title}
            </button>
          ))}
        </div>

        {/* Topic Filter */}
        <Card className="p-5 sm:p-10 space-y-4 sm:space-y-6 glass shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem] border-primary/10">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 sm:gap-3 text-text-main">
              <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /> Topics
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary uppercase text-[8px] sm:text-[10px] px-2 py-0.5">{currentBank?.subjectTitle}</Badge>
            </h2>
            <Button variant="outline" className="text-[10px] font-black px-3 py-1.5 rounded-lg" onClick={selectAll}>
              {selectedTopics.size === 0 ? 'All' : 'Reset'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allTopics.map(topic => {
              const isSelected = selectedTopics.size === 0 || selectedTopics.has(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`flex items-center justify-between text-left p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/10 text-text-main shadow-lg' 
                      : 'border-primary/5 bg-primary/5 text-text-dim opacity-60'
                  }`}
                >
                  <div className="flex-1 mr-2 sm:mr-4">
                    <p className="font-black text-sm sm:text-base leading-tight">{topic.title}</p>
                    <p className="text-[10px] font-bold text-text-soft mt-0.5 sm:mt-1 uppercase tracking-widest">{topic.unit} · {topic.questions.length} Qs</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-primary border-primary shadow-md shadow-primary/20' : 'border-primary/20 bg-background-main/50'
                  }`}>
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Start Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 glass p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-primary/20 shadow-2xl">
          <div className="text-center sm:text-left">
            <p className="font-black text-xl sm:text-2xl text-text-main">{questions.length} Questions Indexed</p>
            <p className="text-text-dim text-base sm:text-lg font-bold">
              {selectedTopics.size === 0 ? 'Full subject syllabus' : `${selectedTopics.size} Topic${selectedTopics.size > 1 ? 's' : ''} filtered`}
            </p>
          </div>
          <Button variant="primary" className="w-full sm:w-auto text-lg sm:text-xl px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black shadow-2xl shadow-primary/30 active:scale-95" onClick={startQuiz} disabled={questions.length === 0}>
            Start Engine <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-in zoom-in-95 duration-500">
        <Card className="p-8 sm:p-16 text-center space-y-6 sm:space-y-10 glass shadow-2xl rounded-[2rem] sm:rounded-[3rem] border-primary/10">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[2rem] bg-primary/10 flex items-center justify-center mx-auto shadow-inner border border-primary/20">
            <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-primary" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-text-main">Session Complete!</h1>
            <p className="text-text-dim text-lg sm:text-xl font-bold uppercase tracking-widest">{currentBank?.subjectTitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div className="glass-light rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-success/20">
              <p className="text-3xl sm:text-5xl font-black text-success">{score.correct}</p>
              <p className="text-[10px] sm:text-sm font-black text-text-soft mt-1 sm:mt-2 uppercase tracking-widest">Correct</p>
            </div>
            <div className="glass-light rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-error/20">
              <p className="text-3xl sm:text-5xl font-black text-error">{score.incorrect}</p>
              <p className="text-[10px] sm:text-sm font-black text-text-soft mt-1 sm:mt-2 uppercase tracking-widest">Incorrect</p>
            </div>
            <div className="glass-light rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-primary/20">
              <p className="text-3xl sm:text-5xl font-black text-primary">{scorePercent}%</p>
              <p className="text-[10px] sm:text-sm font-black text-text-soft mt-1 sm:mt-2 uppercase tracking-widest">Accuracy</p>
            </div>
          </div>

          <ProgressBar progress={scorePercent} className="h-4" />

          <p className="text-xl sm:text-2xl font-black text-text-main">
            {scorePercent >= 80 ? '🔥 Legendary performance!' : scorePercent >= 50 ? '💪 Solid progress!' : '📚 Strategy needed.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button variant="outline" onClick={resetQuiz} className="w-full sm:w-auto gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 h-auto text-base sm:text-lg rounded-xl sm:rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" /> New Session
            </Button>
            <Button variant="primary" onClick={() => { resetQuiz(); startQuiz(); }} className="w-full sm:w-auto gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 h-auto text-base sm:text-lg rounded-xl sm:rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> Re-attempt
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // --- ACTIVE QUIZ MODE ---
  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 sm:gap-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Sidebar: Score & Progress */}
      <aside className="w-full md:w-72 flex-shrink-0 space-y-4 sm:space-y-6">
        <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6 glass border-primary/20 shadow-2xl rounded-2xl sm:rounded-3xl sticky top-8">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-xs text-text-soft tracking-widest uppercase">Engine Status</h3>
            <button onClick={resetQuiz} className="text-xs text-error hover:text-error-dark font-black tracking-widest flex items-center gap-1 uppercase transition-colors">
              <RotateCcw className="w-3 h-3" /> Terminate
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-black">
              <span className="text-text-dim uppercase tracking-wider">Progress</span>
              <span className="text-text-main">{activeQuestionIndex + 1} / {questions.length}</span>
            </div>
            <ProgressBar progress={parseFloat(((activeQuestionIndex / questions.length) * 100).toFixed(2))} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-success/5 border border-success/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-black text-success">{score.correct}</p>
              <p className="text-[8px] sm:text-[10px] font-black text-text-soft uppercase tracking-widest mt-1">Correct</p>
            </div>
            <div className="bg-error/5 border border-error/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
              <p className="text-xl sm:text-2xl font-black text-error">{score.incorrect}</p>
              <p className="text-[8px] sm:text-[10px] font-black text-text-soft uppercase tracking-widest mt-1">Wrong</p>
            </div>
          </div>

          {score.total > 0 && (
            <div className="pt-2 text-center text-sm font-black uppercase tracking-[0.2em]">
              Accuracy: <span className={scorePercent >= 70 ? 'text-success' : scorePercent >= 40 ? 'text-warning' : 'text-error'}>{scorePercent}%</span>
            </div>
          )}
        </Card>

        {question && (
          <Card className="p-5 glass-light border-primary/10 rounded-2xl shadow-lg">
            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">{question.topicTitle}</p>
            <p className="text-sm text-text-dim font-bold">{question.unit}</p>
          </Card>
        )}
      </aside>

      {/* Main MCQ Engine */}
      <main className="flex-1 space-y-6 sm:space-y-8">
        <header className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4 bg-primary/5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-primary/10 glass-light">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-main tracking-tight leading-tight">{currentBank?.subjectTitle}</h1>
            <p className="text-xs sm:text-sm text-text-dim mt-0.5 sm:mt-1 font-bold">{questions.length} Scenarios available</p>
          </div>
          <Badge variant="outline" className="h-fit px-3 sm:px-4 py-1.5 sm:py-2 border-primary/20 bg-primary/10 text-primary font-black text-[10px] sm:text-sm rounded-lg sm:rounded-xl shrink-0">Q {activeQuestionIndex + 1} / {questions.length}</Badge>
        </header>

        {question ? (
          <Card className={`p-5 sm:p-10 glass shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-2 transition-all duration-500 rounded-[1.5rem] sm:rounded-[2.5rem] ${status === 'correct' ? 'border-success/50 shadow-success/10' : status === 'incorrect' ? 'border-error/50 shadow-error/10' : 'border-primary/10'}`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-text-main mb-8 sm:mb-12 tracking-tight leading-tight">{question.question}</h2>
            
            <div className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-10">
              {question.options.map((opt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => !status && checkAnswer(i)}
                  disabled={status !== null}
                  className={`h-auto py-4 sm:py-6 px-5 sm:px-8 justify-start text-left normal-case text-base sm:text-xl rounded-xl sm:rounded-2xl border-2 transition-all group
                    ${selectedOption === i ? 
                      (status === 'correct' ? 'border-success bg-success/10 text-success' : 'border-error bg-error/10 text-error') : 
                      'glass-light border-primary/5 text-text-dim hover:border-primary/50 hover:text-text-main hover:bg-primary/5'}
                    ${status !== null && i === question.correctAnswer && i !== selectedOption ? 'border-success/50 text-success bg-success/5 border-dashed active:scale-100 font-bold' : ''}
                    ${status !== null && i !== question.correctAnswer && i !== selectedOption ? 'opacity-40 grayscale-[0.8]' : ''}
                  `}
                >
                  <span className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl border flex items-center justify-center mr-4 sm:mr-6 shrink-0 font-black text-xs sm:text-base transition-colors
                    ${selectedOption === i ? 'bg-current text-white border-transparent shadow-lg' : 'glass border-primary/10 group-hover:border-primary/50 text-text-soft'}
                  `}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 font-bold text-sm sm:text-lg">{opt}</span>
                  {status === 'correct' && i === question.correctAnswer && <CheckCircle className="w-5 h-5 sm:w-8 sm:h-8 text-success shrink-0 ml-3 sm:ml-4" />}
                  {status === 'incorrect' && selectedOption === i && <XCircle className="w-5 h-5 sm:w-8 sm:h-8 text-error shrink-0 ml-3 sm:ml-4" />}
                </Button>
              ))}
            </div>

            {status && (
              <div className="flex flex-col gap-6 border-t border-primary/10 p-6 sm:p-8 -mx-5 sm:-mx-10 -mb-5 sm:-mb-10 glass-heavy rounded-b-[1.5rem] sm:rounded-b-[2.5rem] animate-in slide-in-from-top-4 duration-500">
                <div className="flex-1">
                  <h4 className={`text-xl sm:text-2xl font-black flex items-center gap-2 sm:gap-3 ${status === 'correct' ? 'text-success' : 'text-error'}`}>
                    {status === 'correct' ? <><CheckCircle className="w-6 h-6 sm:w-7 sm:h-7"/> Result: Perfect</> : <><AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7"/> Result: Incorrect</>}
                  </h4>
                  <p className="mt-2 sm:mt-3 text-text-dim text-base sm:text-lg font-medium leading-relaxed">{question.explanation}</p>
                </div>
                <Button variant="primary" className="w-full px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-black rounded-xl sm:rounded-2xl shadow-2xl shadow-primary/25 active:scale-95" onClick={nextQuestion}>
                  {activeQuestionIndex < questions.length - 1 ? 'Next Challenge' : 'Finish Session'}
                </Button>
              </div>
            )}

            {!status && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={skipQuestion} className="text-text-soft font-black uppercase tracking-widest px-8 py-4 h-auto rounded-xl hover:text-primary transition-all">
                  Skip <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <div className="p-12 text-center text-text-muted">No questions found for this filter.</div>
        )}
      </main>
    </div>
  );
}
