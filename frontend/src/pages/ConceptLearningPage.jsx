import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ProgressBar, Badge } from '../components/ui';
import { useExam } from '../context/ExamContext';
import dsaData from '../data/dsa_data.json';
import coData from '../data/co_data.json';
import oopsData from '../data/oops_data.json';
import mathsData from '../data/maths_data.json';
import financeData from '../data/finance_data.json';
import { ArrowLeft, CheckCircle, XCircle, Lock, BookOpen } from 'lucide-react';
import MermaidChart from '../components/MermaidChart';
import { playFeedback } from '../utils/audio';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const SubjectDatabases = {
  dsa: dsaData,
  co: coData,
  oops: oopsData,
  maths: mathsData,
  finance: financeData
};

const MemoryAnalogy = () => {
  const [mode, setMode] = useState('array'); // 'array' or 'list'
  
  return (
    <Card className="p-6 bg-slate-50 mb-8 border-2 border-primary/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold flex items-center">
          <span className="bg-primary text-white w-6 h-6 rounded flex items-center justify-center mr-2 text-sm">i</span>
          Interactive Conceptualization
        </h3>
        <div className="flex bg-border rounded-lg p-1">
          <button onClick={() => setMode('array')} className={`px-3 py-1 text-sm rounded ${mode === 'array' ? 'bg-white shadow-sm font-medium' : 'text-text-secondary'}`}>Arrays (Post Office)</button>
          <button onClick={() => setMode('list')} className={`px-3 py-1 text-sm rounded ${mode === 'list' ? 'bg-white shadow-sm font-medium' : 'text-text-secondary'}`}>Linked List (Treasure Hunt)</button>
        </div>
      </div>

      <div className="min-h-[150px] flex items-center justify-center animate-in fade-in zoom-in duration-300">
        {mode === 'array' ? (
          <div className="flex gap-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`w-12 h-16 border-2 flex flex-col items-center justify-center rounded transition-all duration-300 ${i === 4 ? 'border-primary bg-primary/10 scale-110 shadow-md transform -translate-y-2' : 'border-border bg-white'}`}>
                <span className="text-xs text-text-muted">Box</span>
                <span className={`font-bold ${i === 4 ? 'text-primary' : 'text-text-primary'}`}>{i}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 items-center justify-center max-w-lg">
            {[...Array(4)].map((_, i) => (
               <React.Fragment key={i}>
                 <div className={`p-3 border-2 border-dashed flex flex-col items-center rounded-xl transition-all duration-500 delay-${i*100} ${i===3 ? 'border-success bg-success/10 scale-105' : 'border-slate-300 bg-white'}`}>
                   <span className="text-xs font-bold text-slate-500 mb-1">Clue {i+1}</span>
                   <span className="text-sm">{i===3 ? '🎯 Found it!' : 'Go to Clue ' + (i+2)}</span>
                 </div>
                 {i < 3 && <ArrowLeft className="w-5 h-5 text-slate-300 transform rotate-180" />}
               </React.Fragment>
            ))}
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-text-secondary bg-white p-3 rounded border">
        {mode === 'array' 
          ? "Arrays are strictly contiguous blocks. You can instantly jump to index 4 randomly without searching, because you know exactly where it is mathematically." 
          : "Linked Lists dynamically point to the next block. Finding Clue 4 requires reading clues 1, 2, and 3 sequentially."}
      </p>
    </Card>
  );
};

// ... other interactive components remain the same ...
const ALUSimulator = () => {
  const [mode, setMode] = useState(0); // 0 or 1 for C0
  return (
    <Card className="p-6 bg-slate-50 mb-8 border-2 border-primary/20">
      <h3 className="font-bold mb-4">Hardware Level: Binary Adder-Subtractor Logic</h3>
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border mb-4 shadow-sm">
         <div className="flex flex-col items-center gap-2">
            <span className="font-bold text-sm">Mode (C0)</span>
            <button onClick={() => setMode(mode === 0 ? 1 : 0)} className={`w-16 h-8 rounded-full border-2 transition-colors relative ${mode ? 'bg-primary border-primary' : 'bg-slate-200 border-slate-300'}`}>
              <div className={`w-6 h-6 bg-white rounded-full absolute top-[0.1rem] transition-all ${mode ? 'left-[2.1rem]' : 'left-[0.1rem]'}`}></div>
            </button>
            <span className="text-xs font-mono">{mode === 0 ? "Addition" : "Subtraction"}</span>
         </div>
         <div className="border-l pl-6 space-y-2">
            <p className="font-mono text-sm">Input A: <span className="font-bold">1010</span></p>
            <p className="font-mono text-sm flex items-center gap-2">Input B: <span className="font-bold">0011</span> <ArrowLeft className="w-3 h-3"/> 
              <span className={`text-xs p-1 rounded ${mode ? 'bg-error/10 text-error' : 'bg-slate-100'}`}>
                {mode ? "XOR Inverted: 1100" : "XOR Passed: 0011"}
              </span>
            </p>
         </div>
         <div className="border-l pl-6">
            <p className="text-sm font-bold text-slate-500">Result Equation</p>
            <p className="text-xl font-bold font-mono tracking-widest text-primary mt-1">
               {mode ? "A + inverted(B) + 1" : "A + B + 0"}
            </p>
         </div>
      </div>
    </Card>
  );
};

const StackSimulator = () => {
  const [stack, setStack] = useState([]);
  const push = () => { if (stack.length < 5) setStack([...stack, Math.floor(Math.random() * 100)]); };
  const pop = () => { if (stack.length > 0) setStack(stack.slice(0, -1)); };
  return (
    <Card className="p-6 bg-slate-50 mb-8 border-2 border-primary/20">
      <h3 className="font-bold mb-4 flex items-center justify-between">
        <span>Interactive: Stack (LIFO) Operations</span>
        <Badge variant={stack.length === 5 ? "warning" : "default"}>{stack.length === 5 ? "Stack Full" : stack.length === 0 ? "Stack Empty" : `${stack.length}/5`}</Badge>
      </h3>
      <div className="flex gap-8 items-end">
        <div className="flex-1 flex gap-2">
          <Button onClick={push} disabled={stack.length >= 5} variant="primary">Push Item</Button>
          <Button onClick={pop} disabled={stack.length === 0} variant="outline">Pop Item</Button>
        </div>
        <div className="w-32 h-48 border-x-4 border-b-4 border-slate-800 rounded-b-lg flex flex-col-reverse justify-start items-center p-2 gap-1 bg-white">
          {stack.map((item, index) => (<div key={index} className="w-full bg-primary text-white text-center rounded py-1 font-bold animate-in zoom-in duration-200">{item}</div>))}
        </div>
      </div>
    </Card>
  );
};

export default function ConceptLearningPage() {
  const { subjectId, unitId, topicId } = useParams();
  const navigate = useNavigate();
  const { state, updateProgress, addWeakTopic } = useExam();
  
  const [topic, setTopic] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [mcqStatus, setMcqStatus] = useState(null); // null, 'correct', 'incorrect'
  const [selectedOption, setSelectedOption] = useState(null);

  const subjectContent = SubjectDatabases[subjectId] || dsaData;
  const unit = subjectContent.units.find(u => u.id === unitId);
  const currentTopicIndex = unit ? unit.topics.findIndex(t => t.id === topicId) : -1;
  const unitProgress = state.progress?.[subjectId]?.[unitId] || 0;
  
  const hasPrevTopic = currentTopicIndex > 0;
  const hasNextTopic = unit && currentTopicIndex < unit.topics.length - 1;

  const goToNextTopic = () => {
    if (hasNextTopic) {
      navigate(`/subject/${subjectId}/unit/${unitId}/topic/${unit.topics[currentTopicIndex + 1].id}`);
      setCurrentStep(0);
      setMcqStatus(null);
      setSelectedOption(null);
    }
  };

  const goToPrevTopic = () => {
    if (hasPrevTopic) {
      navigate(`/subject/${subjectId}/unit/${unitId}/topic/${unit.topics[currentTopicIndex - 1].id}`);
      setCurrentStep(0);
      setMcqStatus(null);
      setSelectedOption(null);
    }
  };

  const unitProgressValue = state.progress?.[subjectId]?.[unitId] || 0;
  
  // Locking logic: Enable first topic or if progress has reached this topic's threshold
  // Assuming 10 topics per unit, each topic is 10% progress.
  const isLocked = false; // Unlocked by user request

  useEffect(() => {
    if (unit) {
      const targetTopic = unit.topics[currentTopicIndex];
      setTopic(targetTopic);
    }
  }, [subjectId, unitId, topicId, currentTopicIndex]);

  if (!topic) return <div className="p-8">Loading Concept...</div>;
  const concept = topic.concepts[currentStep];

  if (isLocked) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-500">
        <div className="p-6 bg-slate-100 rounded-full mb-6">
          <Lock className="w-16 h-16 text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Locked Concept</h2>
        <p className="text-text-secondary text-lg mb-8 max-w-md">You need to complete the previous topics in this unit before you can unlock this concept. Keep learning!</p>
        <Button onClick={() => navigate(`/subject/${subjectId}`)} variant="primary">
          Return to Unit Path
        </Button>
      </div>
    );
  }

  const stepProgress = parseFloat((((currentStep + (mcqStatus === 'correct' ? 1 : 0)) / topic.concepts.length) * 100).toFixed(2));

  const handleNext = () => {
    if (currentStep < topic.concepts.length - 1) {
      setCurrentStep(prev => prev + 1);
      setMcqStatus(null);
      setSelectedOption(null);
    } else {
      // Completed last concept of the topic
      const nextTopicIndex = currentTopicIndex + 1;
      const newProgress = Math.min(100, parseFloat(((nextTopicIndex / unit.topics.length) * 100).toFixed(2)));
      updateProgress(subjectId, unitId, newProgress);
      
      if (nextTopicIndex < unit.topics.length) {
        navigate(`/subject/${subjectId}/unit/${unitId}/topic/${unit.topics[nextTopicIndex].id}`);
        setCurrentStep(0);
        setMcqStatus(null);
        setSelectedOption(null);
      } else {
        navigate(`/subject/${subjectId}`);
      }
    }
  };

  const checkAnswer = (index) => {
    setSelectedOption(index);
    const isCorrect = index === concept.mcq.correctAnswer;
    setMcqStatus(isCorrect ? 'correct' : 'incorrect');
    playFeedback(isCorrect);
    
    if (!isCorrect) {
      addWeakTopic(topic.title);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="flex flex-col gap-4">
        <button onClick={() => navigate(`/subject/${subjectId}`)} className="flex items-center text-sm font-medium text-text-secondary w-fit hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Curriculum
        </button>
        <ProgressBar progress={stepProgress} className="h-2" />
        <div className="flex justify-between items-end">
          <div>
            <span className="text-primary font-bold tracking-wider text-xs uppercase mb-1 block">Topic {currentTopicIndex + 1} of {unit.topics.length}</span>
            <h1 className="text-3xl font-bold">{topic.title}</h1>
          </div>
          <div className="bg-primary/5 text-primary px-4 py-2 rounded-xl border border-primary/10 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-bold">Step {currentStep + 1}/{topic.concepts.length}</span>
          </div>
        </div>
      </header>

      <Card className="p-8 space-y-8 shadow-md border-0 bg-white/70 backdrop-blur-sm">
        <div className="prose prose-slate max-w-none text-text-primary text-xl leading-relaxed">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeKatex]}
            components={{
              h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-primary mt-8 mb-4" {...props} />,
              table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full border-collapse border border-slate-200" {...props} /></div>,
              th: ({node, ...props}) => <th className="bg-slate-50 border border-slate-200 p-2 text-left font-bold" {...props} />,
              td: ({node, ...props}) => <td className="border border-slate-200 p-2" {...props} />,
              code: ({node, inline, ...props}) => inline ? <code className="bg-slate-100 px-1 rounded text-primary-hover font-mono text-sm" {...props} /> : <code className="block bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm my-4" {...props} />
            }}
          >
            {concept.theory}
          </ReactMarkdown>
        </div>

        {concept.interactive === 'MemoryAnalogy' && <MemoryAnalogy />}
        {concept.interactive === 'ALUSimulator' && <ALUSimulator />}
        {concept.interactive === 'StackSimulator' && <StackSimulator />}
        
        {concept.flowchart && <div className="p-6 bg-white rounded-2xl border-2 border-slate-100 shadow-inner"><MermaidChart chart={concept.flowchart} /></div>}
      </Card>

      <div className="pt-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">?</div>
          <h3 className="text-2xl font-bold">Knowledge Verification</h3>
        </div>
        
        <Card className={`p-8 border-2 shadow-xl transition-all duration-500 ${mcqStatus === 'correct' ? 'border-success bg-success/5' : mcqStatus === 'incorrect' ? 'border-error bg-error/5' : 'bg-white'}`}>
          <div className="font-bold text-xl mb-8 leading-tight">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{concept.mcq.question}</ReactMarkdown>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-8">
             {concept.mcq.options.map((opt, i) => (
               <Button
                 key={i}
                 variant="outline"
                 onClick={() => checkAnswer(i)}
                 disabled={mcqStatus === 'correct'}
                 className={`h-auto py-5 px-6 justify-start text-left normal-case tracking-normal text-lg transition-all
                  ${selectedOption === i ? 'ring-4 ring-primary/20 border-primary bg-primary/5' : 'hover:bg-slate-50'}
                  ${mcqStatus === 'correct' && i === concept.mcq.correctAnswer ? 'bg-success/10 border-success text-success-900 shadow-md shadow-success/10' : ''}
                  ${mcqStatus === 'incorrect' && selectedOption === i ? 'bg-error/10 border-error text-error-900' : ''}
                 `}
               >
                 <span className="w-10 h-10 rounded-xl bg-slate-100 border flex items-center justify-center mr-4 text-base font-bold shrink-0">
                   {String.fromCharCode(65 + i)}
                 </span>
                 <div className="flex-1">
                   <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{opt}</ReactMarkdown>
                 </div>
                 {mcqStatus === 'correct' && i === concept.mcq.correctAnswer && <CheckCircle className="w-6 h-6 text-success ml-2" />}
                 {mcqStatus === 'incorrect' && selectedOption === i && <XCircle className="w-6 h-6 text-error ml-2" />}
               </Button>
             ))}
          </div>

          {mcqStatus && (
            <div className={`p-6 rounded-2xl animate-in slide-in-from-top-4 flex flex-col gap-6 ${mcqStatus === 'correct' ? 'bg-success/10 text-success-900' : 'bg-error/10 text-error-900'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${mcqStatus === 'correct' ? 'bg-success text-white' : 'bg-error text-white'}`}>
                   {mcqStatus === 'correct' ? <CheckCircle className="w-8 h-8"/> : <XCircle className="w-8 h-8"/>}
                </div>
                <div>
                  <p className="font-bold text-lg">{mcqStatus === 'correct' ? 'Excellent Work!' : 'Revision Needed'}</p>
                  <p className="opacity-90 mt-1 text-lg">{concept.mcq.explanation}</p>
                </div>
              </div>
              <Button variant="primary" className="w-full sm:w-fit px-12 py-6 text-xl shadow-lg shadow-primary/25" onClick={handleNext}>
                 {currentStep < topic.concepts.length - 1 ? 'Next Step' : currentTopicIndex < unit.topics.length - 1 ? 'Next Topic' : 'Complete Unit'}
              </Button>
            </div>
          )}
        </Card>
      {/* Topic Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={goToPrevTopic} 
            disabled={!hasPrevTopic}
            className="flex items-center gap-2 px-6"
          >
            <ArrowLeft className="w-4 h-4" /> Previous Topic
          </Button>
          
          <div className="hidden sm:flex items-center gap-4 text-sm text-text-secondary font-medium">
            <span className="bg-slate-100 px-3 py-1 rounded-full">{topic.title}</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <span>{currentTopicIndex + 1} of {unit.topics.length}</span>
          </div>

          <Button 
            variant={hasNextTopic ? "outline" : "primary"}
            onClick={hasNextTopic ? goToNextTopic : () => navigate(`/subject/${subjectId}`)} 
            className="flex items-center gap-2 px-6"
          >
            {hasNextTopic ? 'Next Topic' : 'Finish Unit'} <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </footer>
      </div>
    </div>
  );
}
