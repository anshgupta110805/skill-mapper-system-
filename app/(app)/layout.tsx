'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Zap, 
  Navigation, 
  Globe, 
  MapPin, 
  BookOpen, 
  Bookmark, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  ChevronLeft,
  X
} from 'lucide-react';
import { CopilotWidget } from '@/components/copilot/CopilotWidget';

const navItems = [
  { href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { href: '/skills', icon: <Zap className="w-5 h-5" />, label: 'Skills' },
  { href: '/career-routes', icon: <Navigation className="w-5 h-5" />, label: 'Career Routes' },
  { href: '/migration', icon: <Globe className="w-5 h-5" />, label: 'Migration Tools' },
  { href: '/city-intelligence', icon: <MapPin className="w-5 h-5" />, label: 'City Intelligence' },
  { href: '/learning-path', icon: <BookOpen className="w-5 h-5" />, label: 'Learning Path' },
  { href: '/watchlist', icon: <Bookmark className="w-5 h-5" />, label: 'Watchlist' },
  { href: '/report', icon: <FileText className="w-5 h-5" />, label: 'Career Report' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // If onboarding, just return children without sidebar
  if (pathname === '/onboarding') {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950">{children}</div>;
  }

  const activeNav = navItems.find(n => pathname.startsWith(n.href)) || navItems[0];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-background border-r transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center px-4 border-b">
          <div className="size-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shrink-0">S</div>
          {isSidebarOpen && <span className="ml-3 font-bold text-lg whitespace-nowrap font-headline text-purple-700 dark:text-purple-400">SkillMapper AI</span>}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <div className={isActive ? 'text-purple-600' : ''}>{item.icon}</div>
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t space-y-2">
           <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
           >
              <ChevronLeft className={`w-5 h-5 transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
              {isSidebarOpen && "Collapse"}
           </button>
           <div className={`flex items-center gap-3 px-3 py-2 ${!isSidebarOpen ? 'justify-center cursor-pointer' : ''}`}>
             <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
             {isSidebarOpen && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-medium truncate">User</p>
                 <p className="text-xs text-muted-foreground truncate">Free Plan</p>
               </div>
             )}
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-background border-b z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold font-headline">{activeNav?.label || 'Overview'}</h2>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={() => setNotificationsOpen(true)} className="p-2 relative rounded-full hover:bg-muted transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full" />
             </button>
          </div>
        </header>

        {/* Notifications Sidebar Slide-over */}
        {notificationsOpen && (
          <>
            <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setNotificationsOpen(false)} />
            <div className="fixed top-0 right-0 h-full w-80 bg-background border-l shadow-2xl z-50 p-6 flex flex-col animate-in slide-in-from-right duration-200">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">Notifications</h3>
                 <button onClick={() => setNotificationsOpen(false)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
               </div>
               <div className="space-y-4 flex-1 overflow-y-auto">
                 <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                   <p className="text-sm font-bold text-red-800 dark:text-red-400">Risk Flag: Skill Decay</p>
                   <p className="text-xs text-red-600/80 dark:text-red-300">Angular demand dropped 12% in your target city.</p>
                 </div>
                 <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                   <p className="text-sm font-bold text-blue-800 dark:text-blue-400">Weekly Briefing Ready</p>
                   <p className="text-xs text-blue-600/80 dark:text-blue-300">Check out your new tailored learning path for the week.</p>
                 </div>
               </div>
               <button className="w-full mt-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted" onClick={() => setNotificationsOpen(false)}>Mark all as read</button>
            </div>
          </>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed top-0 left-0 h-full w-64 bg-background border-r shadow-2xl z-50 p-4 flex flex-col md:hidden animate-in slide-in-from-left duration-200">
               <div className="flex flex-col h-full">
                 <div className="flex justify-between items-center mb-8 px-2">
                   <div className="flex items-center gap-3">
                     <div className="size-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl">S</div>
                     <span className="font-bold text-lg font-headline text-purple-700">SkillMapper</span>
                   </div>
                   <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6 text-muted-foreground"/></button>
                 </div>
                 <nav className="flex-1 space-y-1 overflow-y-auto">
                   {navItems.map(item => (
                     <Link 
                       key={item.href} 
                       href={item.href}
                       onClick={() => setIsMobileMenuOpen(false)}
                       className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${pathname.startsWith(item.href) ? 'bg-purple-100 text-purple-700 font-medium' : 'text-muted-foreground hover:bg-muted'}`}
                     >
                       {item.icon}
                       {item.label}
                     </Link>
                   ))}
                 </nav>
               </div>
            </div>
          </>
        )}

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          {children}
        </main>
      </div>
      
      {/* Copilot Widget rendered globally over the app */}
      <CopilotWidget />
    </div>
  );
}