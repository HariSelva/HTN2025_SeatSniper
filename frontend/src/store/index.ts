import { create } from 'zustand';
import { User, Section, WatchlistItem, Hold } from '@/types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Data state
  sections: Section[];
  watchlist: WatchlistItem[];
  holds: Hold[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setSections: (sections: Section[]) => void;
  setWatchlist: (watchlist: WatchlistItem[]) => void;
  setHolds: (holds: Hold[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Watchlist actions
  addToWatchlist: (sectionId: string) => void;
  removeFromWatchlist: (sectionId: string) => void;
  
  // Hold actions
  claimHold: (sectionId: string) => void;
  releaseHold: (sectionId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  sections: [],
  watchlist: [],
  holds: [],
  isLoading: false,
  error: null,
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSections: (sections) => set({ sections }),
  setWatchlist: (watchlist) => set({ watchlist }),
  setHolds: (holds) => set({ holds }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // Watchlist actions
  addToWatchlist: (sectionId) => {
    const { watchlist, user } = get();
    if (!user) return;
    
    const newItem: WatchlistItem = {
      userId: user.id,
      sectionId,
      addedAt: new Date().toISOString(),
    };
    
    set({ watchlist: [...watchlist, newItem] });
  },
  
  removeFromWatchlist: (sectionId) => {
    const { watchlist } = get();
    set({ watchlist: watchlist.filter(item => item.sectionId !== sectionId) });
  },
  
  // Hold actions
  claimHold: (sectionId) => {
    const { holds, user } = get();
    if (!user) return;
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes
    
    const newHold: Hold = {
      userId: user.id,
      sectionId,
      claimedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
    
    set({ holds: [...holds, newHold] });
  },
  
  releaseHold: (sectionId) => {
    const { holds } = get();
    set({ holds: holds.filter(hold => hold.sectionId !== sectionId) });
  },
}));
