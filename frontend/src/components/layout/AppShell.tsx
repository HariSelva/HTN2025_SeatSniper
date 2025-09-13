import React from 'react';
import { NavBar } from './NavBar';
import { StreamIndicator } from '../ui/StreamIndicator';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <StreamIndicator />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
