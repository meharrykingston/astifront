'use client'; // Required for state management (mobile toggle)

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { UserCircle2 } from 'lucide-react';

const SEO_USER_NAME_KEY = 'seo_user_name';

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 16 ? 'Good Morning' : 'Good Evening';
  const [userName, setUserName] = useState('Admin User');

  React.useEffect(() => {
    const syncUserName = () => {
      const saved = window.localStorage.getItem(SEO_USER_NAME_KEY)?.trim();
      setUserName(saved || 'Admin User');
    };

    syncUserName();
    window.addEventListener('storage', syncUserName);
    window.addEventListener('seo-user-name-change', syncUserName);
    return () => {
      window.removeEventListener('storage', syncUserName);
      window.removeEventListener('seo-user-name-change', syncUserName);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-x-hidden p-4 transition-all duration-300 md:ml-70 sm:p-6">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 bg-white rounded-md shadow border border-gray-200"
            >
              Menu
            </button>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              {greeting}
            </p>
          </div>

          <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm shadow-sm">
            <UserCircle2 className="h-4! w-4! text-slate-600" />
            <span className="truncate font-medium text-slate-700">Hi {userName}</span>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="min-w-0 overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}

