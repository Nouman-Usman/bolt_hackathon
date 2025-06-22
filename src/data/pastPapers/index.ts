import { Subject, Board, Grade } from '../../types/user';

export interface PastPaperQuestion {
  id: string;
  year: number;
  board: Board;
  subject: Subject;
  grade: Grade;
  section: string;
  questionNumber: number;
  questionText: string;
  questionTextUrdu?: string;
  type: 'MCQ' | 'Short Answer' | 'Long Answer' | 'Numerical';
  marks: number;
  chapterIds: string[];
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer?: string;
  solution?: string;
  solutionUrdu?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: number; // How often this type of question appears (1-5)
}

// Sample past paper questions for Physics 9th Punjab
export const physics9thPunjabPastPapers: PastPaperQuestion[] = [
  {
    id: 'phy9-2023-mcq-1',
    year: 2023,
    board: 'Punjab',
    subject: 'Physics',
    grade: '9th',
    section: 'MCQ',
    questionNumber: 1,
    questionText: 'The SI unit of length is:',
    questionTextUrdu: 'لمبائی کی ایس آئی اکائی ہے:',
    type: 'MCQ',
    marks: 1,
    chapterIds: ['phy9-ch1'],
    options: {
      a: 'meter',
      b: 'centimeter',
      c: 'kilometer',
      d: 'millimeter'
    },
    correctAnswer: 'a',
    solution: 'The SI unit of length is meter (m). It is one of the seven base units in the International System of Units.',
    difficulty: 'easy',
    frequency: 5
  },
  {
    id: 'phy9-2023-mcq-2',
    year: 2023,
    board: 'Punjab',
    subject: 'Physics',
    grade: '9th',
    section: 'MCQ',
    questionNumber: 2,
    questionText: 'Which of the following is a vector quantity?',
    questionTextUrdu: 'مندرجہ ذیل میں سے کون سی ویکٹر مقدار ہے؟',
    type: 'MCQ',
    marks: 1,
    chapterIds: ['phy9-ch2'],
    options: {
      a: 'Speed',
      b: 'Distance',
      c: 'Displacement',
      d: 'Time'
    },
    correctAnswer: 'c',
    solution: 'Displacement is a vector quantity because it has both magnitude and direction. Speed, distance, and time are scalar quantities.',
    difficulty: 'medium',
    frequency: 4
  },
  {
    id: 'phy9-2023-short-1',
    year: 2023,
    board: 'Punjab',
    subject: 'Physics',
    grade: '9th',
    section: 'Short Questions',
    questionNumber: 1,
    questionText: 'Define acceleration. Write its SI unit.',
    questionTextUrdu: 'سرعت میں اضافے کی تعریف کریں۔ اس کی ایس آئی اکائی لکھیں۔',
    type: 'Short Answer',
    marks: 2,
    chapterIds: ['phy9-ch2'],
    solution: 'Acceleration is the rate of change of velocity with respect to time. SI unit: m/s² (meter per second squared)',
    difficulty: 'easy',
    frequency: 5
  },
  {
    id: 'phy9-2023-numerical-1',
    year: 2023,
    board: 'Punjab',
    subject: 'Physics',
    grade: '9th',
    section: 'Long Questions',
    questionNumber: 1,
    questionText: 'A car starts from rest and accelerates uniformly at 2 m/s² for 10 seconds. Calculate: (a) Final velocity (b) Distance covered',
    questionTextUrdu: 'ایک کار سکون سے شروع ہو کر 10 سیکنڈ تک 2 m/s² کی یکساں سرعت سے تیز ہوتی ہے۔ حساب لگائیں: (a) حتمی رفتار (b) طے شدہ فاصلہ',
    type: 'Numerical',
    marks: 5,
    chapterIds: ['phy9-ch2'],
    solution: 'Given: u = 0, a = 2 m/s², t = 10 s\n(a) v = u + at = 0 + 2×10 = 20 m/s\n(b) s = ut + ½at² = 0×10 + ½×2×10² = 100 m',
    difficulty: 'medium',
    frequency: 4
  }
];

export const pastPapersDatabase: PastPaperQuestion[] = [
  ...physics9thPunjabPastPapers,
  // Add more past papers here
];

export const getPastPapers = (
  subject: Subject, 
  board: Board, 
  grade: Grade, 
  chapterIds?: string[]
): PastPaperQuestion[] => {
  let papers = pastPapersDatabase.filter(
    paper => paper.subject === subject && paper.board === board && paper.grade === grade
  );

  if (chapterIds && chapterIds.length > 0) {
    papers = papers.filter(paper => 
      paper.chapterIds.some(id => chapterIds.includes(id))
    );
  }

  return papers;
};

export const getQuestionsByType = (
  subject: Subject,
  board: Board,
  grade: Grade,
  type: string
): PastPaperQuestion[] => {
  return pastPapersDatabase.filter(
    paper => paper.subject === subject && 
             paper.board === board && 
             paper.grade === grade && 
             paper.type === type
  );
};