import React from 'react';
import { useAppStore } from '@/store';

interface NotifyButtonProps {
  sectionId: string;
}

export const NotifyButton: React.FC<NotifyButtonProps> = ({ sectionId }) => {
  const { notifications, addNotification, removeNotification } = useAppStore();
  
  const isNotifying = notifications.some(notification => notification.sectionId === sectionId);
  
  const handleToggle = () => {
    if (isNotifying) {
      removeNotification(sectionId);
    } else {
      addNotification(sectionId);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex-1 btn-premium transition-all duration-200 ${
        isNotifying 
          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
      }`}
    >
      {isNotifying ? (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0 15 0v5z" />
          </svg>
          Notifications On
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0 15 0v5z" />
          </svg>
          Notify me when available
        </>
      )}
    </button>
  );
};
