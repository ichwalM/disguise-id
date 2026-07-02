'use client';

import { useEffect, useState } from 'react';
import { Bell, Search, Clock } from 'lucide-react';

export default function DashboardHeader() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-zinc-900/80 backdrop-blur-md border-b border-emerald-500/20 z-30 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Clock size={16} className="text-emerald-500" />
          <span className="font-mono">{time}</span>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-emerald-500/20 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-zinc-400 hover:text-emerald-400 transition-colors hover:bg-emerald-500/10 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono">ONLINE</span>
        </div>
      </div>
    </header>
  );
}
