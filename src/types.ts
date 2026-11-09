export type EnglishLevel = 
  | 'A1 Beginner' 
  | 'A2 Elementary' 
  | 'B1 Intermediate' 
  | 'B2 Upper-Intermediate' 
  | 'C1 Advanced' 
  | 'C2 Proficient / Native';

export interface ReviewTags {
  communicationStyle: string[];
  helpfulness: string[];
  improvementAreas: string[];
}

export interface UserProfile {
  username: string;
  fullName: string;
  avatar: string;
  nativeLanguage: string;
  country: string;
  countryFlag: string;
  currentLevel: EnglishLevel;
  learningGoals: string[];
  interests: string[];
  bio: string;
  dailySpeakingTargetMinutes: number;
  speakingStreakDays: number;
  totalMinutesPracticed: number;
  partnerRatingAverage: number;
  badgesEarned: string[];
}

export interface PartnerReview {
  id: string;
  partnerId: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: EnglishLevel;
  rating: number; // 1 to 5 stars
  date: string;
  comment: string;
  tags: ReviewTags;
  endorsedBadges: string[];
  wouldPracticeAgain: boolean;
  topicDiscussed: string;
}

export interface SpeakingPartner {
  id: string;
  name: string;
  avatar: string;
  flag: string;
  country: string;
  nativeLanguage: string;
  targetLanguage: string;
  level: EnglishLevel;
  role: 'Learner' | 'Native Volunteer' | 'IELTS Candidate';
  bio: string;
  topics: string[];
  status: 'online' | 'busy' | 'scheduled';
  rating: number; // e.g. 4.9
  reviewCount: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalMinutesPracticed: number;
  badges: string[];
  reviews: PartnerReview[];
  voiceBio: {
    duration: string;
    transcript: string;
  };
  availability: string;
}

export interface TopicCard {
  id: string;
  category: 'IELTS Speaking' | 'Casual Daily' | 'Business & Tech' | 'Travel & Culture' | 'Debate & Philosophy';
  title: string;
  prompt: string;
  questions: string[];
  suggestedVocab: {
    word: string;
    ipa: string;
    definition: string;
    example: string;
  }[];
}

export interface SessionMessage {
  id: string;
  sender: 'me' | 'partner' | 'ai_coach' | 'system';
  speakerName: string;
  text: string;
  timestamp: string;
  audioDuration?: number;
  correction?: string;
}

export interface SessionNote {
  id: string;
  author: string;
  type: 'correction' | 'vocab' | 'idea';
  original?: string;
  suggested?: string;
  note: string;
  timestamp: string;
}
