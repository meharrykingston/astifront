"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Files,
  AlertCircle,
  Edit3,
  Link2,
  Key,
  Globe,
  FolderOpen,
  Rss,
  MapPin,
  Menu,
  X,
  Search,
  Bell
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Updated navigation list based on your specific requirements
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/seo' },
    { name: 'Pages', icon: Files, href: '/seo/pages' },
    { name: 'SEO Issues', icon: AlertCircle, href: '/seo/issues' },
    { name: 'Blog', icon: Edit3, href: '/content/blog' },
    { name: 'Backlinks', icon: Link2, href: '/seo/backlinks' },
    { name: 'Keywords', icon: Key, href: '/seo/keywords' },
    { name: 'Competitor Site', icon: Globe, href: '/seo/competitors' },
    { name: 'Assets', icon: FolderOpen, href: '/seo/assets' },
    { name: 'Search Engine Signal', icon: Rss, href: '/seo/signals' },
    { name: 'Google Business Profile', icon: MapPin, href: '/seo/google-business' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex overflow-hidden font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-600 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:inset-0 border-r border-slate-200 shrink-0
      `}>
        {/* LOGO SECTION */}
        <div className="flex items-center h-20 px-6 border-b border-slate-100">
          <Link href="/seo" className="block transition-opacity hover:opacity-80">
            <Image 
              src="/AstikanLogoFull.png" 
              alt="Astikan Healthcare"
              width={160} 
              height={40}  
              className="object-contain"
              priority 
            />
          </Link>
          <button className="lg:hidden ml-auto p-1 text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* NAV LIST */}
        <nav className="mt-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)] pb-10">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2.5 text-[13px] font-semibold rounded-xl transition-all group
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className={`w-8 h-8 flex items-center justify-center mr-2 shrink-0 rounded-lg transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-black'}`}>
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main UI Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 bg-slate-50 rounded-lg text-slate-600 shrink-0" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Desktop Search Bar */}
            <div className="relative w-full max-w-sm group hidden sm:block">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 flex items-center justify-center group-focus-within:text-indigo-500 transition-colors">
                <Search size={16} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search metrics..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold transition-all outline-none focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <Bell size={20} />
              </div>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="h-9 w-9 rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-indigo-300 transition-all shadow-sm shrink-0">
                <Image 
                  src="/user.png" 
                  alt="User Profile" 
                  width={36} 
                  height={36} 
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}