import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { BookOpen, Brain, BarChart3, MessageSquare, ArrowRight } from 'lucide-react';
import translations from '../utils/translations';

const HomePage = () => {
  const { user, isOnboarded, language } = useUser();
  const navigate = useNavigate();
  const t = translations[language];

  useEffect(() => {
    if (!isOnboarded) {
      navigate('/onboarding');
    }
  }, [isOnboarded, navigate]);

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'english' ? 'Good morning' : 'صبح بخیر';
    if (hour < 17) return language === 'english' ? 'Good afternoon' : 'دوپہر بخیر';
    return language === 'english' ? 'Good evening' : 'شام بخیر';
  };

  const features = [
    {
      icon: <BookOpen size={24} className="text-blue-600" />,
      title: t.studyPlan,
      description: language === 'english' 
        ? 'Follow your personalized study plan tailored to your exam schedule.'
        : 'اپنے امتحان کے شیڈول کے مطابق اپنا ذاتی مطالعہ منصوبہ دیکھیں۔',
      path: '/study-plan',
    },
    {
      icon: <Brain size={24} className="text-purple-600" />,
      title: t.quizzes,
      description: language === 'english'
        ? 'Test your knowledge with board-pattern practice quizzes.'
        : 'بورڈ پیٹرن پریکٹس کوئزز کے ساتھ اپنے علم کا امتحان لیں۔',
      path: '/quiz',
    },
    {
      icon: <BarChart3 size={24} className="text-green-600" />,
      title: t.dashboard,
      description: language === 'english'
        ? 'Track your progress and identify areas for improvement.'
        : 'اپنی پیشرفت کو ٹریک کریں اور بہتری کے شعبوں کی نشاندہی کریں۔',
      path: '/dashboard',
    },
    {
      icon: <MessageSquare size={24} className="text-amber-600" />,
      title: t.chatbot,
      description: language === 'english'
        ? 'Get instant help from your AI tutor anytime, anywhere.'
        : 'اپنے اے آئی ٹیوٹر سے کہیں بھی، کبھی بھی فوری مدد حاصل کریں۔',
      path: '/chat',
    },
  ];

  const todaySession = {
    subject: user.subjects[0],
    topics: ['Integration by Parts', 'Trigonometric Substitution'],
    durationMinutes: 45
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-bold text-gray-900 ${language === 'urdu' ? 'font-urdu' : ''}`}>
            {getGreeting()}, {user.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'english' 
              ? `You're making progress on your ${user.grade} ${user.board} board exam preparation.`
              : `آپ اپنے ${user.grade} ${user.board} بورڈ امتحان کی تیاری میں پیشرفت کر رہے ہیں۔`}
          </p>
        </div>
      </div>

      {/* Today's recommended session */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-md mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {language === 'english' ? "Today's Study Session" : "آج کا سٹڈی سیشن"}
            </h2>
            <p className="text-blue-100">
              {language === 'english' 
                ? `${todaySession.subject} - ${todaySession.topics.join(', ')}`
                : `${todaySession.subject} - ${todaySession.topics.join('، ')}`}
            </p>
            <p className="text-blue-100">
              {language === 'english' 
                ? `${todaySession.durationMinutes} minutes`
                : `${todaySession.durationMinutes} منٹ`}
            </p>
          </div>
          <button 
            onClick={() => navigate('/study-plan')} 
            className="mt-4 md:mt-0 bg-white text-blue-600 px-5 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-50 transition-colors duration-200"
          >
            <span>{language === 'english' ? 'Start Session' : 'سیشن شروع کریں'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            <div className="flex items-center mb-4">
              {feature.icon}
              <h3 className="font-semibold text-lg ml-2">{feature.title}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
            <button 
              onClick={() => navigate(feature.path)} 
              className="text-blue-600 font-medium flex items-center text-sm hover:text-blue-700"
            >
              {language === 'english' ? 'Open' : 'کھولیں'} <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Recent progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'english' ? 'Your Recent Progress' : 'آپ کی حالیہ پیشرفت'}
        </h2>
        <div className="space-y-4">
          {user.subjects.slice(0, 3).map((subject, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{subject}</span>
                <span className="text-sm text-gray-500">
                  {Math.floor(Math.random() * 31) + 70}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.floor(Math.random() * 31) + 70}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-5 text-blue-600 font-medium flex items-center text-sm hover:text-blue-700"
        >
          {language === 'english' ? 'View detailed progress' : 'تفصیلی پیشرفت دیکھیں'} <ArrowRight size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;