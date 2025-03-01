'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Navbar'; // Note: file is still named Navbar.tsx but component is Sidebar
import HomeNavbar from './HomeNavbar';
import { usePathname } from 'next/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Only show the HomeNavbar if user is not logged in and on the homepage
  const showHomeNavbar = !user && pathname === '/';
  
  return (
    <>
      {user ? <Sidebar /> : showHomeNavbar && <HomeNavbar />}
      
      {/* Adjust layout based on whether user is logged in */}
      <main className={`min-h-screen ${user ? 'pt-20 lg:pt-8 lg:pl-64' : showHomeNavbar ? 'pt-20' : ''}`}>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {children}
        </div>
      </main>
    </>
  );
}