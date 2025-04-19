// components/dashboard/sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  Home,
  Package,
  Users,
  MessageSquare,
  Settings,
  Heart,
  LogOut,
  List,
  Grid,
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  userType: 'admin' | 'supplier' | 'projectOwner';
}

export default function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  // Define navigation links based on user type
  const getNavLinks = () => {
    switch (userType) {
      case 'admin':
        return [
          {
            name: 'Dashboard',
            href: '/admin',
            icon: <Home size={20} />,
            exact: true
          },
          {
            name: 'Users',
            href: '/admin/users',
            icon: <Users size={20} />,
            exact: false
          },
          {
            name: 'Products',
            href: '/admin/products',
            icon: <Package size={20} />,
            exact: false
          },
          {
            name: 'Categories',
            href: '/admin/categories',
            icon: <List size={20} />,
            exact: false
          },
          {
            name: 'Settings',
            href: '/admin/settings',
            icon: <Settings size={20} />,
            exact: false
          }
        ];
      case 'supplier':
        return [
          {
            name: 'Dashboard',
            href: '/supplier',
            icon: <Home size={20} />,
            exact: true
          },
          {
            name: 'My Products',
            href: '/supplier/products',
            icon: <Package size={20} />,
            exact: false
          },
          {
            name: 'Add Product',
            href: '/supplier/products/add',
            icon: <PlusCircle size={20} />,
            exact: true
          },
          {
            name: 'Quote Requests',
            href: '/supplier/quotes',
            icon: <MessageSquare size={20} />,
            exact: false
          },
          {
            name: 'Settings',
            href: '/supplier/settings',
            icon: <Settings size={20} />,
            exact: false
          }
        ];
      case 'projectOwner':
        return [
          {
            name: 'Dashboard',
            href: '/project-owner',
            icon: <Home size={20} />,
            exact: true
          },
          {
            name: 'Favorites',
            href: '/project-owner/favorites',
            icon: <Heart size={20} />,
            exact: false
          },
          {
            name: 'Quote Requests',
            href: '/project-owner/quotes',
            icon: <MessageSquare size={20} />,
            exact: false
          },
          {
            name: 'Browse Materials',
            href: '/materials',
            icon: <Grid size={20} />,
            exact: false
          },
          {
            name: 'Settings',
            href: '/project-owner/settings',
            icon: <Settings size={20} />,
            exact: false
          }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const isActive = (link: { href: string; exact: boolean }) => {
    if (link.exact) {
      return pathname === link.href;
    }
    return pathname.startsWith(link.href);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <span className="text-lg font-bold text-sidebar-foreground">
            Materials Library
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                  isActive(link)
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 pb-6 mt-auto">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}