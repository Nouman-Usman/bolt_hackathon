import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useUser } from '../../contexts/UserContext';
import { CreditCard, Lock } from 'lucide-react';
import translations from '../../utils/translations';

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, language } = useUser();
  const t = translations[language];
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError(language === 'english' ? 'Card element not found' : 'کارڈ ایلیمنٹ نہیں ملا');
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: user?.name || '',
          email: user?.email || '',
        },
      },
    });

    if (error) {
      onError(error.message || 'Payment failed');
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess();
    }

    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CreditCard size={16} className="inline mr-2" />
          {language === 'english' ? 'Card Information' : 'کارڈ کی معلومات'}
        </label>
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-500">
        <Lock size={14} className="mr-2" />
        {language === 'english' 
          ? 'Your payment information is secure and encrypted'
          : 'آپ کی ادائیگی کی معلومات محفوظ اور خفیہ ہیں'
        }
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isProcessing
          ? (language === 'english' ? 'Processing Payment...' : 'ادائیگی پروسیس ہو رہی ہے...')
          : (language === 'english' ? 'Complete Payment' : 'ادائیگی مکمل کریں')
        }
      </button>
    </form>
  );
};

export default CheckoutForm;