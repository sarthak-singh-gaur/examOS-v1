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
      <header className="flex flex-col gap-6">
        <button onClick={() => navigate(`/subject/${subjectId}`)} className="flex items-center text-sm font-bold text-text-soft w-fit hover:text-primary transition-all group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Curriculum
        </button>
        <ProgressBar progress={stepProgress} className="h-3" />
        <div className="flex justify-between items-end">
          <div>
            <span className="text-primary font-black tracking-[0.2em] text-[10px] uppercase mb-1 block opacity-80">Topic {currentTopicIndex + 1} of {unit.topics.length}</span>
            <h1 className="text-4xl font-black text-text-main">{topic.title}</h1>
          </div>
          <div className="glass text-primary px-5 py-3 rounded-2xl border-primary/20 flex items-center gap-3 shadow-lg">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-black">Step {currentStep + 1} of {topic.concepts.length}</span>
          </div>
        </div>
      </header>

      <Card className="p-10 glass-heavy shadow-2xl space-y-10 border-primary/10">
        <div className="prose dark:prose-invert prose-slate max-w-none text-text-dim text-xl leading-relaxed">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeKatex]}
            components={{
              h3: ({node, ...props}) => <h3 className="text-3xl font-black text-text-main mt-12 mb-6 tracking-tight border-b border-primary/10 pb-2" {...props} />,
              p: ({node, ...props}) => <p className="mb-6" {...props} />,
              table: ({node, ...props}) => <div className="overflow-x-auto my-8 rounded-2xl glass border-primary/10 shadow-inner"><table className="min-w-full border-collapse" {...props} /></div>,
              th: ({node, ...props}) => <th className="bg-primary/5 border-b border-primary/10 p-4 text-left font-black text-text-main uppercase tracking-widest text-xs" {...props} />,
              td: ({node, ...props}) => <td className="border-b border-primary/5 p-4 text-text-dim" {...props} />,
              code: ({node, inline, ...props}) => inline 
                ? <code className="glass-light px-2 py-0.5 rounded text-primary font-mono text-sm border-primary/20" {...props} /> 
                : <code className="block black-glass text-slate-100 p-6 rounded-2xl font-mono text-sm my-8 shadow-2xl border border-primary/20 overflow-x-auto" {...props} />
            }}
          >
            {concept.theory}
          </ReactMarkdown>
        </div>

        {concept.interactive === 'MemoryAnalogy' && <MemoryAnalogy />}
        {concept.interactive === 'ALUSimulator' && <ALUSimulator />}
        {concept.interactive === 'StackSimulator' && <StackSimulator />}
        
        {concept.flowchart && <div className="p-8 glass-light rounded-[2.5rem] border border-primary/10 shadow-inner"><MermaidChart chart={concept.flowchart} /></div>}
      </Card>

      <div className="pt-12 border-t border-primary/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl glass-heavy flex items-center justify-center text-primary shadow-lg border-primary/20">
             <CheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-3xl font-black text-text-main">Knowledge Verification</h3>
        </div>
        
        <Card className={`p-10 glass shadow-2xl transition-all duration-500 border-2 ${mcqStatus === 'correct' ? 'border-success/50 bg-success/5' : mcqStatus === 'incorrect' ? 'border-error/50 bg-error/5' : 'border-primary/10'}`}>
          <div className="font-black text-2xl text-text-main mb-10 leading-relaxed tracking-tight">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{concept.mcq.question}</ReactMarkdown>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-8">
             {concept.mcq.options.map((opt, i) => (
               <Button
                 key={i}
                 variant="outline"
                 onClick={() => !mcqStatus && checkAnswer(i)}
                 className={`h-auto py-6 px-8 justify-start text-left normal-case tracking-normal text-xl rounded-2xl border-2 transition-all group
                  ${selectedOption === i ? 
                    (mcqStatus === 'correct' ? 'border-success bg-success/10 text-success' : 'border-error bg-error/10 text-error') : 
                    'glass-light hover:border-primary/50 hover:bg-primary/5 border-primary/5 text-text-dim hover:text-text-main'}
                  ${mcqStatus && selectedOption !== i ? 'opacity-40 grayscale-[0.8]' : ''}
                 `}
               >
                 <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-5 text-base font-black border-2 transition-colors
                   ${selectedOption === i ? 'bg-current text-white border-transparent shadow-lg' : 'glass border-primary/10 group-hover:border-primary/50'}
                 `}>
                   {String.fromCharCode(65 + i)}
                 </span>
                 <div className="flex-1 font-bold">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{opt}</ReactMarkdown>
                 </div>
                 {mcqStatus === 'correct' && i === concept.mcq.correctAnswer && <CheckCircle className="w-8 h-8 text-success ml-4 shrink-0" />}
                 {mcqStatus === 'incorrect' && selectedOption === i && <XCircle className="w-8 h-8 text-error ml-4 shrink-0" />}
               </Button>
             ))}
          </div>

          {mcqStatus && (
            <div className={`p-10 rounded-[2.5rem] animate-in slide-in-from-top-4 flex flex-col gap-8 border-2 backdrop-blur-xl ${mcqStatus === 'correct' ? 'border-success/30 bg-success/10' : 'border-error/30 bg-error/10'}`}>
               <div className="flex items-start gap-6">
                 <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl ${mcqStatus === 'correct' ? 'bg-success text-white shadow-success/40' : 'bg-error text-white shadow-error/40'}`}>
                    {mcqStatus === 'correct' ? <CheckCircle className="w-10 h-10"/> : <XCircle className="w-10 h-10"/>}
                 </div>
                 <div>
                   <p className={`font-black text-3xl tracking-tighter mb-2 ${mcqStatus === 'correct' ? 'text-success' : 'text-error'}`}>{mcqStatus === 'correct' ? 'Brilliant Mastery!' : 'Knowledge Gap Found'}</p>
                   <p className="text-text-dim text-xl font-medium leading-relaxed opacity-90">{concept.mcq.explanation}</p>
                 </div>
               </div>
               <Button variant="primary" className="w-full sm:w-fit px-16 py-6 text-2xl font-black shadow-2xl shadow-primary/30 rounded-[2rem] active:scale-95 transition-transform" onClick={handleNext}>
                  {currentStep < topic.concepts.length - 1 ? 'Next Step' : currentTopicIndex < unit.topics.length - 1 ? 'Next Topic' : 'Finish Unit'}
               </Button>
            </div>
          )}
        </Card>
      {/* Topic Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 glass backdrop-blur-2xl border-t border-primary/20 p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={goToPrevTopic} 
            disabled={!hasPrevTopic}
            className="flex items-center gap-3 px-8 h-12 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" /> Previous Topic
          </Button>
          
          <div className="hidden sm:flex items-center gap-6 text-sm text-text-soft font-black uppercase tracking-widest">
            <span className="glass px-4 py-1.5 rounded-xl border-primary/10 text-text-dim transition-all">{topic.title}</span>
            <div className="w-1.5 h-1.5 bg-primary/30 rounded-full"></div>
            <span className="text-text-soft">{currentTopicIndex + 1} of {unit.topics.length}</span>
          </div>

          <Button 
            variant={hasNextTopic ? "outline" : "primary"}
            onClick={hasNextTopic ? goToNextTopic : () => navigate(`/subject/${subjectId}`)} 
            className="flex items-center gap-3 px-8 h-12 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
          >
            {hasNextTopic ? 'Next Topic' : 'Finish Unit'} <ArrowLeft className="w-5 h-5 rotate-180" />
          </Button>
        </div>
      </footer>
      </div>
    </div>
  );
}
