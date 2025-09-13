import React from 'react';
import { useAppStore } from '@/store';

interface HoldButtonProps {
  sectionId: string;
}

export const HoldButton: React.FC<HoldButtonProps> = ({ sectionId }) => {
  const { holds, claimHold, releaseHold } = useAppStore();
  
  const currentHold = holds.find(hold => hold.sectionId === sectionId);
  const isHeld = !!currentHold;
  
  const handleToggle = () => {
    if (isHeld) {
      releaseHold(sectionId);
    } else {
      claimHold(sectionId);
    }
  };

  if (isHeld) {
    const expiresAt = new Date(currentHold.expiresAt);
    const now = new Date();
    const timeLeft = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
    
    return (
      <button
        onClick={handleToggle}
        className="px-4 py-2 rounded-md text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      >
        Release Hold ({timeLeft}s)
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="px-4 py-2 rounded-md text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200"
    >
      Claim Hold
    </button>
  );
};
