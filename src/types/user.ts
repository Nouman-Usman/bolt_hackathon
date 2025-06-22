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
  | 'Pakistan Studies'
  | 'Economics'
  | 'Statistics'
  | 'Psychology'
  | 'Sociology'
  | 'Philosophy'
  | 'Fine Arts'
  | 'Home Economics'
  | 'Geography'
  | 'History'
  | 'Civics'
  | 'Arabic'
  | 'Persian'
  | 'French'
  | 'German';

export type HSCCategory = 
  | 'Pre-Engineering'
  | 'Pre-Medical'
  | 'Computer Science'
  | 'Commerce'
  | 'Arts'
  | 'General Science'
  | 'Home Economics';

export interface SubjectGroup {
  category: HSCCategory;
  compulsorySubjects: Subject[];
  electiveSubjects: Subject[];
  description: {
    english: string;
    urdu: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  grade: Grade;
  board: Board;
  subjects: Subject[];
  hscCategory?: HSCCategory; // For 11th and 12th grade students
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