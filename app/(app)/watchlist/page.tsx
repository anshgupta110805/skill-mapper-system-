'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BookmarkCheck, 
  TrendingUp, 
  Briefcase, 
  Trash2, 
  BellRing, 
  ExternalLink,
  Settings2,
  AlertTriangle
} from 'lucide-react';

const mockWatchlist = [
  { id: '1', role: 'Staff Software Engineer', companyType: 'Fintech Startup', matchScore: 88, salary: '$160k-$190k', demandRise: 15, trend: [40, 45, 55, 60, 75, 88], color: '#8b5cf6' },
  { id: '2', role: 'AI Solutions Architect', companyType: 'Enterprise', matchScore: 82, salary: '$180k-$210k', demandRise: 8, trend: [60, 62, 60, 65, 75, 82], color: '#3b82f6' },
  { id: '3', role: 'Lead Frontend Developer', companyType: 'E-commerce', matchScore: 94, salary: '$130k-$160k', demandRise: -5, trend: [80, 85, 90, 85, 70, 65], color: '#f43f5e' }
];

const mockChartData = [
  { day: 'Day 1', role1: 40, role2: 60, role3: 80 },
  { day: 'Day 6', role1: 45, role2: 62, role3: 85 },
  { day: 'Day 12', role1: 55, role2: 60, role3: 90 },
  { day: 'Day 18', role1: 60, role2: 65, role3: 85 },
  { day: 'Day 24', role1: 75, role2: 75, role3: 70 },
  { day: 'Day 30', role1: 88, role2: 82, role3: 65 },
];

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(mockWatchlist);
  const [threshold, setThreshold] = useState(10);
  const [showSettings, setShowSettings] = useState(false);

  const removeRole = (id: string) => {
    setWatchlist(watchlist.filter(w => w.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
         <div className="space-y-1">
           <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
             <BookmarkCheck className="w-8 h-8 text-purple-600" /> Watchlist
           </h1>
           <p className="text-muted-foreground">Monitor demand vectors for your targeted roles.</p>
         </div>
         <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-muted transition-colors text-sm font-bold shadow-sm">
           <Settings2 className="w-4 h-4" /> Alert Profile
         </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
             <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="font-bold flex items-center gap-2 mb-4"><BellRing className="w-5 h-5 text-amber-500" /> Notification Thresholds</h3>
                <div className="max-w-md space-y-4">
                   <p className="text-sm text-muted-foreground">Alert me via push notification when demand for a saved role spikes above this percentage threshold across 7 days.</p>
                   <div className="flex items-center gap-4">
                      <input type="range" min="5" max="50" step="5" value={threshold} onChange={e=>setThreshold(parseInt(e.target.value))} className="flex-1 accent-purple-600" />
                      <span className="font-bold text-xl">{threshold}%</span>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Roles List */}
         <div className="lg:col-span-4 space-y-4">
            <h3 className="font-bold text-lg mb-2">Saved Opportunities ({watchlist.length}/10)</h3>
            <AnimatePresence>
               {watchlist.map(role => (
                 <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={role.id} className="bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm group">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <h4 className="font-bold text-lg leading-tight">{role.role}</h4>
                         <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><Briefcase className="w-3 h-3"/> {role.companyType}</p>
                       </div>
                       {role.demandRise >= threshold && (
                         <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg flex shrink-0" title="Demand Spiking!">
                            <AlertTriangle className="w-4 h-4" />
                         </div>
                       )}
                    </div>

                    <div className="flex items-center justify-between text-sm font-bold border-y py-3 my-3">
                       <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">{role.matchScore}% Profile Match</span>
                       <span>{role.salary}</span>
                    </div>

                    <div className="flex items-end justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">30-Day Velocity</p>
                          <div className={`flex items-center gap-1 font-bold ${role.demandRise > 0 ? 'text-green-600' : 'text-red-500'}`}>
                             {role.demandRise > 0 ? <TrendingUp className="w-4 h-4"/> : <TrendingUp className="w-4 h-4 rotate-180 transform"/>} 
                             {Math.abs(role.demandRise)}%
                          </div>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => removeRole(role.id)} className="p-2 border rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          <button onClick={() => window.open(`https://www.google.com/search?q=${role.role}+jobs`, '_blank')} className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-md"><ExternalLink className="w-4 h-4" /></button>
                       </div>
                    </div>
                 </motion.div>
               ))}
               {watchlist.length === 0 && (
                 <div className="text-center p-8 border-2 border-dashed rounded-2xl text-muted-foreground">
                    <BookmarkCheck className="w-12 h-12 opacity-20 mx-auto mb-2" />
                    <p>Your watchlist is empty.</p>
                 </div>
               )}
            </AnimatePresence>
         </div>

         {/* Chart Area */}
         <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm sticky top-6">
               <h3 className="font-bold text-lg mb-6 flex items-center gap-2">Macro Demand Trends</h3>
               <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={mockChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="role1" name={mockWatchlist[0]?.role || 'Role 1'} stroke="#8b5cf6" strokeWidth={3} dot={{r: 4}} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="role2" name={mockWatchlist[1]?.role || 'Role 2'} stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                        <Line type="monotone" dataKey="role3" name={mockWatchlist[2]?.role || 'Role 3'} stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
         
      </div>
    </div>
  );
}
