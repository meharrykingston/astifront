'use client'; // Required for state management (mobile toggle)

import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <main className="flex-1 md:ml-70 p-6 transition-all duration-300">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden mb-4 p-2 bg-white rounded-md shadow border border-gray-200"
        >
          Menu
        </button>
        
        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}