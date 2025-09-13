import React, { useState } from 'react';
import { ChatWithAIPage } from './ChatWithAIPage';
import { DiscoverPage } from './DiscoverPage';
import { CalendarPage } from './CalendarPage';
import { ProfilePage } from './ProfilePage';

type TabType = 'chat' | 'discover' | 'calendar' | 'profile';

const tabs = [
  {
    id: 'chat' as TabType,
    label: 'Chat with AI',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    id: 'discover' as TabType,
    label: 'Discover',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    id: 'calendar' as TabType,
    label: 'Your Calendar',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'profile' as TabType,
    label: 'Your Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  }
];

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('discover');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatWithAIPage />;
      case 'discover':
        return <DiscoverPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DiscoverPage />;
    }
  };

  return (
    <div className="page-container">
      {/* LinkedIn-style Navigation */}
      <div className="nav-linkedin">
        <div className="container-linkedin">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="avatar-linkedin w-9 h-9 text-sm">
                H
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Hack the North</h1>
                <p className="text-xs text-gray-500">Course Assistant</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-container">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="avatar-linkedin text-sm">
                AJ
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
                <p className="text-xs text-gray-500">University of Waterloo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="flex-1">
        {renderTabContent()}
      </main>
    </div>
  );
};
