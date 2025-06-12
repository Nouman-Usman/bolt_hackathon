import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  Target, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Trophy, 
  BookOpen, 
  Brain, 
  Zap, 
  Star,
  Award,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Play,
  Users,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import translations from '../utils/translations';
import PremiumBadge from '../components/common/PremiumBadge';
import UpgradePrompt from '../components/common/UpgradePrompt';

const DashboardPage = () => {
  const { user, language } = useUser();
  const { currentPlan, checkFeatureAccess } = useSubscription();
  const t = translations[language];
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');

  if (!user) return null;

  // Mock data for charts and stats
  const mockPerformanceData = user.subjects.map(subject => ({
    name: subject,
    score: Math.floor(Math.random() * 31) + 70,
    improvement: Math.floor(Math.random() * 21) - 10,
    timeSpent: Math.floor(Math.random() * 120) + 30,
  }));

  const weeklyStudyData = [
    { day: 'Mon', hours: 2.5, target: 3 },
    { day: 'Tue', hours: 1.8, target: 3 },
    { day: 'Wed', hours: 3.2, target: 3 },
    { day: 'Thu', hours: 2.1, target: 3 },
    { day: 'Fri', hours: 4.0, target: 3 },
    { day: 'Sat', hours: 2.8, target: 3 },
    { day: 'Sun', hours: 1.5, target: 3 },
  ];

  const progressOverTime = [
    { week: 'Week 1', physics: 65, chemistry: 70, math: 75 },
    { week: 'Week 2', physics: 72, chemistry: 75, math: 78 },
    { week: 'Week 3', physics: 78, chemistry: 82, math: 85 },
    { week: 'Week 4', physics: 85, chemistry: 88, math: 90 },
  ];

  const subjectDistribution = user.subjects.map(subject => ({
    name: subject,
    value: Math.floor(Math.random() * 30) + 10,
    color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'][Math.floor(Math.random() * 6)]
  }));

  const totalStudyHours = weeklyStudyData.reduce((sum, day) => sum + day.hours, 0);
  const averageScore = Math.round(mockPerformanceData.reduce((sum, subject) => sum + subject.score, 0) / mockPerformanceData.length);
  const completedTopics = 23;
  const totalTopics = 75;
  const completionRate = Math.round((completedTopics / totalTopics) * 100);

  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: '1',
      subject: user.subjects[0],
      topic: 'Integration by Parts',
      time: '2:00 PM',
      duration: 45,
      type: 'study',
      priority: 'high'
    },
    {
      id: '2',
      subject: user.subjects.length > 1 ? user.subjects[1] : user.subjects[0],
      topic: 'Chemical Bonding',
      time: '4:30 PM',
      duration: 30,
      type: 'quiz',
      priority: 'medium'
    },
    {
      id: '3',
      subject: user.subjects.length > 2 ? user.subjects[2] : user.subjects[0],
      topic: 'Cell Division',
      time: '7:00 PM',
      duration: 60,
      type: 'review',
      priority: 'low'
    }
  ];

  // Mock achievements
  const achievements = [
    {
      id: '1',
      title: language === 'english' ? 'Study Streak' : 'مطالعہ اسٹریک',
      description: language === 'english' ? '7 days in a row' : '7 دن لگاتار',
      icon: <Target size={20} className="text-green-600" />,
      progress: 70,
      unlocked: true
    },
    {
      id: '2',
      title: language === 'english' ? 'Quiz Master' : 'کوئز ماسٹر',
      description: language === 'english' ? 'Complete 10 quizzes' : '10 کوئز مکمل کریں',
      icon: <Trophy size={20} className="text-amber-600" />,
      progress: 60,
      unlocked: true
    },
    {
      id: '3',
      title: language === 'english' ? 'Speed Learner' : 'تیز سیکھنے والا',
      description: language === 'english' ? 'Complete topics 20% faster' : 'عنوانات 20% تیزی سے مکمل کریں',
      icon: <Zap size={20} className="text-blue-600" />,
      progress: 30,
      unlocked: false
    }
  ];

  const handlePremiumFeatureClick = (feature: string) => {
    if (!checkFeatureAccess('advanced_analytics')) {
      setShowUpgradePrompt(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {language === 'english' ? `Welcome back, ${user.name}!` : `واپس خوش آمدید، ${user.name}!`}
              </h1>
              <p className="text-blue-100 mb-4">
                {language === 'english' 
                  ? `You're making great progress on your ${user.grade} ${user.board} board preparation.`
                  : `آپ اپنے ${user.grade} ${user.board} بورڈ کی تیاری میں بہترین پیشرفت کر رہے ہیں۔`
                }
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Crown size={16} className="mr-1 text-yellow-300" />
                  <span className="text-sm">
                    {currentPlan === 'free' 
                      ? (language === 'english' ? 'Free Plan' : 'مفت پلان')
                      : (language === 'english' ? 'Premium Plan' : 'پریمیم پلان')
                    }
                  </span>
                </div>
                {currentPlan === 'free' && (
                  <button 
                    onClick={() => setShowUpgradePrompt(true)}
                    className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium hover:bg-yellow-400 transition-colors"
                  >
                    {language === 'english' ? 'Upgrade' : 'اپگریڈ'}
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.ceil((new Date(user.examDate || '2024-06-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</div>
                  <div className="text-sm text-blue-100">
                    {language === 'english' ? 'Days to Exam' : 'امتحان تک دن'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {language === 'english' ? 'Weekly Study Hours' : 'ہفتہ وار مطالعہ کے گھنٹے'}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{totalStudyHours.toFixed(1)}</h3>
              <div className="flex items-center mt-1">
                <ArrowUp size={12} className="text-green-500 mr-1" />
                <span className="text-xs text-green-600">+12% from last week</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((totalStudyHours / 20) * 100, 100)}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'english' ? 'Target: 20 hours/week' : 'ہدف: 20 گھنٹے/ہفتہ'}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {language === 'english' ? 'Average Score' : 'اوسط اسکور'}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{averageScore}%</h3>
              <div className="flex items-center mt-1">
                <ArrowUp size={12} className="text-green-500 mr-1" />
                <span className="text-xs text-green-600">+5% improvement</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {language === 'english' ? 'Topics Completed' : 'مکمل کردہ عنوانات'}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{completedTopics}</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-600">{completionRate}% of syllabus</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BookOpen className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${completionRate}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {totalTopics - completedTopics} {language === 'english' ? 'topics remaining' : 'عنوانات باقی'}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {language === 'english' ? 'Study Streak' : 'مطالعہ اسٹریک'}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">7</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs text-amber-600">Personal best!</span>
              </div>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Award className="text-amber-600" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study Pattern */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'english' ? 'Weekly Study Pattern' : 'ہفتہ وار مطالعہ کا پیٹرن'}
            </h3>
            <div className="flex space-x-2">
              {['week', 'month', 'year'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe as any)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStudyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'english' ? 'Today\'s Schedule' : 'آج کا شیڈول'}
          </h3>
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div key={session.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  session.priority === 'high' ? 'bg-red-500' :
                  session.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{session.subject}</h4>
                  <p className="text-xs text-gray-500">{session.topic}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={10} className="mr-1" />
                    <span>{session.time} • {session.duration} min</span>
                  </div>
                </div>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Play size={14} />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded-lg transition-colors">
            {language === 'english' ? 'View Full Schedule' : 'مکمل شیڈول دیکھیں'}
          </button>
        </motion.div>
      </div>

      {/* Subject Performance & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'english' ? 'Subject Performance' : 'مضمون کی کارکردگی'}
            </h3>
            {currentPlan === 'free' && (
              <PremiumBadge 
                feature="Advanced Analytics" 
                onClick={() => handlePremiumFeatureClick('advanced_analytics')}
              />
            )}
          </div>
          <div className="space-y-4">
            {mockPerformanceData.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">{subject.score}%</span>
                      <div className={`flex items-center text-xs ${
                        subject.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {subject.improvement >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                        <span>{Math.abs(subject.improvement)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                      style={{ width: `${subject.score}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {subject.timeSpent} {language === 'english' ? 'min this week' : 'منٹ اس ہفتے'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress Over Time */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {language === 'english' ? 'Progress Over Time' : 'وقت کے ساتھ پیشرفت'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="physics" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="chemistry" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="math" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Achievements & Study Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {language === 'english' ? 'Achievements' : 'اعزازات'}
          </h3>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                achievement.unlocked 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {achievement.icon}
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle className="text-green-500" size={20} />
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      achievement.unlocked ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Study Time Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {language === 'english' ? 'Study Time Distribution' : 'مطالعہ کے وقت کی تقسیم'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {subjectDistribution.map((subject, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: subject.color }}
                ></div>
                <span className="text-xs text-gray-600">{subject.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'english' ? 'Quick Actions' : 'فوری اعمال'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Brain className="text-blue-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">
              {language === 'english' ? 'Take Quiz' : 'کوئز لیں'}
            </span>
          </button>
          <button className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <BookOpen className="text-green-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">
              {language === 'english' ? 'Study Plan' : 'سٹڈی پلان'}
            </span>
          </button>
          <button className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Users className="text-purple-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">
              {language === 'english' ? 'AI Tutor' : 'اے آئی ٹیوٹر'}
            </span>
          </button>
          <button className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Star className="text-amber-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">
              {language === 'english' ? 'Flashcards' : 'فلیش کارڈز'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <UpgradePrompt
          feature="Advanced Analytics"
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;