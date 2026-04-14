'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  ArrowRight, 
  Briefcase, 
  Building, 
  ChevronRight, 
  Lightbulb, 
  Loader2, 
  MapPin, 
  TrendingUp,
  X,
  Target
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  Treemap, 
  LineChart, 
  Line, 
  Tooltip 
} from 'recharts';
import { getProfile, getDailyMetrics, updateDailyMetric } from '@/lib/storage';
import { generateDashboardInsightsFlow } from '@/ai/flows/generateDashboardInsightsFlow';
import { DashboardInsights } from '@/types';

// Skill Heatmap data format for Recharts Treemap
const heatmapData = [
  { name: 'Frontend', children: [{ name: 'React', size: 90 }, { name: 'Next.js', size: 80 }, { name: 'Tailwind', size: 70 }] },
  { name: 'Backend', children: [{ name: 'Node.js', size: 60 }, { name: 'Python', size: 40 }] },
  { name: 'DevOps', children: [{ name: 'AWS', size: 30 }, { name: 'Docker', size: 25 }] },
  { name: 'Soft Skills', children: [{ name: 'Leadership', size: 85 }, { name: 'Communication', size: 95 }] }
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const CustomTreemapContent = (props: any) => {
  const { depth, x, y, width, height, index, name } = props;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? COLORS[index % COLORS.length] : '#ffffff00',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 50 && height > 30 && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={12} dominantBaseline="central">
          {name}
        </text>
      )}
    </g>
  );
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const gravityHistory = getDailyMetrics('gravity_score');
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = getProfile() || {};
      const insights = await generateDashboardInsightsFlow({ profile });
      setData(insights);
      updateDailyMetric('gravity_score', insights.gravityScore);
    } catch (err) {
      setError("Failed to load dashboard insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <p className="text-muted-foreground animate-pulse">Running Ollama models...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
           <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="font-bold text-xl">Could not load dashboard</h3>
        <p className="text-muted-foreground">{error}</p>
        <button onClick={loadData} className="px-6 py-2 bg-purple-600 text-white rounded-lg">Retry AI Generation</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-end">
         <div className="space-y-1">
           <h1 className="text-3xl font-bold font-headline">Welcome back</h1>
           <p className="text-muted-foreground">Here is your strategic career intelligence for today.</p>
         </div>
         <button onClick={loadData} className="px-4 py-2 border rounded-lg text-sm hover:bg-muted flex items-center gap-2">
           <TrendingUp className="w-4 h-4" /> Refresh Signals
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column (Main Stats + Heatmap) */}
        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {/* Gravity Score Card */}
             <div className="p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start z-10 relative">
                   <div>
                     <h3 className="font-bold text-lg">Gravity Score</h3>
                     <p className="text-sm text-muted-foreground">Your career momentum score</p>
                   </div>
                   <Target className="text-purple-200 dark:text-purple-900 w-12 h-12 absolute right-4 top-4 transform group-hover:scale-110 transition-transform" />
                </div>
                <div className="mt-6 flex items-center gap-6 z-10 relative">
                   <div className="relative size-24 shrink-0">
                      <svg viewBox="0 0 36 36" className="size-24 transform -rotate-90">
                         <path
                           className="text-muted/30"
                           strokeWidth="3"
                           stroke="currentColor"
                           fill="none"
                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                         />
                         <path
                           className={`${data.gravityScore > 70 ? 'text-green-500' : data.gravityScore > 40 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                           strokeWidth="3"
                           strokeDasharray={`${data.gravityScore}, 100`}
                           strokeLinecap="round"
                           stroke="currentColor"
                           fill="none"
                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                         />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                         <span className="text-2xl font-bold">{data.gravityScore}</span>
                      </div>
                   </div>
                   <div className="flex-1">
                      <div className="h-12 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={gravityHistory}>
                               <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                            </LineChart>
                         </ResponsiveContainer>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-right">7-day trend <span className="text-green-500">+{data.gravityTrend}</span></p>
                   </div>
                </div>
             </div>

             {/* Priority Actions */}
             <div className="p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-lg">AI Priority Actions</h3>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto">
                   {data.priorityActions.map(action => (
                     <div key={action.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border rounded-xl">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-semibold text-sm">{action.title}</h4>
                           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${action.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                             {action.impact} Impact
                           </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
                        <button className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
                          Start Now <ArrowRight className="w-3 h-3" />
                        </button>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Skill Heatmap */}
          <div className="p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
             <h3 className="font-bold text-lg mb-6">Skill Density Heatmap</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <Treemap
                     data={heatmapData}
                     dataKey="size"
                     aspectRatio={4 / 3}
                     stroke="#fff"
                     content={<CustomTreemapContent />}
                   />
                </ResponsiveContainer>
             </div>
          </div>
          
          {/* Launch Windows Feed */}
          <div className="p-6 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Launch Windows</h3>
                <div className="flex gap-2">
                   <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Best Match</button>
                   <button className="px-3 py-1 bg-muted rounded-full text-xs font-medium hover:bg-slate-200">Remote</button>
                </div>
             </div>
             <div className="space-y-3">
                {data.launchWindows.map(window => (
                  <div key={window.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl hover:border-purple-300 transition-colors bg-slate-50 dark:bg-slate-950/50">
                     <div className="flex gap-4 items-center mb-3 sm:mb-0">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 border shadow-sm rounded-lg flex items-center justify-center shrink-0">
                           <Building className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                           <h4 className="font-bold">{window.role}</h4>
                           <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {window.companyType}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {window.location}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                        <div className="text-right flex-1 sm:flex-none">
                           <p className="font-bold text-sm bg-green-100 text-green-700 inline-block px-2 py-0.5 rounded-md">{window.matchScore}% Match</p>
                           <p className="text-xs text-muted-foreground mt-1">{window.salaryRange}</p>
                        </div>
                        <button className="p-2 border rounded-lg hover:bg-purple-50 text-purple-600 transition-colors">
                           <ChevronRight className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="md:col-span-4 space-y-6">
           {/* Risk Flags Panel */}
           <div className="bg-white dark:bg-slate-900 border rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 border-b flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5 text-red-500" />
                 <h3 className="font-bold">Risk Flags</h3>
              </div>
              <div className="p-4 space-y-3">
                 {data.riskFlags.map((risk, idx) => (
                   <motion.div 
                     key={risk.id} 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: idx * 0.1 }}
                     className={`p-3 rounded-lg flex justify-between items-start gap-3 border ${
                       risk.severity === 'Critical' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-900 dark:text-red-200' :
                       risk.severity === 'Warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-900 dark:text-amber-200' :
                       'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-blue-900 dark:text-blue-200'
                     }`}
                   >
                     <p className="text-sm font-medium leading-tight">{risk.title}</p>
                     <button className="opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
                   </motion.div>
                 ))}
                 {data.riskFlags.length === 0 && (
                   <p className="text-center text-sm text-muted-foreground p-4">No active risks detected.</p>
                 )}
              </div>
           </div>

           {/* Quick Stats Sidebar Ad */}
           <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
              <p className="text-sm text-white/80 mb-4">Unlock advanced labor market analysis and personalized mock interviews.</p>
              <button className="w-full py-2 bg-white text-purple-700 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                View Features
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
