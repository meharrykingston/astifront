import React from 'react';
import Link from 'next/link';
import './sidebar.css';
import {
  LayoutDashboard, FileText, AlertCircle, BookOpen, Link2, 
  KeyRound, Users, Image, Activity, MapPin, X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Note: Paths now start with /seo/ because pages are inside this folder
const menuItems = [
  { name: 'Dashboard', path: '/seo/dashboard', icon: LayoutDashboard },
  { name: 'Pages', path: '/seo/pages', icon: FileText },
  { name: 'SEO Issues', path: '/seo/issues', icon: AlertCircle },
  { name: 'Blog', path: '/seo/blog', icon: BookOpen },
  { name: 'Backlinks', path: '/seo/backlinks', icon: Link2 },
  { name: 'Keywords', path: '/seo/keywords', icon: KeyRound },
  { name: 'Competitors', path: '/seo/competitors', icon: Users },
  { name: 'Assets', path: '/seo/assets', icon: Image },
  { name: 'Search Signals', path: '/seo/signals', icon: Activity },
  { name: 'Google Business', path: '/seo/google-business', icon: MapPin },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="brand-icon" aria-hidden="true">
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
      <nav className="nav-container">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.path} key={item.path} className="nav-item" onClick={onClose}>
              <Icon className="nav-icon" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;