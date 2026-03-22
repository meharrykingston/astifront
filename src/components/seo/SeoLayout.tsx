'use client'; // Required for state management (mobile toggle)

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/router";
import { clearSeoToken, getSeoToken, getTokenExpiryMs, seoMe } from "@/services/seoAuthClient";
import { SeoAuthProvider } from "./SeoAuthContext";
import styles from "./sidebar.module.css";
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Admin User');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (router.pathname.startsWith("/indexcontrol/login")) {
      return;
    }

    const token = getSeoToken();
    if (!token) {
      void router.replace("/indexcontrol/login");
      return;
    }

    const bootstrap = async () => {
      try {
        const data = await seoMe(token);
        setUserName(data.user.name || "SEO User");
        setUserEmail(data.user.email);
        setUserRole(data.user.role);
      } catch {
        clearSeoToken();
        void router.replace("/indexcontrol/login");
      }
    };

    void bootstrap();

    const expiry = getTokenExpiryMs(token);
    if (expiry) {
      const timeoutMs = Math.max(expiry - Date.now() - 1000, 0);
      window.setTimeout(() => {
        clearSeoToken();
        void router.replace("/indexcontrol/login");
      }, timeoutMs);
    }
  }, [router]);

  useEffect(() => {
    if (router.pathname.startsWith("/indexcontrol/login")) {
      return;
    }

    const idleTimeoutMs = 20 * 60 * 1000;
    const resetIdle = () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        clearSeoToken();
        void router.replace("/indexcontrol/login");
      }, idleTimeoutMs);
    };

    resetIdle();
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetIdle));
    return () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      events.forEach((event) => window.removeEventListener(event, resetIdle));
    };
  }, [router]);

  return (
    <SeoAuthProvider value={userRole ? { name: userName, email: userEmail, role: userRole } : null}>
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50">
      <div
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.sidebarOverlayOpen : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-x-hidden p-4 transition-all duration-300 md:ml-70 sm:p-6">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden rounded-md border border-gray-200 bg-white p-2 shadow"
              aria-label="Open sidebar menu"
              title="Open menu"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
          </div>

          <div />
        </header>
        
        {/* Page Content */}
        <div className="min-w-0 overflow-x-hidden">{children}</div>
      </main>
    </div>
    </SeoAuthProvider>
  );
}
