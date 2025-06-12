import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Calendar, Clock, BookOpen, Check, PlusCircle } from 'lucide-react';
import translations from '../utils/translations';

const StudyPlanPage = () => {
  const { user, language } = useUser();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [currentWeek, setCurrentWeek] = useState(0);

  if (!user) return null;

  // Mock study plan data (in a real app, this would come from the backend)
  const generateMockStudyPlan = () => {
    const today = new Date();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdaysUrdu = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
    
    const plan = [];
    
    // Generate study sessions for the next 4 weeks
    for (let week = 0; week < 4; week++) {
      const weekPlan = [];
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + (week * 7) + day);
        
        // Skip some days randomly to make it look realistic
        if (Math.random() > 0.7) continue;
        
        const randomSubject = user.subjects[Math.floor(Math.random() * user.subjects.length)];
        const sessionDuration = [30, 45, 60][Math.floor(Math.random() * 3)];
        
        weekPlan.push({
          id: `session-${week}-${day}`,
          date,
          day: language === 'english' ? weekdays[date.getDay()] : weekdaysUrdu[date.getDay()],
          subject: randomSubject,
          topics: ['Topic 1', 'Topic 2'],
          duration: sessionDuration,
          completed: week === 0 && day < today.getDay()
        });
      }
      
      plan.push(weekPlan);
    }
    
    return plan;
  };

  const studyPlan = generateMockStudyPlan();
  
  const CalendarView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <button 
          onClick={() => currentWeek > 0 && setCurrentWeek(currentWeek - 1)}
          className={`p-2 rounded-lg ${currentWeek > 0 ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
          disabled={currentWeek === 0}
        >
          {language === 'english' ? 'Previous Week' : 'پچھلا ہفتہ'}
        </button>
        <h3 className="font-semibold text-gray-800">
          {language === 'english' ? 'Week ' : 'ہفتہ '} {currentWeek + 1}
        </h3>
        <button 
          onClick={() => currentWeek < 3 && setCurrentWeek(currentWeek + 1)}
          className={`p-2 rounded-lg ${currentWeek < 3 ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
          disabled={currentWeek === 3}
        >
          {language === 'english' ? 'Next Week' : 'اگلا ہفتہ'}
        </button>
      </div>
      
      <div className="grid grid-cols-7 text-sm">
        {/* Calendar header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="py-2 text-center font-medium border-b text-gray-500">
            {language === 'english' 
              ? day 
              : ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'][index]
            }
          </div>
        ))}
        
        {/* Calendar grid */}
        {Array(7).fill(null).map((_, index) => {
          const date = new Date();
          date.setDate(date.getDate() + (currentWeek * 7) + index);
          
          const sessions = studyPlan[currentWeek].filter(session => 
            new Date(session.date).toDateString() === date.toDateString()
          );
          
          const isToday = new Date().toDateString() === date.toDateString();
          
          return (
            <div 
              key={index} 
              className={`min-h-[120px] p-2 border-b border-r ${isToday ? 'bg-blue-50' : ''}`}
            >
              <div className={`text-center mb-1 text-sm rounded-full w-6 h-6 mx-auto flex items-center justify-center ${
                isToday ? 'bg-blue-600 text-white' : 'text-gray-500'
              }`}>
                {date.getDate()}
              </div>
              
              {sessions.map((session) => (
                <div 
                  key={session.id}
                  className={`mb-1 p-1 text-xs rounded ${
                    session.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <div className="font-medium">{session.subject}</div>
                  <div className="flex items-center mt-0.5">
                    <Clock size={10} className="mr-1" />
                    {session.duration} {language === 'english' ? 'min' : 'منٹ'}
                  </div>
                </div>
              ))}
              
              {sessions.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <button className="text-gray-400 hover:text-blue-600">
                    <PlusCircle size={16} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
  
  const ListView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <button 
          onClick={() => currentWeek > 0 && setCurrentWeek(currentWeek - 1)}
          className={`p-2 rounded-lg ${currentWeek > 0 ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
          disabled={currentWeek === 0}
        >
          {language === 'english' ? 'Previous Week' : 'پچھلا ہفتہ'}
        </button>
        <h3 className="font-semibold text-gray-800">
          {language === 'english' ? 'Week ' : 'ہفتہ '} {currentWeek + 1}
        </h3>
        <button 
          onClick={() => currentWeek < 3 && setCurrentWeek(currentWeek + 1)}
          className={`p-2 rounded-lg ${currentWeek < 3 ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
          disabled={currentWeek === 3}
        >
          {language === 'english' ? 'Next Week' : 'اگلا ہفتہ'}
        </button>
      </div>
      
      {studyPlan[currentWeek].length > 0 ? (
        <div className="divide-y">
          {studyPlan[currentWeek].map((session) => (
            <div key={session.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{session.subject}</h4>
                  <div className="text-sm text-gray-500 mt-1">{session.topics.join(', ')}</div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      <span>{session.day}, {session.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span>{session.duration} {language === 'english' ? 'minutes' : 'منٹ'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {session.completed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Check size={12} className="mr-1" />
                      {language === 'english' ? 'Completed' : 'مکمل'}
                    </span>
                  ) : (
                    <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                      {language === 'english' ? 'Start' : 'شروع کریں'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          {language === 'english'
            ? 'No study sessions scheduled for this week.'
            : 'اس ہفتے کے لیے کوئی سٹڈی سیشن شیڈول نہیں ہے۔'
          }
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t.studyPlan}
        </h1>
        <p className="text-gray-600">
          {language === 'english'
            ? 'Your personalized study plan based on your exam schedule and goals.'
            : 'آپ کے امتحان کے شیڈول اور اہداف کے مطابق آپ کا ذاتی مطالعہ کا منصوبہ۔'
          }
        </p>
      </div>

      {/* Create study plan button */}
      <div className="mb-6 flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <PlusCircle size={18} className="mr-2" />
          {t.createPlan}
        </button>
      </div>

      {/* View toggle */}
      <div className="bg-gray-100 p-1 rounded-lg inline-flex mb-6">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'calendar'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {language === 'english' ? 'Calendar View' : 'کیلنڈر ویو'}
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'list'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {language === 'english' ? 'List View' : 'لسٹ ویو'}
        </button>
      </div>

      {/* Active view */}
      {activeTab === 'calendar' ? <CalendarView /> : <ListView />}
    </div>
  );
};

export default StudyPlanPage;