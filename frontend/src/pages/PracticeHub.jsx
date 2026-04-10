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
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <header>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Practice Engine</h1>
          <p className="text-text-secondary text-lg">Choose a subject and filter by topic to begin an MCQ session.</p>
        </header>

        {/* Subject Selector */}
        <div className="flex flex-wrap gap-3">
          {subjectsData.map(sub => (
            <button
              key={sub.id}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all border-2 ${
                selectedSubject === sub.id 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-background-soft border-border hover:border-primary/50 hover:text-primary'
              }`}
              onClick={() => setSelectedSubject(sub.id)}
            >
              {sub.title}
            </button>
          ))}
        </div>

        {/* Topic Filter */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" /> Topics
              <Badge variant="default">{currentBank?.subjectTitle}</Badge>
            </h2>
            <Button variant="outline" className="text-xs" onClick={selectAll}>
              {selectedTopics.size === 0 ? 'All Selected' : 'Select All'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allTopics.map(topic => {
              const isSelected = selectedTopics.size === 0 || selectedTopics.has(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`flex items-center justify-between text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5 text-text-primary shadow-sm' 
                      : 'border-border/50 bg-background-soft text-text-secondary opacity-60'
                  }`}
                >
                  <div>
                    <p className="font-medium text-sm">{topic.title}</p>
                    <p className="text-xs text-text-muted mt-1">{topic.unit} · {topic.questions.length} questions</p>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-primary border-primary' : 'border-border'
                  }`}>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Start Button */}
        <div className="flex items-center justify-between bg-background-soft p-6 rounded-2xl border border-border">
          <div>
            <p className="font-bold text-lg">{questions.length} questions ready</p>
            <p className="text-text-secondary text-sm">
              {selectedTopics.size === 0 ? 'All topics selected' : `${selectedTopics.size} topic${selectedTopics.size > 1 ? 's' : ''} selected`}
            </p>
          </div>
          <Button variant="primary" className="text-lg px-8 py-3" onClick={startQuiz} disabled={questions.length === 0}>
            Start Practice <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // --- QUIZ COMPLETED ---
  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
        <Card className="p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Session Complete!</h1>
          <p className="text-text-secondary text-lg">{currentBank?.subjectTitle}</p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-success/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-success">{score.correct}</p>
              <p className="text-sm text-text-secondary mt-1">Correct</p>
            </div>
            <div className="bg-error/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-error">{score.incorrect}</p>
              <p className="text-sm text-text-secondary mt-1">Incorrect</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-4">
              <p className="text-3xl font-bold text-primary">{scorePercent}%</p>
              <p className="text-sm text-text-secondary mt-1">Score</p>
            </div>
          </div>

          <ProgressBar progress={scorePercent} />

          <p className="text-lg font-medium">
            {scorePercent >= 80 ? '🔥 Excellent mastery!' : scorePercent >= 50 ? '💪 Good effort! Review weak areas.' : '📚 Keep studying, you\'ll get there!'}
          </p>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={resetQuiz} className="gap-2">
              <RotateCcw className="w-4 h-4" /> New Session
            </Button>
            <Button variant="primary" onClick={() => { resetQuiz(); startQuiz(); }} className="gap-2">
              <BookOpen className="w-4 h-4" /> Retry Same Set
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // --- ACTIVE QUIZ MODE ---
  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Sidebar: Score & Progress */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
        <Card className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-text-secondary">SESSION</h3>
            <button onClick={resetQuiz} className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Progress</span>
              <span className="font-bold">{activeQuestionIndex + 1} / {questions.length}</span>
            </div>
            <ProgressBar progress={parseFloat(((activeQuestionIndex / questions.length) * 100).toFixed(2))} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-success/10 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-success">{score.correct}</p>
              <p className="text-xs text-text-secondary">Correct</p>
            </div>
            <div className="bg-error/10 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-error">{score.incorrect}</p>
              <p className="text-xs text-text-secondary">Wrong</p>
            </div>
          </div>

          {score.total > 0 && (
            <p className="text-center text-sm font-medium">
              Accuracy: <span className={scorePercent >= 70 ? 'text-success' : scorePercent >= 40 ? 'text-warning' : 'text-error'}>{scorePercent}%</span>
            </p>
          )}
        </Card>

        {question && (
          <Card className="p-3 bg-primary/5 border-primary/20">
            <p className="text-xs text-primary font-medium">{question.topicTitle}</p>
            <p className="text-xs text-text-muted mt-0.5">{question.unit}</p>
          </Card>
        )}
      </aside>

      {/* Main MCQ Engine */}
      <main className="flex-1 space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">{currentBank?.subjectTitle}</h1>
            <p className="text-text-secondary mt-1">{questions.length} questions · {selectedTopics.size === 0 ? 'All topics' : `${selectedTopics.size} topics`}</p>
          </div>
          <Badge variant="warning" className="h-fit">Q {activeQuestionIndex + 1} of {questions.length}</Badge>
        </header>

        {question ? (
          <Card className={`p-8 border-2 transition-colors ${status === 'correct' ? 'border-success shadow-success/10' : status === 'incorrect' ? 'border-error shadow-error/10' : 'border-border'}`}>
            <h2 className="text-2xl font-bold mb-8">{question.question}</h2>
            
            <div className="flex flex-col gap-3 mb-8">
              {question.options.map((opt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => checkAnswer(i)}
                  disabled={status !== null}
                  className={`h-auto py-4 px-6 justify-start text-left normal-case text-base
                    ${selectedOption === i ? 'ring-2 ring-primary border-primary bg-primary/5' : ''}
                    ${status === 'correct' && i === question.correctAnswer ? 'bg-success/20 border-success text-success-dark' : ''}
                    ${status === 'incorrect' && selectedOption === i ? 'bg-error/20 border-error text-error-dark' : ''}
                    ${status !== null && i === question.correctAnswer && i !== selectedOption ? 'border-success text-success bg-success/5 border-dashed border-2' : ''}
                  `}
                >
                  <span className="w-8 h-8 rounded-full bg-background-main border flex items-center justify-center mr-4 shrink-0 font-medium text-text-secondary">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 font-medium">{opt}</span>
                  {status === 'correct' && i === question.correctAnswer && <CheckCircle className="w-6 h-6 text-success shrink-0" />}
                  {status === 'incorrect' && selectedOption === i && <XCircle className="w-6 h-6 text-error shrink-0" />}
                </Button>
              ))}
            </div>

            {status && (
              <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-t p-6 -mx-8 -mb-8 bg-background-soft rounded-b-2xl">
                <div className="flex-1">
                  <h4 className={`font-bold flex items-center gap-2 ${status === 'correct' ? 'text-success' : 'text-error'}`}>
                    {status === 'correct' ? <><CheckCircle className="w-5 h-5"/> Correct!</> : <><AlertTriangle className="w-5 h-5"/> Incorrect</>}
                  </h4>
                  <p className="mt-2 text-text-secondary">{question.explanation}</p>
                </div>
                <Button variant="primary" onClick={nextQuestion}>
                  {activeQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}
                </Button>
              </div>
            )}

            {!status && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={skipQuestion} className="text-text-secondary">
                  Skip <ChevronRight className="w-4 h-4 ml-1" />
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
