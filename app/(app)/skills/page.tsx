'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Trash2, 
  Plus, 
  Swords, 
  X,
  Target,
  BookOpen,
  Building
} from 'lucide-react';
import { getProfile, saveProfile } from '@/lib/storage';
import { scoreSkillDemandFlow } from '@/ai/flows/scoreSkillDemandFlow';

const chartData = [
  { name: 'Remote', React: 95, TypeScript: 88, GraphQL: 72 },
  { name: 'Bangalore', React: 90, TypeScript: 85, GraphQL: 60 },
  { name: 'Mumbai', React: 85, TypeScript: 80, GraphQL: 55 },
  { name: 'Delhi', React: 75, TypeScript: 70, GraphQL: 40 },
  { name: 'Global', React: 98, TypeScript: 92, GraphQL: 80 },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'battle'>('profile');
  
  // Drawer state
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [skillDetails, setSkillDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Battle Mode state
  const [jdText, setJdText] = useState('');
  const [battleResult, setBattleResult] = useState<any>(null);

  useEffect(() => {
    const profile = getProfile();
    if (profile?.skills) {
      setSkills(profile.skills);
    }
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      saveProfile({ skills: updated });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = skills.filter(s => s !== skill);
    setSkills(updated);
    saveProfile({ skills: updated });
  };

  const openSkillDetail = async (skill: string) => {
    setSelectedSkill(skill);
    setLoadingDetails(true);
    try {
      const details = await scoreSkillDemandFlow({ skill });
      setSkillDetails(details);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetails(false);
    }
  };

  const runBattleMode = () => {
    if (!jdText.trim()) return;
    // Mock simulation for battle mode
    setBattleResult({
      matchScore: 68,
      missing: ['GraphQL', 'Apollo', 'Microservices'],
      exceeded: ['Tailwind', 'Figma'],
      overlapping: ['React', 'TypeScript']
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
         <div className="space-y-1">
           <h1 className="text-3xl font-bold font-headline">Skill Intelligence</h1>
           <p className="text-muted-foreground">Manage your toolkit and measure your market force.</p>
         </div>
         <div className="flex bg-muted p-1 rounded-xl">
           <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-white shadow-sm text-purple-700' : 'text-muted-foreground'}`}>My Profile</button>
           <button onClick={() => setActiveTab('battle')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'battle' ? 'bg-white shadow-sm text-purple-700' : 'text-muted-foreground'}`}>
             <Swords className="w-4 h-4" /> Battle Mode
           </button>
         </div>
      </div>

      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Left Area */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Skill Demand Chart */}
            <div className="p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">Top Skills Demand by Region</h3>
                 <select className="border rounded-lg px-3 py-1 text-sm bg-slate-50 dark:bg-slate-800">
                    <option>All Regions</option>
                    <option>India Only</option>
                 </select>
               </div>
               <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                      <Legend iconType="circle" />
                      <Bar dataKey="React" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="TypeScript" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="GraphQL" fill="#fbcfe8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Inventory List */}
            <div className="p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">Your Skill Inventory ({skills.length})</h3>
                 <form onSubmit={handleAddSkill} className="flex gap-2 relative">
                    <input 
                      value={newSkill} 
                      onChange={e => setNewSkill(e.target.value)}
                      placeholder="Add a skill..." 
                      className="border rounded-lg pl-3 pr-10 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 ring-purple-500" 
                    />
                    <button type="submit" className="absolute right-1 top-1 p-1 text-purple-600 bg-purple-50 rounded-md">
                      <Plus className="w-4 h-4" />
                    </button>
                 </form>
               </div>
               
               <div className="space-y-3">
                 {skills.map(skill => (
                   <div key={skill} onClick={() => openSkillDetail(skill)} className="flex items-center justify-between p-3 border rounded-xl hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-4 flex-1">
                         <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                           <Zap className="w-5 h-5 text-amber-500" />
                         </div>
                         <div className="flex-1 w-full">
                           <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold">{skill}</h4>
                              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                                <TrendingUp className="w-3 h-3" /> Rising
                              </div>
                           </div>
                           <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.floor(Math.random() * 40) + 50}%` }} />
                           </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 ml-8">
                         <div className="text-right hidden sm:block">
                           <p className="text-sm font-bold text-green-600">+$12k</p>
                           <p className="text-xs text-muted-foreground">Premium</p>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); handleRemoveSkill(skill); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                 ))}
                 {skills.length === 0 && (
                   <p className="text-center text-muted-foreground py-8">No skills in your inventory yet.</p>
                 )}
               </div>
            </div>
          </div>

          {/* Right Column: Recommendations */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
               <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                 <h3 className="font-bold">AI Skill Strategy</h3>
                 <p className="text-xs text-muted-foreground">Based on current trajectory</p>
               </div>
               <div className="p-4 space-y-6 flex-1">
                 <div>
                   <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1"><Plus className="w-4 h-4"/> Add These Next</h4>
                   <div className="flex flex-wrap gap-2">
                     {['GraphQL', 'Docker', 'AWS'].map(s => (
                       <button key={s} onClick={() => { setSkills(prev => [...prev, s]); setNewSkill(''); }} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold hover:bg-green-100 transition-colors">{s}</button>
                     ))}
                   </div>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-1"><Target className="w-4 h-4"/> Deepen Mastery</h4>
                   <div className="flex flex-wrap gap-2">
                     {['React', 'TypeScript'].map(s => (
                       <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">{s}</span>
                     ))}
                   </div>
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-1"><Minus className="w-4 h-4"/> Deprioritize</h4>
                   <div className="flex flex-wrap gap-2">
                     {['jQuery', 'Bootstrap'].map(s => (
                       <span key={s} className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold line-through">{s}</span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Battle Mode UI */}
      {activeTab === 'battle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm text-center">
             <Swords className="w-12 h-12 text-purple-600 mx-auto mb-4" />
             <h2 className="text-2xl font-bold font-headline mb-2">JD Battle Simulator</h2>
             <p className="text-muted-foreground w-full max-w-2xl mx-auto mb-6">Paste a Job Description below to see exactly how your skills stack up against employer requirements.</p>
             <textarea 
               value={jdText}
               onChange={e => setJdText(e.target.value)}
               className="w-full h-40 border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 ring-purple-500 bg-slate-50 dark:bg-slate-800"
               placeholder="Paste job description here..."
             />
             <button onClick={runBattleMode} disabled={!jdText.trim()} className="mt-4 px-8 py-3 bg-purple-600 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-purple-700 transition">
                Simulate Match
             </button>
          </div>

          {battleResult && (
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-purple-600 text-white rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                   <h3 className="font-bold text-lg mb-2 z-10">Match Score</h3>
                   <div className="text-7xl font-bold font-headline z-10">{battleResult.matchScore}%</div>
                   <p className="text-purple-100 mt-2 z-10 text-sm">Strong Foundation</p>
                </div>
                
                <div className="p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
                   <h3 className="font-bold text-red-600 flex items-center gap-2 mb-4"><X className="w-5 h-5"/> Missing Skills</h3>
                   <div className="flex flex-wrap gap-2">
                     {battleResult.missing.map((s: string) => <span key={s} className="px-3 py-1 border border-red-200 bg-red-50 text-red-700 rounded-full text-sm">{s}</span>)}
                   </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
                   <h3 className="font-bold text-green-600 flex items-center gap-2 mb-4"><Zap className="w-5 h-5"/> Exceeded Skills</h3>
                   <div className="flex flex-wrap gap-2">
                     {battleResult.exceeded.map((s: string) => <span key={s} className="px-3 py-1 border border-green-200 bg-green-50 text-green-700 rounded-full text-sm">{s}</span>)}
                   </div>
                </div>
             </motion.div>
          )}
        </motion.div>
      )}

      {/* Detail Drawer (Slide over) */}
      <AnimatePresence>
        {selectedSkill && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/40 z-40" 
              onClick={() => setSelectedSkill(null)} 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full md:w-[500px] h-full bg-background shadow-2xl border-l z-50 flex flex-col p-6 overflow-y-auto"
            >
               <button onClick={() => setSelectedSkill(null)} className="absolute top-6 right-6 p-2 bg-muted rounded-full hover:bg-slate-200 transition"><X className="w-5 h-5" /></button>
               
               <div className="mb-8">
                 <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mb-4"><Zap className="w-8 h-8" /></div>
                 <h2 className="text-3xl font-bold font-headline">{selectedSkill}</h2>
                 <p className="text-muted-foreground mt-1">Detailed market intelligence</p>
               </div>

               {loadingDetails ? (
                 <div className="flex flex-col items-center justify-center flex-1 space-y-3">
                   <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                   <p className="text-sm text-muted-foreground">Analyzing market footprint...</p>
                 </div>
               ) : skillDetails && (
                 <div className="space-y-8">
                    {/* Top Stats */}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900">
                          <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Demand Score</p>
                          <p className="text-2xl font-bold text-purple-700">{skillDetails.score}/100</p>
                       </div>
                       <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900">
                          <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Salary Premium</p>
                          <p className="text-2xl font-bold text-green-600">{skillDetails.salaryImpact}</p>
                       </div>
                    </div>

                    {/* Chart */}
                    <div className="border rounded-2xl p-4 shadow-sm">
                       <h4 className="font-bold mb-4 text-sm">12 Month Demand Trend</h4>
                       <div className="h-40 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={[{name: 'Jan', val: 40}, {name: 'Mar', val: 65}, {name: 'Jun', val: 80}, {name: 'Sep', val: skillDetails.score}]}>
                                <Line type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                                <Tooltip />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    {/* Top Companies */}
                    <div>
                      <h4 className="font-bold flex items-center gap-2 mb-3"><Building className="w-4 h-4"/> Who is hiring?</h4>
                      <div className="space-y-2">
                        {skillDetails.topCompanies?.map((c: string) => (
                           <div key={c} className="px-4 py-3 border rounded-xl text-sm font-medium flex justify-between items-center bg-slate-50/50">
                             {c} <ChevronRight className="w-4 h-4 text-slate-300" />
                           </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Action */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl text-white">
                       <h4 className="font-bold flex items-center gap-2 mb-2"><BookOpen className="w-4 h-4"/> Recommended Action</h4>
                       <p className="text-sm text-purple-100 mb-4">Estimated time to master advanced concepts: {skillDetails.timeToLearnWeeks} weeks.</p>
                       <button className="w-full bg-white text-purple-700 font-bold py-2 rounded-xl">Add to Learning Path</button>
                    </div>
                 </div>
               )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
