import { Subject, Board, Grade } from '../../types/user';

export interface ChapterInfo {
  id: string;
  number: number;
  title: string;
  titleUrdu?: string;
  topics: string[];
  topicsUrdu?: string[];
  learningObjectives: string[];
  keyFormulas?: string[];
  importantConcepts: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedStudyHours: number;
}

export interface SubjectCurriculum {
  subject: Subject;
  board: Board;
  grade: Grade;
  chapters: ChapterInfo[];
  examPattern: {
    totalMarks: number;
    timeLimit: number; // in minutes
    sections: {
      name: string;
      marks: number;
      questionTypes: string[];
    }[];
  };
}

// Physics curriculum for 9th grade Punjab Board
export const physics9thPunjab: SubjectCurriculum = {
  subject: 'Physics',
  board: 'Punjab',
  grade: '9th',
  chapters: [
    {
      id: 'phy9-ch1',
      number: 1,
      title: 'Physical Quantities and Measurement',
      titleUrdu: 'طبیعی مقادیر اور پیمائش',
      topics: [
        'Introduction to Physics',
        'Physical Quantities',
        'International System of Units',
        'Prefixes',
        'Scientific Notation',
        'Measuring Instruments',
        'Significant Figures'
      ],
      topicsUrdu: [
        'فزکس کا تعارف',
        'طبیعی مقادیر',
        'بین الاقوامی نظام اکائیاں',
        'سابقے',
        'سائنسی اعداد',
        'پیمائشی آلات',
        'اہم ہندسے'
      ],
      learningObjectives: [
        'Define physics and its scope',
        'Distinguish between base and derived quantities',
        'Use SI units correctly',
        'Apply scientific notation',
        'Calculate using significant figures'
      ],
      importantConcepts: [
        'Base quantities: Length, Mass, Time, Electric Current, Temperature, Amount of substance, Luminous intensity',
        'Derived quantities: Area, Volume, Density, Speed, Acceleration',
        'Prefixes: kilo, centi, milli, micro, nano',
        'Significant figures rules'
      ],
      difficulty: 'easy',
      estimatedStudyHours: 8
    },
    {
      id: 'phy9-ch2',
      number: 2,
      title: 'Kinematics',
      titleUrdu: 'حرکیات',
      topics: [
        'Rest and Motion',
        'Types of Motion',
        'Distance and Displacement',
        'Speed and Velocity',
        'Acceleration',
        'Equations of Motion',
        'Graphical Analysis'
      ],
      topicsUrdu: [
        'سکون اور حرکت',
        'حرکت کی اقسام',
        'فاصلہ اور نقل مکانی',
        'رفتار اور سرعت',
        'سرعت میں اضافہ',
        'حرکت کی مساوات',
        'گرافی تجزیہ'
      ],
      learningObjectives: [
        'Differentiate between distance and displacement',
        'Calculate speed, velocity and acceleration',
        'Apply equations of motion',
        'Interpret motion graphs'
      ],
      keyFormulas: [
        'v = u + at',
        's = ut + ½at²',
        'v² = u² + 2as',
        'Average velocity = Total displacement / Total time'
      ],
      importantConcepts: [
        'Scalar vs Vector quantities',
        'Uniform and non-uniform motion',
        'Acceleration due to gravity = 9.8 m/s²',
        'Slope of distance-time graph gives speed',
        'Slope of velocity-time graph gives acceleration'
      ],
      difficulty: 'medium',
      estimatedStudyHours: 12
    },
    {
      id: 'phy9-ch3',
      number: 3,
      title: 'Dynamics',
      titleUrdu: 'حرکیات',
      topics: [
        'Force',
        'Types of Forces',
        'Newton\'s Laws of Motion',
        'Momentum',
        'Conservation of Momentum',
        'Friction',
        'Circular Motion'
      ],
      topicsUrdu: [
        'قوت',
        'قوت کی اقسام',
        'نیوٹن کے قوانین حرکت',
        'رفتار',
        'رفتار کا تحفظ',
        'رگڑ',
        'دائروی حرکت'
      ],
      learningObjectives: [
        'State and apply Newton\'s laws of motion',
        'Calculate momentum and impulse',
        'Solve problems on friction',
        'Understand circular motion concepts'
      ],
      keyFormulas: [
        'F = ma',
        'p = mv',
        'Impulse = FΔt = Δp',
        'f = μN',
        'Fc = mv²/r'
      ],
      importantConcepts: [
        'Inertia and its types',
        'Action-reaction pairs',
        'Conservation of momentum',
        'Static and kinetic friction',
        'Centripetal force'
      ],
      difficulty: 'hard',
      estimatedStudyHours: 15
    }
  ],
  examPattern: {
    totalMarks: 85,
    timeLimit: 180,
    sections: [
      {
        name: 'Multiple Choice Questions',
        marks: 17,
        questionTypes: ['MCQ']
      },
      {
        name: 'Short Questions',
        marks: 32,
        questionTypes: ['Short Answer']
      },
      {
        name: 'Long Questions',
        marks: 36,
        questionTypes: ['Long Answer', 'Numerical Problems']
      }
    ]
  }
};

// Add more subjects and grades
export const curriculumDatabase: SubjectCurriculum[] = [
  physics9thPunjab,
  // Add more curricula here
];

export const getCurriculum = (subject: Subject, board: Board, grade: Grade): SubjectCurriculum | null => {
  return curriculumDatabase.find(
    curr => curr.subject === subject && curr.board === board && curr.grade === grade
  ) || null;
};

export const getChapterById = (chapterId: string): ChapterInfo | null => {
  for (const curriculum of curriculumDatabase) {
    const chapter = curriculum.chapters.find(ch => ch.id === chapterId);
    if (chapter) return chapter;
  }
  return null;
};