import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store';

interface HoldButtonProps {
  sectionId: string;
}

export const HoldButton: React.FC<HoldButtonProps> = ({ sectionId }) => {
  const { holds, claimHold, releaseHold } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(0);
  
  const currentHold = holds.find(hold => hold.sectionId === sectionId);
  const isHeld = !!currentHold;
  
  useEffect(() => {
    if (isHeld && currentHold) {
      const updateTimer = () => {
        const expiresAt = new Date(currentHold.expiresAt);
        const now = new Date();
        const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
        setTimeLeft(remaining);
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isHeld, currentHold]);
  
  const handleToggle = () => {
    if (isHeld) {
      releaseHold(sectionId);
    } else {
      claimHold(sectionId);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isHeld) {
    return (
      <button
        onClick={handleToggle}
        className="flex-1 btn-premium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
      >
        Release Hold ({formatTime(timeLeft)})
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="flex-1 btn-premium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
    >
      Claim Hold
    </button>
  );
};
