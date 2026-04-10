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
    <div className="min-h-screen bg-background-main flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 animate-in zoom-in-95 duration-500 shadow-xl border-t-4 border-t-primary">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Command className="w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">ExamOS V1</h1>
          <p className="text-text-secondary mb-8">Personalized Interactive Learning Environment</p>
          
          <form onSubmit={handleBoot} className="w-full space-y-4">
             <div>
               <label className="block text-sm font-medium text-text-secondary text-left mb-1">Enter your profile name to boot</label>
               <input 
                 autoFocus
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full bg-background-soft border-2 border-border focus:border-primary rounded-xl px-4 py-3 outline-none transition-all font-medium text-lg text-center"
                 placeholder="e.g. Satoshi" 
               />
             </div>
             
             <Button type="submit" className="w-full h-12 text-lg shadow-sm" disabled={username.trim().length === 0}>
               Boot OS
             </Button>
          </form>
          
          <div className="mt-8 text-xs text-text-muted">
            Profiles are securely sandboxed inside your local browser storage.
          </div>
        </div>
      </Card>
    </div>
  );
}
