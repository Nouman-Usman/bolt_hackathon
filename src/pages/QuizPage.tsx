import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Brain, Clock, CircleCheck, CircleX, ChevronRight } from 'lucide-react';
import translations from '../utils/translations';

interface QuizItem {
  id: string;
  subject: string;
  title: string;
  questionCount: number;
  duration: number; // in minutes
  type: 'mcq' | 'shortAnswer' | 'longAnswer' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
}

const QuizPage = () => {
  const { user, language } = useUser();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');
  
  if (!user) return null;

  // Mock quiz data
  const quizzes: QuizItem[] = [
    {
      id: 'q1',
      subject: 'Physics',
      title: 'Motion and Forces',
      questionCount: 15,
      duration: 30,
      type: 'mcq',
      difficulty: 'medium'
    },
    {
      id: 'q2',
      subject: 'Chemistry',
      title: 'Periodic Table',
      questionCount: 20,
      duration: 40,
      type: 'mixed',
      difficulty: 'hard'
    },
    {
      id: 'q3',
      subject: 'Mathematics',
      title: 'Differential Calculus',
      questionCount: 10,
      duration: 25,
      type: 'shortAnswer',
      difficulty: 'hard'
    },
    {
      id: 'q4',
      subject: 'Biology',
      title: 'Cell Structure',
      questionCount: 15,
      duration: 30,
      type: 'mcq',
      difficulty: 'easy'
    }
  ].filter(quiz => user.subjects.includes(quiz.subject as any));

  // Mock completed quizzes
  const completedQuizzes = [
    {
      id: 'cq1',
      subject: 'Physics',
      title: 'Kinematics',
      questionCount: 12,
      score: 75, // percentage
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: 'cq2',
      subject: 'Chemistry',
      title: 'Chemical Bonding',
      questionCount: 15,
      score: 85,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    }
  ].filter(quiz => user.subjects.includes(quiz.subject as any));

  const getDifficultyLabel = (difficulty: string) => {
    switch(difficulty) {
      case 'easy':
        return language === 'english' ? 'Easy' : 'آسان';
      case 'medium':
        return language === 'english' ? 'Medium' : 'درمیانہ';
      case 'hard':
        return language === 'english' ? 'Hard' : 'مشکل';
      default:
        return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'mcq':
        return language === 'english' ? 'Multiple Choice' : 'ایم سی کیو';
      case 'shortAnswer':
        return language === 'english' ? 'Short Answer' : 'مختصر جوابات';
      case 'longAnswer':
        return language === 'english' ? 'Long Answer' : 'طویل جوابات';
      case 'mixed':
        return language === 'english' ? 'Mixed Format' : 'مخلوط فارمیٹ';
      default:
        return type;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t.quizzes}
        </h1>
        <p className="text-gray-600">
          {language === 'english'
            ? 'Test your knowledge with board-pattern quizzes tailored to your syllabus.'
            : 'اپنے نصاب کے مطابق بورڈ پیٹرن کوئزز کے ساتھ اپنے علم کا امتحان لیں۔'
          }
        </p>
      </div>

      {/* Tab selector */}
      <div className="bg-gray-100 p-1 rounded-lg inline-flex mb-6">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'available'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {language === 'english' ? 'Available Quizzes' : 'دستیاب کوئزز'}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'completed'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {language === 'english' ? 'Completed Quizzes' : 'مکمل کردہ کوئزز'}
        </button>
      </div>

      {/* Available Quizzes */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-medium text-gray-500">{quiz.subject}</span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">{quiz.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      {getDifficultyLabel(quiz.difficulty)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <Brain size={16} className="mr-1" />
                  <span>
                    {quiz.questionCount} {language === 'english' ? 'Questions' : 'سوالات'}
                  </span>
                  <span className="mx-2">•</span>
                  <Clock size={16} className="mr-1" />
                  <span>
                    {quiz.duration} {language === 'english' ? 'Minutes' : 'منٹ'}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{getTypeLabel(quiz.type)}</span>
                </div>
                
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                  {t.startQuiz}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-xl shadow-sm p-8 text-center">
              <Brain size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                {language === 'english' ? 'No quizzes available' : 'کوئی کوئز دستیاب نہیں ہے'}
              </h3>
              <p className="text-gray-500">
                {language === 'english'
                  ? 'Please select more subjects or check back later.'
                  : 'براہ کرم مزید مضامین منتخب کریں یا بعد میں دوبارہ چیک کریں۔'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Completed Quizzes */}
      {activeTab === 'completed' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {completedQuizzes.length > 0 ? (
            <div className="divide-y">
              {completedQuizzes.map((quiz) => (
                <div key={quiz.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-500">{quiz.subject}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                        <Brain size={14} className="mr-1" />
                        <span>
                          {quiz.questionCount} {language === 'english' ? 'Questions' : 'سوالات'}
                        </span>
                        <span>•</span>
                        <span>
                          {language === 'english'
                            ? quiz.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : quiz.date.toLocaleDateString('ur-PK', { month: 'short', day: 'numeric' })
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(quiz.score)}`}>
                        {quiz.score}%
                      </div>
                      <div className="mt-2">
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                          {language === 'english' ? 'Review' : 'جائزہ لیں'}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Brain size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                {language === 'english' ? 'No quizzes completed yet' : 'ابھی تک کوئی کوئز مکمل نہیں ہوا'}
              </h3>
              <p className="text-gray-500 mb-4">
                {language === 'english'
                  ? 'Complete your first quiz to see your results here.'
                  : 'اپنی پہلی کوئز مکمل کریں تاکہ یہاں اپنے نتائج دیکھ سکیں۔'
                }
              </p>
              <button 
                onClick={() => setActiveTab('available')}
                className="text-blue-600 font-medium text-sm hover:text-blue-700"
              >
                {language === 'english' ? 'Browse available quizzes' : 'دستیاب کوئز براؤز کریں'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;