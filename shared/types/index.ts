export interface Section {
  id: string;
  courseId: string;
  title: string;
  instructor: string;
  timeSlot: string;
  days: string[];
  availableSeats: number;
  totalCapacity: number;
  location: string;
  lastUpdated: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  isFull?: boolean;
}

export interface WatchlistItem {
  userId: string;
  sectionId: string;
  addedAt: string;
}

export interface Hold {
  userId: string;
  sectionId: string;
  claimedAt: string;
  expiresAt: string;
}

export interface Notification {
  userId: string;
  sectionId: string;
  addedAt: string;
}

export interface StreamEvent {
  eventType: 'seat_open' | 'hold_taken' | 'hold_expired';
  sectionId: string;
  data: Record<string, any>;
  timestamp: string;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
