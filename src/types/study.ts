import { Subject } from './user';

export type TopicDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'shortAnswer' | 'longAnswer' | 'numerical';

export interface Chapter {
  id: string;
  subject: Subject;
  number: number;
  title: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  difficulty: TopicDifficulty;
  estimatedStudyTimeMinutes: number;
  completed: boolean;
  masteryLevel: number; // 0-100
}

export interface StudySession {
  id: string;
  userId: string;
  subject: Subject;
  topicIds: string[];
  plannedDurationMinutes: number;
  actualDurationMinutes?: number;
  completed: boolean;
  scheduledFor: Date;
  completedAt?: Date;
  notes?: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  sessions: StudySession[];
  endDate: Date;
}

export interface Question {
  id: string;
  topicId: string;
  type: QuestionType;
  text: {
    english: string;
    urdu?: string;
  };
  options?: {
    id: string;
    text: {
      english: string;
      urdu?: string;
    };
    isCorrect: boolean;
  }[];
  solution?: {
    english: string;
    urdu?: string;
  };
  difficulty: TopicDifficulty;
  marks: number;
}

export interface Quiz {
  id: string;
  userId: string;
  title: string;
  subject: Subject;
  topicIds: string[];
  questions: Question[];
  totalMarks: number;
  timeLimit?: number; // minutes
  createdAt: Date;
  completed: boolean;
  score?: number;
}