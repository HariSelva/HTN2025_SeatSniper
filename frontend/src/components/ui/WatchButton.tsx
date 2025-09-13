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
      className={`flex-1 btn-premium ${
        isWatched
          ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
          : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
      }`}
    >
      {isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
};
