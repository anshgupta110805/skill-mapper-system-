'use client';

import React from 'react';
import { 
  FileText, 
  Download, 
  MapPin, 
  Briefcase, 
  Calendar,
  Zap,
  TrendingUp,
  Target,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { getProfile } from '@/lib/storage';

export default function CareerReportPage() {
  const profile = getProfile() || { skills: ['React', 'TypeScript'], goal: 'Career Growth', timeline: '12' };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner (hidden when printing) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl text-white shadow-xl print:hidden">
         <div>
            <h1 className="text-2xl font-bold font-headline">Career DNA Report</h1>
            <p className="text-purple-100 text-sm">Generated securely via local AI projection.</p>
         </div>
         <button onClick={handlePrint} className="flex flex-nowrap shrink-0 items-center justify-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-colors">
            <Download className="w-5 h-5" /> Download PDF Status
         </button>
      </div>

      {/* The Printable Document */}
      <div id="print-area" className="bg-white print:bg-transparent dark:bg-slate-900 border print:border-none rounded-3xl print:rounded-none p-8 md:p-12 shadow-sm print:shadow-none space-y-12">
         
         {/* Title / Header */}
         <div className="border-b pb-8 flex justify-between items-end print:pb-4">
            <div>
               <h1 className="text-4xl font-black font-headline text-slate-900 dark:text-white print:text-black tracking-tight mb-2">SkillMapper AI Projection</h1>
               <div className="flex gap-4 text-sm font-bold text-muted-foreground print:text-gray-600">
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> Tech & Engineering</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Global Trajectory</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</span>
               </div>
            </div>
            <div className="text-right">
               <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-2 font-bold text-2xl print:bg-black print:text-white">68</div>
               <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Gravity Score</p>
            </div>
         </div>

         {/* Executive Summary */}
         <div>
           <h2 className="text-xl font-bold border-b-2 border-purple-600 print:border-black pb-2 mb-4 uppercase tracking-widest text-slate-900 dark:text-white print:text-black">Executive Summary</h2>
           <p className="text-slate-700 dark:text-slate-300 print:text-black leading-relaxed font-medium">
             Based on active signals mapping against your {profile.skills.length}-skill footprint, you hold strong competitive framing for modern web frameworks, but are tracking below median logic boundaries for cloud containerization. The most lucrative short-term pivot involves acquiring Go or Rust foundations alongside Kubernetes to qualify for Senior Platform Engineering roles.
           </p>
         </div>

         {/* Two Columns Layout */}
         <div className="grid grid-cols-2 gap-12">
            <div>
               <h2 className="text-xl font-bold border-b-2 border-purple-600 print:border-black pb-2 mb-4 uppercase tracking-widest text-slate-900 dark:text-white print:text-black">Current Core Strengths</h2>
               <div className="space-y-4">
                 <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 print:bg-gray-100 p-3 rounded-lg border">
                   <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white print:text-black"><Zap className="w-4 h-4 text-green-500"/> React Ecosystem</div>
                   <span className="text-sm font-bold text-green-600">High Demand</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 print:bg-gray-100 p-3 rounded-lg border">
                   <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white print:text-black"><Zap className="w-4 h-4 text-green-500"/> Typescript</div>
                   <span className="text-sm font-bold text-green-600">High Demand</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 print:bg-gray-100 p-3 rounded-lg border">
                   <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white print:text-black"><TrendingUp className="w-4 h-4 text-amber-500"/> Node.js</div>
                   <span className="text-sm font-bold text-amber-600">Stable</span>
                 </div>
               </div>
            </div>

            <div>
               <h2 className="text-xl font-bold border-b-2 border-purple-600 print:border-black pb-2 mb-4 uppercase tracking-widest text-slate-900 dark:text-white print:text-black">Recommended Career Evolution</h2>
               <div className="border rounded-2xl p-5 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10 print:border-gray-300 print:bg-white text-slate-900 dark:text-slate-100 print:text-black">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-lg flex items-center gap-2"><Target className="w-5 h-5 text-blue-600 print:text-black"/> Principal UX Eng</h3>
                   <span className="px-2 py-1 bg-green-100 text-green-700 font-bold text-xs rounded uppercase">Safe Roadmap</span>
                 </div>
                 <p className="text-sm mb-4">Capitalize on current strengths by leaning deeper into highly complex client-state management.</p>
                 <div className="space-y-1 text-sm font-medium">
                   <div className="flex justify-between border-b pb-1"><span>Target Salary</span> <span className="font-bold text-green-600">+$25k Delta</span></div>
                   <div className="flex justify-between border-b pb-1"><span>Transition Risk</span> <span className="font-bold">2/10 (Low)</span></div>
                   <div className="flex justify-between"><span>Missing Gaps</span> <span className="font-bold text-red-500">2 Skills</span></div>
                 </div>
               </div>
            </div>
         </div>

         {/* 90-Day Plan Table */}
         <div>
           <h2 className="text-xl font-bold border-b-2 border-purple-600 print:border-black pb-2 mb-4 uppercase tracking-widest text-slate-900 dark:text-white print:text-black">Actionable 90-Day Directive</h2>
           <table className="w-full text-left border-collapse border mt-4 text-slate-900 dark:text-white print:text-black">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 print:bg-gray-200">
                   <th className="p-3 border font-bold">Month</th>
                   <th className="p-3 border font-bold">Objective</th>
                   <th className="p-3 border font-bold">Deliverable</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                <tr>
                   <td className="p-3 border font-bold text-center">Month 1</td>
                   <td className="p-3 border">Master state-machine logic logic architecture.</td>
                   <td className="p-3 border flex items-center gap-2"><CheckSquare className="w-4 h-4 text-purple-600 print:text-black"/> Build isolated xState prototype</td>
                </tr>
                <tr>
                   <td className="p-3 border font-bold text-center bg-slate-50/50 dark:bg-slate-900 print:bg-white">Month 2</td>
                   <td className="p-3 border bg-slate-50/50 dark:bg-slate-900 print:bg-white">Acquire AWS Cloud Practitioner accreditation.</td>
                   <td className="p-3 border bg-slate-50/50 dark:bg-slate-900 print:bg-white flex items-center gap-2"><CheckSquare className="w-4 h-4 text-purple-600 print:text-black"/> Pass foundational exam</td>
                </tr>
                <tr>
                   <td className="p-3 border font-bold text-center">Month 3</td>
                   <td className="p-3 border">Deploy global load optimized NextJS build.</td>
                   <td className="p-3 border flex items-center gap-2"><CheckSquare className="w-4 h-4 text-purple-600 print:text-black"/> Score 100 on Core Web Vitals</td>
                </tr>
              </tbody>
           </table>
         </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
