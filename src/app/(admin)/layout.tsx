"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  DatabaseZap,
  Users,
  Menu,
  X,
  Search,
  Bell,
  Edit3
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'SEO Dashboard', icon: LayoutDashboard, href: '/seo' },
    { name: 'Bulk Upload', icon: DatabaseZap, href: '/seo/upload' },
    { name: 'pSEO Templates', icon: Search, href: '/seo/templates' },
    { name: 'Blog Editor', icon: Edit3, href: '/content/blog' },
    { name: 'Team Management', icon: Users, href: '/users' },
  ];

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans text-black">
      {/* Mobile Sidebar  */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white text-black transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:inset-0 border-r border-black shrink-0
      `}>
        {/* LOGO SECTION */}
        <div className="flex items-center h-20 px-6 border-b border-gray-100">
          <Link href="/seo" className="block transition-opacity hover:opacity-80">
            <Image 
              src="/AstikanLogoFull.png" 
              alt="Astikan Healthcare"
              width={180} 
              height={45}  
              className="object-contain"
              priority 
            />
          </Link>
          <button className="lg:hidden ml-auto p-1 text-black" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all group
                  ${isActive 
                    ? 'bg-black text-white shadow-xl' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'}
                `}
              >
                <div className="w-5 h-5 flex items-center justify-center mr-3 shrink-0">
                  <item.icon size={20} className="shrink-0" />
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
        <header className="h-16 bg-white border-b border-black flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 bg-gray-100 rounded-lg text-black shrink-0" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="relative w-full max-w-md group hidden sm:block">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 flex items-center justify-center group-focus-within:text-black transition-colors">
                <Search size={16} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold transition-all outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 focus:border-black"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all relative group">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <Bell size={20} />
              </div>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-black rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
              <div className="h-9 w-9 rounded-xl overflow-hidden border border-black cursor-pointer hover:bg-gray-100 transition-all shadow-sm shrink-0">
                <Image 
                  src="/user.png" 
                  alt="User Profile" 
                  width={36} 
                  height={36} 
                  className="object-cover grayscale"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-white p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}