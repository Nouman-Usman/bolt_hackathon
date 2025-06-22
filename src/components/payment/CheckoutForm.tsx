import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { CreditCard, Lock } from 'lucide-react';
import translations from '../../utils/translations';

interface CheckoutFormProps {
  planId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ planId, onSuccess, onError }) => {
  const { user, language } = useUser();
  const t = translations[language];
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // For demo purposes, always succeed
      onSuccess();
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center text-blue-800">
          <CreditCard size={20} className="mr-2" />
          <div>
            <h3 className="font-semibold">
              {language === 'english' ? 'Payment Integration Coming Soon' : 'ادائیگی کا انٹیگریشن جلد آرہا ہے'}
            </h3>
            <p className="text-sm mt-1">
              {language === 'english'
                ? 'Payment processing will be available in the next update. For now, you can explore all premium features.'
                : 'ادائیگی کی پروسیسنگ اگلی اپڈیٹ میں دستیاب ہوگی۔ فی الوقت، آپ تمام پریمیم فیچرز دیکھ سکتے ہیں۔'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-500">
        <Lock size={14} className="mr-2" />
        {language === 'english' 
          ? 'Your information will be secure when payment processing is enabled'
          : 'جب ادائیگی کی پروسیسنگ فعال ہوگی تو آپ کی معلومات محفوظ ہوں گی'
        }
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isProcessing
          ? (language === 'english' ? 'Processing...' : 'پروسیس ہو رہا ہے...')
          : (language === 'english' ? 'Continue (Demo Mode)' : 'جاری رکھیں (ڈیمو موڈ)')
        }
      </button>
    </form>
  );
};

export default CheckoutForm;