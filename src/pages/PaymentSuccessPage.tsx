import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import translations from '../utils/translations';

const PaymentSuccessPage = () => {
  const { user, language } = useUser();
  const navigate = useNavigate();
  const t = translations[language];

  useEffect(() => {
    // In a real app, you would verify the payment status here
    // and update the user's subscription status
  }, []);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {language === 'english' ? 'Payment Successful!' : 'ادائیگی کامیاب!'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {language === 'english'
            ? 'Welcome to StudyGenius Premium! Your account has been upgraded successfully.'
            : 'StudyGenius Premium میں خوش آمدید! آپ کا اکاؤنٹ کامیابی سے اپگریڈ ہو گیا ہے۔'
          }
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-center mb-3">
            <Crown className="text-yellow-500 mr-2" size={24} />
            <span className="font-semibold text-gray-900">
              {language === 'english' ? 'Premium Features Unlocked' : 'پریمیم فیچرز کھل گئے'}
            </span>
          </div>
          
          <ul className="text-sm text-gray-700 space-y-2">
            <li>✓ {language === 'english' ? 'All subjects access' : 'تمام مضامین تک رسائی'}</li>
            <li>✓ {language === 'english' ? 'Unlimited AI quizzes' : 'لامحدود اے آئی کوئزز'}</li>
            <li>✓ {language === 'english' ? '24/7 AI tutor support' : '24/7 اے آئی ٹیوٹر سپورٹ'}</li>
            <li>✓ {language === 'english' ? 'Advanced analytics' : 'ایڈوانس تجزیات'}</li>
          </ul>
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors duration-200 flex items-center justify-center"
        >
          {language === 'english' ? 'Start Learning' : 'پڑھنا شروع کریں'}
          <ArrowRight size={18} className="ml-2" />
        </button>

        <p className="text-xs text-gray-500 mt-4">
          {language === 'english'
            ? 'A confirmation email has been sent to your registered email address.'
            : 'آپ کے رجسٹرڈ ای میل ایڈریس پر تصدیقی ای میل بھیج دی گئی ہے۔'
          }
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;