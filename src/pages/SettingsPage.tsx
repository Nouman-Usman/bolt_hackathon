import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Save, User, Bell, Globe, Clock, Shield } from 'lucide-react';
import translations from '../utils/translations';

const SettingsPage = () => {
  const { user, language, setLanguage } = useUser();
  const t = translations[language];
  
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications'>('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    // Preferences
    languagePreference: language,
    studyReminders: true,
    darkMode: false,
    // Notifications
    emailNotifications: true,
    progressReports: true,
    studySessions: true
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name === 'languagePreference') {
        setLanguage(value as 'english' | 'urdu');
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save changes to backend
    alert(language === 'english' ? 'Settings saved!' : 'ترتیبات محفوظ کر دی گئیں!');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t.settings}
        </h1>
        <p className="text-gray-600">
          {language === 'english'
            ? 'Manage your account settings and preferences.'
            : 'اپنے اکاؤنٹ کی ترتیبات اور ترجیحات کا انتظام کریں۔'
          }
        </p>
      </div>
      
      {/* Tabs */}
      <div className="bg-gray-100 p-1 rounded-lg inline-flex mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'profile'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {language === 'english' ? 'Profile' : 'پروفائل'}
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'preferences'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {language === 'english' ? 'Preferences' : 'ترجیحات'}
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'notifications'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {language === 'english' ? 'Notifications' : 'نوٹیفیکیشنز'}
        </button>
      </div>
      
      {/* Settings content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit}>
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center font-semibold text-gray-900 mb-4">
                  <User size={18} className="mr-2" />
                  {language === 'english' ? 'Profile Information' : 'پروفائل کی معلومات'}
                </h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.name}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="bg-gray-50 -mx-6 -mb-6 p-6 mt-8">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    {language === 'english' ? 'Save Changes' : 'تبدیلیاں محفوظ کریں'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center font-semibold text-gray-900 mb-4">
                  <Globe size={18} className="mr-2" />
                  {language === 'english' ? 'Language & Appearance' : 'زبان اور ظاہری شکل'}
                </h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t.language}
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="languagePreference"
                      value="english"
                      checked={formData.languagePreference === 'english'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">English</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="languagePreference"
                      value="urdu"
                      checked={formData.languagePreference === 'urdu'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">اردو</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={formData.darkMode}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {language === 'english' ? 'Dark Mode' : 'ڈارک موڈ'} 
                    <span className="ml-1 text-xs text-gray-500">
                      ({language === 'english' ? 'Coming Soon' : 'جلد آرہا ہے'})
                    </span>
                  </span>
                </label>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="flex items-center font-semibold text-gray-900 mb-4">
                  <Clock size={18} className="mr-2" />
                  {language === 'english' ? 'Study Preferences' : 'مطالعہ کی ترجیحات'}
                </h3>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="studyReminders"
                      checked={formData.studyReminders}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {language === 'english'
                        ? 'Enable study session reminders'
                        : 'مطالعہ کے سیشن کے ریمائنڈرز کو فعال کریں'
                      }
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="bg-gray-50 -mx-6 -mb-6 p-6 mt-8">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    {language === 'english' ? 'Save Changes' : 'تبدیلیاں محفوظ کریں'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center font-semibold text-gray-900 mb-4">
                  <Bell size={18} className="mr-2" />
                  {language === 'english' ? 'Notification Settings' : 'نوٹیفیکیشن کی ترتیبات'}
                </h3>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {language === 'english'
                      ? 'Email notifications'
                      : 'ای میل نوٹیفیکیشنز'
                    }
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="progressReports"
                    checked={formData.progressReports}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {language === 'english'
                      ? 'Weekly progress reports'
                      : 'ہفتہ وار پیشرفت کی رپورٹس'
                    }
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="studySessions"
                    checked={formData.studySessions}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {language === 'english'
                      ? 'Study session reminders'
                      : 'مطالعہ کے سیشن کے ریمائنڈرز'
                    }
                  </span>
                </label>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h3 className="flex items-center font-semibold text-gray-900 mb-4">
                  <Shield size={18} className="mr-2" />
                  {language === 'english' ? 'Privacy Settings' : 'رازداری کی ترتیبات'}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'english'
                    ? 'Your data is always kept private and secure. We never share your personal information with third parties.'
                    : 'آپ کا ڈیٹا ہمیشہ نجی اور محفوظ رکھا جاتا ہے۔ ہم آپ کی ذاتی معلومات کبھی بھی تیسرے فریقوں کے ساتھ شیئر نہیں کرتے۔'
                  }
                </p>
              </div>
              
              <div className="bg-gray-50 -mx-6 -mb-6 p-6 mt-8">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    {language === 'english' ? 'Save Changes' : 'تبدیلیاں محفوظ کریں'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;