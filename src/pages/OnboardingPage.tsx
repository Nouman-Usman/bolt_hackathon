import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { 
  GraduationCap, 
  School, 
  Book, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Target,
  Brain,
  Globe,
  Sparkles,
  Users,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import translations from '../utils/translations';
import { Board, Subject, Grade } from '../types/user';

const OnboardingPage = () => {
  const { updateProfile } = useAuth();
  const { user, language, setLanguage } = useUser();
  const navigate = useNavigate();
  const t = translations[language];
  
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    grade: '' as Grade,
    board: '' as Board,
    subjects: [] as Subject[],
    examDate: '',
    weeklyHours: 10,
    languagePreference: language,
    studyGoals: [] as string[]
  });

  const totalSteps = 4;

  const handleContinue = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Submit form data
      const { error } = await updateProfile({
        grade: formData.grade,
        board: formData.board,
        subjects: formData.subjects,
        languagePreference: formData.languagePreference as 'english' | 'urdu',
        examDate: formData.examDate,
        weeklyAvailableHours: formData.weeklyHours,
      });

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      navigate('/');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectToggle = (subject: Subject) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.includes(subject)
        ? formData.subjects.filter(s => s !== subject)
        : [...formData.subjects, subject]
    });
  };

  const handleGoalToggle = (goal: string) => {
    setFormData({
      ...formData,
      studyGoals: formData.studyGoals.includes(goal)
        ? formData.studyGoals.filter(g => g !== goal)
        : [...formData.studyGoals, goal]
    });
  };

  const handleLanguageChange = (lang: 'english' | 'urdu') => {
    setLanguage(lang);
    setFormData({ ...formData, languagePreference: lang });
  };

  // Check if required fields are filled for current step
  const canContinue = () => {
    switch (step) {
      case 0: return !!formData.grade && !!formData.board;
      case 1: return formData.subjects.length > 0;
      case 2: return !!formData.examDate;
      case 3: return true;
      default: return false;
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const steps = [
    // Step 1: Education Info & Language
    <motion.div 
      key="education"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full">
          <School size={48} className="text-blue-600" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {language === 'english' ? 'Let\'s Get Started!' : 'آئیے شروع کرتے ہیں!'}
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {language === 'english' 
          ? 'Tell us about your education so we can personalize your learning experience.'
          : 'ہمیں اپنی تعلیم کے بارے میں بتائیں تاکہ ہم آپ کے سیکھنے کے تجربے کو ذاتی بنا سکیں۔'
        }
      </p>
      
      <div className="space-y-6 max-w-md mx-auto">
        {/* Language Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'english' ? 'Preferred Language' : 'ترجیحی زبان'}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleLanguageChange('english')}
              className={`p-4 rounded-xl border-2 transition-all ${
                language === 'english'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Globe size={20} className="mx-auto mb-2" />
              <span className="font-medium">English</span>
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('urdu')}
              className={`p-4 rounded-xl border-2 transition-all ${
                language === 'urdu'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Globe size={20} className="mx-auto mb-2" />
              <span className="font-medium">اردو</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.grade}</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          >
            <option value="">
              {language === 'english' ? 'Select your grade' : 'اپنی جماعت منتخب کریں'}
            </option>
            <option value="9th">9th</option>
            <option value="10th">10th (Matric)</option>
            <option value="11th">11th (F.Sc Part I)</option>
            <option value="12th">12th (F.Sc Part II)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.board}</label>
          <select
            name="board"
            value={formData.board}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          >
            <option value="">
              {language === 'english' ? 'Select your board' : 'اپنا بورڈ منتخب کریں'}
            </option>
            <option value="Punjab">Punjab Board</option>
            <option value="Sindh">Sindh Board</option>
            <option value="KPK">KPK Board</option>
            <option value="Balochistan">Balochistan Board</option>
            <option value="FBISE">Federal Board (FBISE)</option>
            <option value="AKU-EB">Aga Khan University Examination Board</option>
          </select>
        </div>
      </div>
    </motion.div>,

    // Step 2: Subject Selection
    <motion.div 
      key="subjects"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-full">
          <Book size={48} className="text-green-600" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {language === 'english' ? 'Choose Your Subjects' : 'اپنے مضامین منتخب کریں'}
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {language === 'english' 
          ? 'Select the subjects you want to focus on. You can always change these later.'
          : 'وہ مضامین منتخب کریں جن پر آپ توجہ دینا چاہتے ہیں۔ آپ انہیں بعد میں تبدیل کر سکتے ہیں۔'
        }
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {[
          { name: 'Physics', icon: '⚛️', color: 'blue' },
          { name: 'Chemistry', icon: '🧪', color: 'green' },
          { name: 'Biology', icon: '🧬', color: 'purple' },
          { name: 'Mathematics', icon: '📐', color: 'red' },
          { name: 'Computer Science', icon: '💻', color: 'indigo' },
          { name: 'English', icon: '📚', color: 'yellow' },
          { name: 'Urdu', icon: '📖', color: 'pink' },
          { name: 'Islamiat', icon: '🕌', color: 'emerald' },
          { name: 'Pakistan Studies', icon: '🏛️', color: 'orange' }
        ].map((subject) => (
          <button
            key={subject.name}
            type="button"
            onClick={() => handleSubjectToggle(subject.name as Subject)}
            className={`relative p-6 border-2 rounded-xl transition-all duration-200 ${
              formData.subjects.includes(subject.name as Subject)
                ? `border-${subject.color}-500 bg-${subject.color}-50 shadow-lg scale-105`
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="text-3xl mb-3">{subject.icon}</div>
            <h3 className="font-semibold text-gray-900">{subject.name}</h3>
            {formData.subjects.includes(subject.name as Subject) && (
              <div className="absolute -top-2 -right-2">
                <CheckCircle2 size={24} className={`text-${subject.color}-500`} />
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        {formData.subjects.length} {language === 'english' ? 'subjects selected' : 'مضامین منتخب کیے گئے'}
      </div>
    </motion.div>,

    // Step 3: Exam Date & Study Schedule
    <motion.div 
      key="schedule"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-full">
          <Calendar size={48} className="text-purple-600" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {language === 'english' ? 'Plan Your Success' : 'اپنی کامیابی کا منصوبہ بنائیں'}
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {language === 'english' 
          ? 'Help us create a personalized study plan that fits your schedule and goals.'
          : 'ہمیں ایک ذاتی مطالعہ کا منصوبہ بنانے میں مدد کریں جو آپ کے شیڈول اور اہداف کے مطابق ہو۔'
        }
      </p>
      
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'english' ? 'When is your exam?' : 'آپ کا امتحان کب ہے؟'}
          </label>
          <input
            type="date"
            name="examDate"
            value={formData.examDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {language === 'english' ? 'How many hours can you study per week?' : 'آپ ہفتے میں کتنے گھنٹے پڑھ سکتے ہیں؟'}
          </label>
          <div className="space-y-4">
            <input
              type="range"
              name="weeklyHours"
              min="5"
              max="40"
              step="5"
              value={formData.weeklyHours}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5h</span>
              <span>10h</span>
              <span>15h</span>
              <span>20h</span>
              <span>25h</span>
              <span>30h</span>
              <span>35h</span>
              <span>40h</span>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full">
                <Clock size={16} className="text-blue-600 mr-2" />
                <span className="text-blue-700 font-semibold">
                  {formData.weeklyHours} {language === 'english' ? 'hours per week' : 'گھنٹے فی ہفتہ'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>,

    // Step 4: Goals & Motivation
    <motion.div 
      key="goals"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-full">
          <Target size={48} className="text-yellow-600" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {language === 'english' ? 'What are your goals?' : 'آپ کے اہداف کیا ہیں؟'}
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {language === 'english' 
          ? 'Select your study goals so we can tailor your experience and keep you motivated.'
          : 'اپنے مطالعہ کے اہداف منتخب کریں تاکہ ہم آپ کے تجربے کو ذاتی بنا سکیں اور آپ کو متحرک رکھ سکیں۔'
        }
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
        {[
          {
            id: 'high_grades',
            title: language === 'english' ? 'Get High Grades' : 'اعلیٰ نمبرات حاصل کریں',
            icon: <Trophy className="text-yellow-500" size={24} />,
            description: language === 'english' ? 'Score 80%+ in exams' : 'امتحانات میں 80%+ اسکور کریں'
          },
          {
            id: 'understand_concepts',
            title: language === 'english' ? 'Understand Concepts' : 'تصورات سمجھیں',
            icon: <Brain className="text-blue-500" size={24} />,
            description: language === 'english' ? 'Deep conceptual learning' : 'گہری تصوراتی تعلیم'
          },
          {
            id: 'exam_preparation',
            title: language === 'english' ? 'Exam Preparation' : 'امتحان کی تیاری',
            icon: <GraduationCap className="text-purple-500" size={24} />,
            description: language === 'english' ? 'Systematic exam prep' : 'منظم امتحان کی تیاری'
          },
          {
            id: 'time_management',
            title: language === 'english' ? 'Better Time Management' : 'بہتر وقت کا انتظام',
            icon: <Clock className="text-green-500" size={24} />,
            description: language === 'english' ? 'Efficient study habits' : 'موثر مطالعہ کی عادات'
          }
        ].map((goal) => (
          <button
            key={goal.id}
            type="button"
            onClick={() => handleGoalToggle(goal.id)}
            className={`p-6 border-2 rounded-xl transition-all duration-200 text-left ${
              formData.studyGoals.includes(goal.id)
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start">
              <div className="mr-4 mt-1">{goal.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
              {formData.studyGoals.includes(goal.id) && (
                <CheckCircle2 size={20} className="text-blue-500 ml-auto" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center mb-3">
          <Sparkles className="text-purple-500 mr-2" size={20} />
          <span className="font-semibold text-gray-900">
            {language === 'english' ? 'You\'re all set!' : 'آپ تیار ہیں!'}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {language === 'english' 
            ? 'We\'ll create a personalized study plan based on your preferences.'
            : 'ہم آپ کی ترجیحات کی بنیاد پر ایک ذاتی مطالعہ کا منصوبہ بنائیں گے۔'
          }
        </p>
      </div>
    </motion.div>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center space-x-4 mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i <= step 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < step ? <CheckCircle2 size={20} /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div 
                    className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                      i < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} 
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-500">
              {language === 'english' ? 'Step' : 'قدم'} {step + 1} {language === 'english' ? 'of' : 'از'} {totalSteps}
            </span>
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[600px] flex items-center justify-center">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {steps[step]}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              step === 0 
                ? 'invisible' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <ArrowLeft size={18} className="mr-2" />
            {t.back}
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className={`flex items-center px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
              canContinue()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {step === totalSteps - 1 ? (
              <>
                <Sparkles size={18} className="mr-2" />
                {t.startLearning}
              </>
            ) : (
              <>
                {t.next}
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;