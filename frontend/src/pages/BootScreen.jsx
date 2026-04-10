import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { useExam } from '../context/ExamContext';
import { Command } from 'lucide-react';

export default function BootScreen() {
  const [username, setUsername] = useState('');
  const { loginOS } = useExam();

  const handleBoot = (e) => {
    e.preventDefault();
    if (username.trim().length > 0) {
      loginOS(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-10 animate-in zoom-in-95 duration-500 glass shadow-2xl rounded-[2.5rem] border-primary/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-20 h-20 glass-heavy rounded-3xl flex items-center justify-center text-primary mb-8 shadow-xl border border-primary/20">
            <Command className="w-10 h-10" />
          </div>
          
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 tracking-tighter">ExamOS <span className="text-text-main/50">V1</span></h1>
          <p className="text-text-dim text-lg font-bold mb-10 leading-tight">Adaptive Mastery Engine</p>
          
          <form onSubmit={handleBoot} className="w-full space-y-6">
             <div className="space-y-2">
                <label className="block text-xs font-black text-text-soft uppercase tracking-[0.2em] text-left ml-2">Pilot Identity</label>
                <input 
                  autoFocus
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full glass-light border-2 border-primary/10 focus:border-primary/50 rounded-2xl px-6 py-4 outline-none transition-all font-black text-xl text-center text-text-main placeholder:text-text-soft shadow-inner"
                  placeholder="USERNAME" 
                />
             </div>
             
             <Button type="submit" className="w-full h-16 text-xl font-black shadow-2xl shadow-primary/30 rounded-[1.5rem]" disabled={username.trim().length === 0}>
                INITIALIZE BOOT
             </Button>
          </form>
          
          <div className="mt-10 text-[10px] text-text-soft font-black uppercase tracking-widest opacity-60">
             Local Sandbox Encryption Active
          </div>
        </div>
      </Card>
    </div>
  );
}
