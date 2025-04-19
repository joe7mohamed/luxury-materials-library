// app/(dashboard)/layout.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import Header from '@/components/dashboard/header';
import Sidebar from '@/components/dashboard/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Determine the appropriate sidebar based on user type
  let userType: 'admin' | 'supplier' | 'projectOwner';
  
  switch (user.userType) {
    case 'admin':
      userType = 'admin';
      break;
    case 'supplier':
      userType = 'supplier';
      break;
    case 'projectOwner':
      userType = 'projectOwner';
      break;
    default:
      redirect('/');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar userType={userType} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
}