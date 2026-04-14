'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock, 
  PlayCircle, 
  Trophy, 
  Zap,
  Loader2,
  RefreshCcw,
  ExternalLink
} from 'lucide-react';
import { generateLearningPathFlow } from '@/ai/flows/generateLearningPathFlow';
import { getCompletedWeeks, saveCompletedWeek, getProfile } from '@/lib/storage';
import { LearningPathResult } from '@/types';

export default function LearningPathPage() {
  const [data, setData] = useState<LearningPathResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const fetchPath = async () => {
    setLoading(true);
    try {
      const profile = getProfile() || { skills: [] };
      // In a real app we deduce skill gaps, here we pass generic parameters to bypass complexity
      const res = await generateLearningPathFlow({ skillGaps: ['React', 'Next.js'], targetRole: 'Senior Frontend', weeks: 8 });
      setData(res);
      setCompleted(getCompletedWeeks());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPath();
  }, []);

  const toggleComplete = (weekNum: number) => {
    if (completed.includes(weekNum)) {
      // Allow unchecking just in client state for UI flexibility
      setCompleted(completed.filter(w => w !== weekNum));
    } else {
      setCompleted([...completed, weekNum]);
      saveCompletedWeek(weekNum);
    }
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
      <p className="animate-pulse font-bold">Synthesizing curriculum timeline...</p>
    </div>
  );

  if (!data) return null;

  const percentDone = Math.round((completed.length / data.totalDurationWeeks) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 relative">
      <div className="flex justify-between items-start">
         <div>
            <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
               <BookOpen className="w-8 h-8 text-purple-600" /> AI Master Plan
            </h1>
            <p className="text-muted-foreground max-w-xl">A highly curated week-by-week timeline pointing you directly at the missing requirements for your next role.</p>
         </div>
         <button onClick={fetchPath} className="hidden sm:flex px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-bold rounded-xl transition-colors items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> Regenerate Path
         </button>
      </div>

      {/* Progress Card */}
      <div className="bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-sm">
         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-6">
            <div>
               <h3 className="font-bold text-xl">{data.totalDurationWeeks} Week Acceleration Plan</h3>
               <div className="flex gap-2 mt-2">
                 {data.targetSkills.map(skill => <span key={skill} className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-md">{skill}</span>)}
               </div>
            </div>
            <div className="text-right">
               <p className="text-sm text-green-600 font-bold mb-1">Expected Salary Uplift</p>
               <div className="text-3xl font-black">{data.estimatedSalaryUplift}</div>
            </div>
         </div>
         <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
               <span>Overall Completion</span>
               <span className="text-purple-600">{percentDone}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: `${percentDone}%` }} 
                 className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                 transition={{ duration: 1, ease: "easeOut" }}
               />
            </div>
            {percentDone === 100 && (
              <p className="text-green-600 font-bold text-sm text-center mt-4 flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5"/> Congratulations! You have completed the curriculum.
              </p>
            )}
         </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[28px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-200 before:via-slate-200 before:to-transparent">
         {data.weeklyPlans.map((week, index) => {
            const isDone = completed.includes(week.weekNumber);
            return (
              <div key={week.weekNumber} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group select-none">
                 {/* Center Dot */}
                 <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-ml-7 md:group-even:-mr-7 shadow-sm bg-white dark:bg-slate-900 z-10 transition-colors">
                    {isDone ? <CheckCircle2 className="w-7 h-7 text-purple-600" /> : <div className="font-bold text-slate-400 group-hover:text-purple-600 transition-colors">W{week.weekNumber}</div>}
                 </div>
                 
                 {/* Card */}
                 <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm hover:shadow-md transition-shadow group-hover:border-purple-200 dark:group-hover:border-purple-800">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className={`font-bold text-lg ${isDone ? 'text-muted-foreground line-through decoration-purple-500/50' : ''}`}>{week.topicTitle}</h3>
                       <button onClick={() => toggleComplete(week.weekNumber)} className={`p-1.5 rounded-lg border transition-colors shrink-0 tooltip-trigger ${isDone ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-slate-50 text-slate-400 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'}`}>
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                       </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{week.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                       <span className="bg-slate-100 dark:bg-slate-800 flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                         <Clock className="w-3 h-3"/> {week.timeEstimateHours} hrs
                       </span>
                    </div>

                    {/* Resources */}
                    <div className="space-y-2">
                       {week.resources.map(res => (
                         <a key={res.id} href={res.url !== '#' ? res.url : undefined} target="_blank" rel="noreferrer" className="block w-full p-3 bg-slate-50 dark:bg-slate-950 border rounded-xl hover:border-purple-300 transition-colors cursor-pointer text-left group/res">
                            <div className="flex justify-between items-start">
                               <div>
                                 <p className="text-sm font-bold flex items-center gap-1">{res.title} <ExternalLink className="w-3 h-3 opacity-0 group-hover/res:opacity-100 transition-opacity" /></p>
                                 <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">{res.platform}</p>
                               </div>
                               {res.isFree ? (
                                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">FREE</span>
                               ) : (
                                  <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">PAID</span>
                               )}
                            </div>
                         </a>
                       ))}
                    </div>
                 </div>
              </div>
            )
         })}
      </div>
      
      <button onClick={fetchPath} className="w-full sm:hidden py-4 border-2 border-dashed rounded-2xl text-muted-foreground font-bold hover:text-purple-600 hover:border-purple-300 transition-colors flex items-center justify-center gap-2">
         <RefreshCcw className="w-5 h-5" /> Regenerate Curriculum
      </button>

    </div>
  );
}
