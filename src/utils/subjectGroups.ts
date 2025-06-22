import { HSCCategory, Subject, SubjectGroup } from '../types/user';

export const subjectGroups: SubjectGroup[] = [
  {
    category: 'Pre-Engineering',
    compulsorySubjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'],
    electiveSubjects: ['Computer Science', 'Statistics'],
    description: {
      english: 'Focuses on Mathematics, Physics, and Chemistry. Ideal for students planning to pursue engineering, architecture, or related technical fields.',
      urdu: 'ریاضی، فزکس، اور کیمسٹری پر توجہ۔ انجینئرنگ، آرکیٹیکچر، یا متعلقہ تکنیکی شعبوں میں جانے والے طلباء کے لیے مثالی۔'
    }
  },
  {
    category: 'Pre-Medical',
    compulsorySubjects: ['Biology', 'Physics', 'Chemistry', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'],
    electiveSubjects: ['Mathematics', 'Psychology'],
    description: {
      english: 'Concentrates on Biology, Physics, and Chemistry. Perfect for students aiming for medical, dental, pharmacy, or life sciences careers.',
      urdu: 'بائیولوجی، فزکس، اور کیمسٹری پر توجہ۔ طبی، دندان سازی، فارمیسی، یا حیاتیاتی علوم میں کیریئر کے خواہشمند طلباء کے لیے بہترین۔'
    }
  },
  {
    category: 'Computer Science',
    compulsorySubjects: ['Computer Science', 'Mathematics', 'Physics', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'],
    electiveSubjects: ['Chemistry', 'Statistics', 'Economics'],
    description: {
      english: 'Emphasizes Computer Science, Mathematics, and Physics. Designed for students interested in software engineering, IT, and computer-related fields.',
      urdu: 'کمپیوٹر سائنس، ریاضی، اور فزکس پر زور۔ سافٹ ویئر انجینئرنگ، آئی ٹی، اور کمپیوٹر سے متعلقہ شعبوں میں دلچسپی رکھنے والے طلباء کے لیے ڈیزائن کیا گیا۔'
    }
  },
  {
    category: 'Commerce',
    compulsorySubjects: ['Economics', 'Mathematics', 'Statistics', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'],
    electiveSubjects: ['Computer Science', 'Geography', 'Psychology'],
    description: {
      english: 'Focuses on Economics, Mathematics, and Statistics. Suitable for students planning careers in business, finance, accounting, or commerce.',
      urdu: 'اکنامکس، ریاضی، اور شماریات پر توجہ۔ کاروبار، مالیات، اکاؤنٹنگ، یا تجارت میں کیریئر کی منصوبہ بندی کرنے والے طلباء کے لیے موزوں۔'
    }
  },
  {
    category: 'Arts',
    compulsorySubjects: ['English', 'Urdu', 'Islamiat', 'Pakistan Studies'],
    electiveSubjects: ['Psychology', 'Sociology', 'Philosophy', 'Fine Arts', 'Geography', 'History', 'Economics', 'Arabic', 'Persian', 'French', 'German'],
    description: {
      english: 'Offers flexibility with humanities subjects. Great for students interested in literature, social sciences, languages, or creative fields.',
      urdu: 'انسانی علوم کے مضامین کے ساتھ لچک فراہم کرتا ہے۔ ادب، سماجی علوم، زبانوں، یا تخلیقی شعبوں میں دلچسپی رکھنے والے طلباء کے لیے بہترین۔'
    }
  },
  {
    category: 'General Science',
    compulsorySubjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'],
    electiveSubjects: ['Biology', 'Computer Science', 'Statistics', 'Geography'],
    description: {
      english: 'Provides a broad science foundation with Physics, Chemistry, and Mathematics. Offers flexibility for various science-related career paths.',
      urdu: 'فزکس، کیمسٹری، اور ریاضی کے ساتھ وسیع سائنسی بنیاد فراہم کرتا ہے۔ مختلف سائنس سے متعلقہ کیریئر کے راستوں کے لیے لچک پیش کرتا ہے۔'
    }
  },
  {
    category: 'Home Economics',
    compulsorySubjects: ['Home Economics', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'],
    electiveSubjects: ['Biology', 'Chemistry', 'Psychology', 'Sociology', 'Fine Arts', 'Economics'],
    description: {
      english: 'Focuses on Home Economics with supporting subjects. Ideal for students interested in nutrition, textile design, family sciences, or hospitality.',
      urdu: 'ہوم اکنامکس پر توجہ کے ساتھ معاون مضامین۔ غذائیت، ٹیکسٹائل ڈیزائن، خاندانی علوم، یا مہمان نوازی میں دلچسپی رکھنے والے طلباء کے لیے مثالی۔'
    }
  }
];

export const getSubjectsByCategory = (category: HSCCategory): Subject[] => {
  const group = subjectGroups.find(g => g.category === category);
  if (!group) return [];
  
  return [...group.compulsorySubjects, ...group.electiveSubjects];
};

export const getCompulsorySubjects = (category: HSCCategory): Subject[] => {
  const group = subjectGroups.find(g => g.category === category);
  return group?.compulsorySubjects || [];
};

export const getElectiveSubjects = (category: HSCCategory): Subject[] => {
  const group = subjectGroups.find(g => g.category === category);
  return group?.electiveSubjects || [];
};

// For 9th and 10th grade - common subjects
export const matricSubjects: Subject[] = [
  'Mathematics',
  'Physics', 
  'Chemistry',
  'Biology',
  'English',
  'Urdu',
  'Islamiat',
  'Pakistan Studies',
  'Computer Science',
  'Geography',
  'History'
];