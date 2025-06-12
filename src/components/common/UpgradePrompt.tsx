import { Crown, X, ArrowRight } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import translations from '../../utils/translations';

interface UpgradePromptProps {
  feature: string;
  onClose: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature, onClose }) => {
  const { language } = useUser();
  const navigate = useNavigate();
  const t = translations[language];

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Crown className="text-yellow-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'english' ? 'Premium Feature' : 'پریمیم فیچر'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          {language === 'english'
            ? `${feature} is a premium feature. Upgrade to unlock this and many more advanced study tools.`
            : `${feature} ایک پریمیم فیچر ہے۔ اس اور مزید ایڈوانس اسٹڈی ٹولز کو کھولنے کے لیے اپگریڈ کریں۔`
          }
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">
            {language === 'english' ? 'Premium includes:' : 'پریمیم میں شامل ہے:'}
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• {language === 'english' ? 'All subjects unlocked' : 'تمام مضامین کھلے ہوئے'}</li>
            <li>• {language === 'english' ? 'Unlimited AI quizzes' : 'لامحدود اے آئی کوئزز'}</li>
            <li>• {language === 'english' ? '24/7 AI tutor support' : '24/7 اے آئی ٹیوٹر سپورٹ'}</li>
            <li>• {language === 'english' ? 'Advanced progress tracking' : 'ایڈوانس پیشرفت کی ٹریکنگ'}</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            {language === 'english' ? 'Maybe Later' : 'شاید بعد میں'}
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-200 flex items-center justify-center"
          >
            {language === 'english' ? 'Upgrade Now' : 'ابھی اپگریڈ کریں'}
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;