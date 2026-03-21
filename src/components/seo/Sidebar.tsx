'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from "./sidebar.module.css";
import { useSeoUser } from "./SeoAuthContext";
import {
  LayoutDashboard, FileText, AlertCircle, BookOpen, Link2, 
  KeyRound, Users, Image, Activity, MapPin, BarChart3, Settings, X
} from 'lucide-react';

const SEO_USER_NAME_KEY = 'seo_user_name';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Note: Paths now start with /indexcontrol/ because pages are inside this folder
const menuItems = [
  { name: 'Dashboard', path: '/indexcontrol/dashboard', icon: LayoutDashboard },
  { name: 'Pages', path: '/indexcontrol/pages', icon: FileText },
  { name: 'Keywords', path: '/indexcontrol/keywords', icon: KeyRound },
  { name: 'Content / Blog', path: '/indexcontrol/blog', icon: BookOpen },
  { name: 'On-page issues', path: '/indexcontrol/issues', icon: AlertCircle },
  { name: 'Technical (sitemaps, indexing, errors)', path: '/indexcontrol/signals', icon: Activity },
  { name: 'Backlinks', path: '/indexcontrol/backlinks', icon: Link2 },
  { name: 'Competitors', path: '/indexcontrol/competitors', icon: Users },
  { name: 'Semrush', path: '/indexcontrol/semrush', icon: BarChart3 },
  { name: 'Google Business', path: '/indexcontrol/google-business', icon: MapPin },
  { name: 'Assets', path: '/indexcontrol/assets', icon: Image },
  { name: 'Settings', path: '/indexcontrol/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = router.asPath || '';
  const [userName, setUserName] = useState('Admin User');
  const user = useSeoUser();

  useEffect(() => {
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

  const role = user?.role || "seo_viewer";
  const allowedItems = menuItems.filter((item) => {
    if (role === "seo_admin") return true;
    if (role === "seo_editor") return item.path !== "/indexcontrol/settings";
    return [
      "/indexcontrol/dashboard",
      "/indexcontrol/pages",
      "/indexcontrol/keywords",
      "/indexcontrol/blog",
      "/indexcontrol/issues",
      "/indexcontrol/signals",
      "/indexcontrol/backlinks",
      "/indexcontrol/competitors",
      "/indexcontrol/semrush",
      "/indexcontrol/google-business",
      "/indexcontrol/assets",
    ].includes(item.path);
  });

  const userInitial = user?.name?.charAt(0).toUpperCase() || userName.charAt(0).toUpperCase() || 'A';

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className={styles.brandIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-6.7-4.4-9.2-8C.7 10.3 1.4 6.6 4.4 5a5.4 5.4 0 0 1 5.9.7L12 7.1l1.7-1.4A5.4 5.4 0 0 1 19.6 5c3 1.6 3.7 5.3 1.6 8-2.5 3.6-9.2 8-9.2 8Z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-800">Astikan</span>
        </div>
        <button onClick={onClose} className="md:hidden text-slate-500 hover:text-slate-800">
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.navContainer}>
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link
              href={item.path}
              key={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              onClick={onClose}
            >
              <Icon className={styles.navIcon} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Card */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-linear-to-br from-blue-500 to-violet-500 text-white grid place-items-center text-base font-semibold">
            {userInitial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900">{userName}</p>
            <p className="truncate text-sm text-slate-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
