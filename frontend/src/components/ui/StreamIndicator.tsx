import React from 'react';
import { useStream } from '../../hooks/useStream';

export const StreamIndicator: React.FC = () => {
  const { connectionStatus } = useStream();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          dotColor: 'bg-green-500',
          icon: '🟢',
          text: 'Connected',
          pulse: false
        };
      case 'connecting':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          dotColor: 'bg-yellow-500',
          icon: '🟡',
          text: 'Connecting...',
          pulse: true
        };
      case 'disconnected':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          dotColor: 'bg-red-500',
          icon: '🔴',
          text: 'Disconnected',
          pulse: false
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          dotColor: 'bg-gray-500',
          icon: '⚪',
          text: 'Unknown',
          pulse: false
        };
    }
  };

  const status = getStatusConfig();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`card-linkedin px-4 py-3 ${status.bgColor}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${status.dotColor} ${status.pulse ? 'animate-pulse' : ''}`} />
          <span className={`text-sm font-medium ${status.color}`}>{status.text}</span>
        </div>
      </div>
    </div>
  );
};
