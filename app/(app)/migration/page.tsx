'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlaneTakeoff, 
  MapPin, 
  ArrowRight,
  Home,
  Coffee,
  Car,
  Receipt,
  TrendingUp,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe
} from 'lucide-react';
import { runMigrationSimFlow } from '@/ai/flows/runMigrationSimFlow';
import { MigrationResult } from '@/types';

export default function MigrationSimulatorPage() {
  const [formData, setFormData] = useState({
    currentCity: 'Bangalore',
    targetCity: 'London',
    role: 'Software Engineer',
    salary: '2500000'
  });
  
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sim = await runMigrationSimFlow({
        currentCity: formData.currentCity,
        targetCity: formData.targetCity,
        role: formData.role,
        salary: formData.salary
      });
      setResult(sim);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4 mb-8">
         <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center shrink-0">
            <PlaneTakeoff className="w-8 h-8" />
         </div>
         <div>
            <h1 className="text-3xl font-bold font-headline">Relocation Simulator</h1>
            <p className="text-muted-foreground">Calculate purchasing power math across borders.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Form Panel */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm">
               <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><MapPin className="w-5 h-5"/> Coordinates</h3>
               <form onSubmit={handleSimulate} className="space-y-5">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-muted-foreground uppercase">Current City</label>
                     <input value={formData.currentCity} onChange={e => setFormData({...formData, currentCity: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl font-bold" />
                  </div>
                  <div className="flex justify-center -my-2 z-10 relative">
                     <div className="w-8 h-8 bg-blue-100 border-4 border-white text-blue-700 rounded-full flex items-center justify-center"><ArrowRight className="w-4 h-4 transform rotate-90 lg:rotate-0" /></div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-muted-foreground uppercase">Target City</label>
                     <input value={formData.targetCity} onChange={e => setFormData({...formData, targetCity: e.target.value})} className="w-full bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-xl font-bold focus:ring-2 ring-blue-500 outline-none" />
                  </div>
                  
                  <div className="pt-4 border-t space-y-5">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Title</label>
                        <input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl text-sm" />
                     </div>
                     <div className="space-y-1">
                        <div className="flex justify-between items-end">
                           <label className="text-xs font-bold text-muted-foreground uppercase">Salary</label>
                           <button type="button" onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{currency}</button>
                        </div>
                        <input type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl font-mono font-bold text-lg" />
                     </div>
                  </div>

                  <button disabled={loading} className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Run AI Simulation"}
                  </button>
               </form>
            </div>
         </div>

         {/* Results Panel */}
         <div className="lg:col-span-8 relative min-h-[500px]">
            {!result && !loading && (
               <div className="absolute inset-0 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground bg-slate-50/50">
                  <Globe className="w-16 h-16 opacity-20 mb-4" />
                  <p className="font-medium">Enter details and run simulation to compute migration metrics.</p>
               </div>
            )}
            
            {loading && (
               <div className="absolute inset-0 border rounded-3xl flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10 space-y-4">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <p className="font-bold animate-pulse text-blue-900">Crunching global cost indexes...</p>
               </div>
            )}

            {result && !loading && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  
                  {/* Top line metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
                        <p className="text-green-100 font-bold uppercase text-xs mb-2">Salary Adjustment (PPP)</p>
                        <div className="text-4xl font-black mb-1">+{result.salaryAdjustmentPct}%</div>
                        <p className="text-xs">Adjusted for local market rate</p>
                     </div>
                     <div className="bg-white border p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center">
                        <TrendingUp className="w-8 h-8 text-amber-500 mb-2" />
                        <p className="text-muted-foreground text-xs font-bold uppercase">Cost of Living</p>
                        <div className="text-2xl font-bold text-amber-600">+{result.costOfLivingDeltaPct}%</div>
                     </div>
                     <div className="bg-white border p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center">
                        <Building className="w-8 h-8 text-blue-500 mb-2" />
                        <p className="text-muted-foreground text-xs font-bold uppercase">Market Demand</p>
                        <div className="text-2xl font-bold text-blue-600">{result.demandScore}/100</div>
                     </div>
                  </div>

                  {/* CoL Breakdown */}
                  <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                     <h3 className="font-bold text-lg mb-6">Cost Vector Analysis</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                           <Home className="w-5 h-5 text-indigo-500 mb-3" />
                           <p className="text-xs text-muted-foreground mb-1">Housing</p>
                           <p className="font-bold">{result.colBreakdown.housing > 0 ? '+' : ''}{result.colBreakdown.housing}%</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                           <Coffee className="w-5 h-5 text-orange-500 mb-3" />
                           <p className="text-xs text-muted-foreground mb-1">Food / Retail</p>
                           <p className="font-bold">{result.colBreakdown.food > 0 ? '+' : ''}{result.colBreakdown.food}%</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                           <Car className="w-5 h-5 text-zinc-500 mb-3" />
                           <p className="text-xs text-muted-foreground mb-1">Transport</p>
                           <p className="font-bold">{result.colBreakdown.transport > 0 ? '+' : ''}{result.colBreakdown.transport}%</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                           <Receipt className="w-5 h-5 text-red-500 mb-3" />
                           <p className="text-xs text-muted-foreground mb-1">Tax Bracket</p>
                           <p className="font-bold">{result.colBreakdown.tax > 0 ? '+' : ''}{result.colBreakdown.tax}%</p>
                        </div>
                     </div>
                  </div>

                  {/* Visual SVG Map connecting the two */}
                  <div className="h-48 bg-slate-900 rounded-2xl overflow-hidden relative border shadow-lg">
                     <span className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold rounded-full">Flight Path Vector</span>
                     <svg className="w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 800 200">
                        {/* Fake map dots */}
                        {Array.from({length: 100}).map((_, i) => (
                           <circle key={i} cx={Math.random()*800} cy={Math.random()*200} r={Math.random()*1.5} fill="#4f46e5" opacity={0.3} />
                        ))}
                        {/* Connecting Arc */}
                        <path d="M 200,100 Q 400,20 600,100" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                        <circle cx="200" cy="100" r="6" fill="#facc15" />
                        <circle cx="600" cy="100" r="6" fill="#10b981" />
                        <text x="200" y="125" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{formData.currentCity}</text>
                        <text x="600" y="125" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{formData.targetCity}</text>
                     </svg>
                  </div>

                  {/* Visa & Companies row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-6 rounded-2xl">
                        <div className="flex items-start gap-4">
                           <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                           <div>
                              <h4 className="font-bold text-amber-900 dark:text-amber-400 mb-2">Visa & Immigration Notes</h4>
                              <p className="text-sm text-amber-700 dark:text-amber-200 leading-relaxed">{result.visaNotes}</p>
                           </div>
                        </div>
                     </div>
                     <div className="bg-white dark:bg-slate-900 border p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold flex items-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5 text-green-500" /> Top Hiring Centers</h4>
                        <div className="flex flex-wrap gap-2">
                           {result.topCompanies.map(c => <span key={c} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium">{c}</span>)}
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}
         </div>
      </div>
    </div>
  );
}
