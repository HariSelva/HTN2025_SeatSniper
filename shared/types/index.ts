export interface Section {
  id: string;
  courseId: string;
  title: string;
  instructor: string;
  timeSlot: string;
  days: string[];
  availableSeats: number;
  totalCapacity: number;
  enrollmentTotal: number;
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

// Chat-related types
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sources?: WebSource[];
  recommendations?: CourseRecommendation[];
  searchInfo?: SearchInfo;
}

export interface WebSource {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  sourceType: 'web';
  searchTimestamp: string;
}

export interface CourseRecommendation {
  courseCode: string;
  title: string;
  description: string;
  matchScore: number;
  rationale: string;
  prerequisites: string[];
  estimatedWorkload: string;
  bestSemester: string;
  potentialChallenges: string[];
  benefits: string[];
  hasDetailedInfo: boolean;
  databaseInfo?: any[];
}

export interface SearchInfo {
  databaseResults: number;
  webResults: number;
  hasRecommendations: boolean;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  userId?: string;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  sources: WebSource[];
  recommendations: CourseRecommendation[];
  searchInfo: SearchInfo;
}

export interface CourseRecommendationRequest {
  goals: string[];
  timeConstraints: {
    semester?: string;
    schedulePreference?: string;
    maxCourses?: number;
  };
  academicLevel: string;
  interests: string[];
}
