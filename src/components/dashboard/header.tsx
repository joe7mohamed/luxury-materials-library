// components/dashboard/header.tsx
'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { Bell, User, Search } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b border-border h-16 flex items-center px-6 sticky top-0 z-10 bg-background">
      <div className="flex-1 flex items-center">
        <form className="w-full max-w-lg hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search materials, suppliers..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-border focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-secondary/50 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={18} />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.userType || 'Guest'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}