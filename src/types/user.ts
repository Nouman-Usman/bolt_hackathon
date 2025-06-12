export type LanguagePreference = 'english' | 'urdu';

export type Board = 
  | 'Punjab'
  | 'Sindh'
  | 'KPK'
  | 'Balochistan'
  | 'FBISE'
  | 'AKU-EB';

export type Grade = 
  | '9th'
  | '10th'
  | '11th'
  | '12th';

export type Subject = 
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Mathematics'
  | 'Computer Science'
  | 'English'
  | 'Urdu'
  | 'Islamiat'
  | 'Pakistan Studies';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  grade: Grade;
  board: Board;
  subjects: Subject[];
  languagePreference: LanguagePreference;
  examDate?: string;
  weeklyAvailableHours?: number;
  createdAt: Date;
  lastActive?: Date;
}

export interface StudyGoal {
  id: string;
  userId: string;
  subject: Subject;
  targetScore: number;
  deadline: Date;
  completed: boolean;
}