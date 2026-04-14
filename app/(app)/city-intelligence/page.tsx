'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  MapPin, 
  Search, 
  TrendingUp, 
  Building, 
  Users, 
  Briefcase, 
  Plus, 
  Lightbulb,
  Loader2
} from 'lucide-react';
import { generateCityIntelligenceFlow } from '@/ai/flows/generateCityIntelligenceFlow';
import { CityIntelligenceResult } from '@/types';
import { getLastCitySearch, saveLastCitySearch } from '@/lib/storage';

export default function CityIntelligencePage() {
  const [city, setCity] = useState('Bangalore');
  const [role, setRole] = useState('Frontend Developer');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CityIntelligenceResult | null>(null);

  const fetchIntel = async () => {
    setLoading(true);
    saveLastCitySearch(city, role);
    try {
      const result = await generateCityIntelligenceFlow({ city, role });
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const memory = getLastCitySearch();
    if (memory) {
       setCity(memory.city);
       setRole(memory.role);
    }
    // We fetch implicitly even if state sets haven't batched yet by passing locals manually
    // but the cleanest way is just to manually override the first fetch call vars if memory exists
    const runInitial = async () => {
       setLoading(true);
       try {
         const initialCity = memory ? memory.city : city;
         const initialRole = memory ? memory.role : role;
         const result = await generateCityIntelligenceFlow({ city: initialCity, role: initialRole });
         setData(result);
       } catch (e) {
         console.error(e);
       } finally {
         setLoading(false);
       }
    };
    runInitial();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-end">
         <div className="w-full md:flex-1 space-y-4 md:space-y-0 md:flex gap-4">
           <div className="flex-1 space-y-1">
             <label className="text-xs font-bold text-muted-foreground uppercase">Target City</label>
             <div className="relative">
               <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
               <input value={city} onChange={e=>setCity(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl pl-10 pr-4 py-2 font-bold focus:ring-2 focus:ring-purple-500 outline-none" />
             </div>
           </div>
           <div className="flex-1 space-y-1">
             <label className="text-xs font-bold text-muted-foreground uppercase">Target Role</label>
             <div className="relative">
               <Briefcase className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
               <input value={role} onChange={e=>setRole(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl pl-10 pr-4 py-2 font-bold focus:ring-2 focus:ring-purple-500 outline-none" />
             </div>
           </div>
         </div>
         <button onClick={fetchIntel} disabled={loading} className="w-full md:w-auto px-8 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
           {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Analyze</>}
         </button>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
           <motion.div key="loader" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-64 flex flex-col items-center justify-center text-muted-foreground">
             <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
             <p className="animate-pulse">Scraping labor market indexes...</p>
           </motion.div>
        )}

        {data && !loading && (
          <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm text-center">
                 <p className="text-xs text-muted-foreground font-bold uppercase mb-2 text-center">Demand Score</p>
                 <div className="flex items-center justify-center gap-2">
                   <TrendingUp className="w-6 h-6 text-green-500" />
                   <span className="text-3xl font-bold font-headline">{data.demandScore}/100</span>
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm text-center">
                 <p className="text-xs text-muted-foreground font-bold uppercase mb-2 text-center">Avg Salary</p>
                 <span className="text-3xl font-bold font-headline text-purple-600">{data.avgSalary.toLocaleString()}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm text-center">
                 <p className="text-xs text-muted-foreground font-bold uppercase mb-2 text-center">Active Openings</p>
                 <span className="text-3xl font-bold font-headline">{data.activeOpenings.toLocaleString()}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm text-center">
                 <p className="text-xs text-muted-foreground font-bold uppercase mb-2 text-center">Competition</p>
                 <span className={`text-2xl font-bold font-headline uppercase ${data.competitionLevel === 'High' ? 'text-red-500' : 'text-blue-500'}`}>{data.competitionLevel}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Left Column */}
               <div className="lg:col-span-8 space-y-8">
                  {/* Skill Chart */}
                  <div className="bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm">
                     <h3 className="font-bold text-lg mb-6">Top Required Skills</h3>
                     <div className="h-80 w-full text-xs font-bold">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={data.topSkills} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                              <XAxis type="number" domain={[0, 100]} hide />
                              <YAxis dataKey="skill" type="category" axisLine={false} tickLine={false} />
                              <RechartsTooltip cursor={{fill: 'rgba(139, 92, 246, 0.1)'}} contentStyle={{ borderRadius: '12px', fontWeight: 'bold' }} />
                              <Bar dataKey="demand" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Companies Grid */}
                  <div>
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Building className="w-5 h-5"/> Top Companies Hiring Now</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.companies.map((co, i) => (
                           <div key={i} className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm hover:border-purple-300 transition-colors cursor-pointer group">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                    <Building className="w-5 h-5 text-slate-500 group-hover:text-purple-600" />
                                 </div>
                                 <div>
                                   <p className="font-bold">{co.name}</p>
                                   <p className="text-xs text-muted-foreground">{co.openings} active roles</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-sm font-bold text-green-600">{co.salary}</p>
                                 {co.remote && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">REMOTE</span>}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right Column */}
               <div className="lg:col-span-4 space-y-8">
                  {/* AI Insights */}
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                     <div className="absolute -top-6 -right-6 opacity-10 pointer-events-none">
                        <Lightbulb className="w-40 h-40" />
                     </div>
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Market Insights</h3>
                     <ul className="space-y-4">
                        {data.insights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm shadow-sm border border-white/10">
                            <TrendingUp className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
                            <span className="text-sm font-medium leading-relaxed">{insight}</span>
                          </li>
                        ))}
                     </ul>
                  </div>

                  {/* Skill Gaps */}
                  <div className="bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm">
                     <h3 className="font-bold text-lg mb-4 text-red-600 flex items-center gap-2">Your Market Gaps</h3>
                     <p className="text-sm text-muted-foreground mb-4">Skills heavily requested in {city} that you lack.</p>
                     <div className="space-y-3">
                        {data.skillGaps.map(gap => (
                           <div key={gap} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                              <span className="font-bold text-red-900 dark:text-red-300">{gap}</span>
                              <button className="p-1.5 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-200 rounded-lg transition-colors" title="Add to learning path">
                                 <Plus className="w-4 h-4" />
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
