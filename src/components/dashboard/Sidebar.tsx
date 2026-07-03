'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions';
import {
  Menu, 
  X, 
  BarChart3, 
  FileText, 
  Zap, 
  Clock, 
  LogOut, 
  Settings,
  Home 
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Overview', href: '/dashboard', id: 'overview' },
  { icon: FileText, label: 'Kasus Forensik', href: '/dashboard/cases', id: 'cases' },
  { icon: Zap, label: 'Manajemen AI', href: '/dashboard/ai', id: 'ai' },
  { icon: Clock, label: 'Log Aktivitas', href: '/dashboard/logs', id: 'logs' },
];

interface SidebarProps {
  userEmail?: string;
  userName?: string;
}

export default function Sidebar({ userEmail = 'admin@disguise-id.com', userName = 'Admin' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-zinc-900/80 backdrop-blur-md border-r border-emerald-500/20 transition-transform duration-300 z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-emerald-500/20">
          <h1 className="text-xl font-bold text-emerald-400">
            DISGUISE<span className="text-cyan-400">-ID</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/30 group"
              >
                <Icon size={20} className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-4 h-px bg-emerald-500/10" />

        {/* Settings */}
        <div className="p-4">
          <a
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/30 group"
          >
            <Settings size={20} className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors" />
            <span className="text-sm font-medium">Settings</span>
          </a>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-500/20">
          {/* User Info */}
          <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
            <p className="text-xs font-semibold text-emerald-400 truncate">{userName}</p>
            <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <LogOut size={16} />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
