import React from 'react';
import { useAppStore } from '@/store';

interface WatchButtonProps {
  sectionId: string;
}

export const WatchButton: React.FC<WatchButtonProps> = ({ sectionId }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useAppStore();
  
  const isWatched = watchlist.some(item => item.sectionId === sectionId);
  
  const handleToggle = () => {
    if (isWatched) {
      removeFromWatchlist(sectionId);
    } else {
      addToWatchlist(sectionId);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isWatched
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}
    >
      {isWatched ? 'Unwatch' : 'Watch'}
    </button>
  );
};
