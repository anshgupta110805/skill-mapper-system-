'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Target, 
  ShieldCheck, 
  Zap, 
  Flame,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Bookmark,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { simulateCareerPathFlow } from '@/ai/flows/simulateCareerPathFlow';
import { getProfile, savePath } from '@/lib/storage';
import { CareerSimulationResult, CareerPath } from '@/types';

export default function CareerRoutesPage() {
  const [formData, setFormData] = useState({
    targetRole: '',
    targetCity: 'Remote',
    experienceYears: 5,
    salaryExpectation: 120000,
    workPreference: 'Remote',
    priority: 'Speed'
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CareerSimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.targetRole.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const profile = getProfile() || {};
      const sim = await simulateCareerPathFlow({ 
        profile, 
        targetRole: formData.targetRole, 
        city: formData.targetCity,
        prefs: formData 
      });
      setResults(sim);
    } catch (err) {
      setError("AI Simulation Failed");
    } finally {
      setLoading(false);
    }
  };

  const saveSelectedPath = (path: CareerPath) => {
    savePath(path);
    alert(`Saved ${path.title} to your active paths!`);
  };

  const PathCard = ({ path, type, icon: Icon, colorClass }: { path: CareerPath, type: string, icon: any, colorClass: string }) => (
    <div className={`p-6 bg-white dark:bg-slate-900 border-2 rounded-2xl flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden ${colorClass}`}>
       <div className={`absolute top-0 right-0 p-4 opacity-5 pointer-events-none`}>
         <Icon className="w-32 h-32" />
       </div>
       <div className="flex items-center gap-3 mb-6 z-10">
         <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border"><Icon className="w-6 h-6" /></div>
         <div>
           <p className="text-sm font-bold uppercase tracking-wider opacity-80">{type}</p>
           <h3 className="text-xl font-bold font-headline">{path.title}</h3>
         </div>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-6 z-10">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border">
             <p className="text-xs text-muted-foreground font-bold mb-1"><Clock className="w-3 h-3 inline"/> Timeline</p>
             <p className="font-bold text-lg">{path.timeToTransitionMonths} Months</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border">
             <p className="text-xs text-muted-foreground font-bold mb-1"><Target className="w-3 h-3 inline"/> Risk Score</p>
             <p className="font-bold text-lg">{path.riskScore}/10</p>
          </div>
       </div>

       <div className="mb-6 z-10">
          <h4 className="text-sm font-bold mb-2">Salary Impact</h4>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">+{path.salaryDeltaPct}%</span>
            <TrendingUp className="text-green-600 w-5 h-5" />
          </div>
       </div>

       <div className="space-y-4 flex-1 z-10">
          <div>
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">Missing Skills ({path.missingSkills?.length || 0})</h4>
            <div className="flex flex-col gap-1">
               {path.missingSkills?.map(s => (
                 <label key={s} className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" className="rounded text-purple-600" /> {s}</label>
               ))}
            </div>
          </div>
          {path.certificationsNeeded?.length > 0 && (
             <div>
               <h4 className="text-sm font-bold mb-2 flex items-center gap-2">Certifications</h4>
               <ul className="text-sm list-disc pl-5 text-purple-700 dark:text-purple-400 font-medium space-y-1">
                  {path.certificationsNeeded.map(c => <li key={c}>{c}</li>)}
               </ul>
             </div>
          )}
       </div>

       <div className="mt-8 pt-4 border-t z-10 flex gap-2">
         <button onClick={() => saveSelectedPath(path)} className="flex-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-black py-3 rounded-xl font-bold hover:opacity-90 transition">Start Path</button>
         <button className="p-3 border-2 rounded-xl text-muted-foreground hover:text-purple-600 hover:border-purple-200 transition"><Bookmark className="w-5 h-5" /></button>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2 text-center max-w-2xl mx-auto mb-10">
         <h1 className="text-4xl font-bold font-headline tracking-tight">AI Career Simulator</h1>
         <p className="text-lg text-muted-foreground">Adjust parameters below and let SkillMapper generate targeted roadmaps to reach your next career milestone.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-3xl shadow-sm p-6 md:p-8">
         <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-2">
               <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Target Role</label>
               <div className="relative">
                 <Briefcase className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                 <input 
                   required
                   value={formData.targetRole} onChange={e => setFormData({...formData, targetRole: e.target.value})}
                   className="w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-xl pl-10 pr-4 py-3 font-bold text-lg focus:outline-none focus:border-purple-500 transition-colors"
                   placeholder="e.g. Lead Engineer"
                 />
               </div>
            </div>

            <div className="md:col-span-3 space-y-2">
               <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Experience (Yrs)</label>
               <div className="pt-2">
                  <input type="range" min="0" max="25" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value)})} className="w-full accent-purple-600" />
                  <div className="text-center font-bold text-purple-700">{formData.experienceYears} Years</div>
               </div>
            </div>

            <div className="md:col-span-5 space-y-2">
               <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Work Preference</label>
               <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                 {['Remote', 'Hybrid', 'Onsite'].map(mode => (
                   <button 
                     key={mode} type="button"
                     onClick={() => setFormData({...formData, workPreference: mode})}
                     className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.workPreference === mode ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-700 dark:text-purple-400' : 'text-muted-foreground hover:text-foreground'}`}
                   >
                     {mode}
                   </button>
                 ))}
               </div>
            </div>

            <div className="md:col-span-12 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                 <span className="text-sm font-bold">Optimization Target:</span>
                 <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="bg-slate-50 border px-4 py-2 rounded-lg text-sm font-bold focus:outline-none">
                    <option>Speed</option>
                    <option>Salary</option>
                    <option>Stability</option>
                 </select>
               </div>
               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Computing...</> : <><Zap className="w-5 h-5" /> Generate Paths</>}
               </button>
            </div>
         </form>

         {error && (
           <p className="mt-4 text-center font-bold text-red-500 flex justify-center items-center gap-2"><AlertTriangle className="w-5 h-5"/> {error}</p>
         )}
      </div>

      <AnimatePresence>
        {results && !loading && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
             
             {/* 3 Paths Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PathCard path={results.safe} type="Safe Route" icon={ShieldCheck} colorClass="border-blue-200 hover:border-blue-400" />
                <PathCard path={results.accelerated} type="Accelerated" icon={Zap} colorClass="border-purple-300 shadow-md transform md:-translate-y-4 hover:border-purple-500" />
                <PathCard path={results.bold} type="Bold Jump" icon={Flame} colorClass="border-orange-200 hover:border-orange-400" />
             </div>

             {/* Comparison Table */}
             <div className="bg-white dark:bg-slate-900 border rounded-2xl shadow-sm overflow-hidden text-sm">
                <div className="bg-slate-50 dark:bg-slate-950/50 p-6 border-b">
                   <h3 className="text-xl font-bold font-headline">Detailed Matrix</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-900 border-b">
                           <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider">Metrics</th>
                           <th className="p-4 font-bold text-center border-l w-1/4">Safe</th>
                           <th className="p-4 font-bold text-center border-l bg-purple-50/50 dark:bg-purple-900/10 text-purple-700 w-1/4">Accelerated ✨</th>
                           <th className="p-4 font-bold text-center border-l w-1/4">Bold</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-4 font-medium flex items-center gap-2"><Clock className="w-4 h-4"/> Timeline</td>
                          <td className="p-4 text-center border-l">{results.safe.timeToTransitionMonths} mos</td>
                          <td className="p-4 text-center border-l bg-purple-50/50 dark:bg-purple-900/10 font-bold">{results.accelerated.timeToTransitionMonths} mos</td>
                          <td className="p-4 text-center border-l">{results.bold.timeToTransitionMonths} mos</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 font-medium flex items-center gap-2"><DollarSign className="w-4 h-4"/> Salary Delta</td>
                          <td className="p-4 text-center border-l text-green-600">+{results.safe.salaryDeltaPct}%</td>
                          <td className="p-4 text-center border-l bg-purple-50/50 dark:bg-purple-900/10 font-bold text-green-600">+{results.accelerated.salaryDeltaPct}%</td>
                          <td className="p-4 text-center border-l text-green-600">+{results.bold.salaryDeltaPct}%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 font-medium flex items-center gap-2"><Target className="w-4 h-4"/> Risk Level</td>
                          <td className="p-4 text-center border-l">{results.safe.riskScore}/10</td>
                          <td className="p-4 text-center border-l bg-purple-50/50 dark:bg-purple-900/10 font-bold">{results.accelerated.riskScore}/10</td>
                          <td className="p-4 text-center border-l text-red-500">{results.bold.riskScore}/10</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Remote Fit</td>
                          <td className="p-4 text-center border-l">{results.safe.isRemoteFriendly ? 'Yes' : 'No'}</td>
                          <td className="p-4 text-center border-l bg-purple-50/50 dark:bg-purple-900/10 font-bold">{results.accelerated.isRemoteFriendly ? 'Yes' : 'No'}</td>
                          <td className="p-4 text-center border-l">{results.bold.isRemoteFriendly ? 'Yes' : 'No'}</td>
                        </tr>
                      </tbody>
                   </table>
                </div>
             </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
