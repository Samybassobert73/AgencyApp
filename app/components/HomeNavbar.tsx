'use client';

import React from 'react';
import Link from 'next/link';
import Button from './Button';

export default function HomeNavbar() {
  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            AgencyApp
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>Inscription</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}