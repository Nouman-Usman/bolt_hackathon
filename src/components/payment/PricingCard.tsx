import { Check, Crown, Star, Gift } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { SubscriptionPlan, Campaign } from '../../types/subscription';

interface PricingCardProps {
  plan: SubscriptionPlan;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
  discountedPrice?: number;
  campaign?: Campaign | null;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  plan, 
  onSelectPlan, 
  isLoading, 
  discountedPrice,
  campaign 
}) => {
  const { language } = useUser();

  const hasDiscount = discountedPrice && discountedPrice < plan.price;
  const displayPrice = discountedPrice || plan.price;

  const getButtonText = () => {
    if (plan.id === 'free') {
      return language === 'english' ? 'Current Plan' : 'موجودہ پلان';
    }
    if (plan.id === 'enterprise') {
      return language === 'english' ? 'Contact Sales' : 'سیلز سے رابطہ';
    }
    if (isLoading) {
      return language === 'english' ? 'Processing...' : 'پروسیسنگ...';
    }
    return language === 'english' ? 'Get Started' : 'شروع کریں';
  };

  const getButtonStyle = () => {
    if (plan.id === 'free') {
      return 'bg-gray-300 text-gray-600 cursor-not-allowed';
    }
    if (plan.popular) {
      return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700';
    }
    return 'bg-gray-900 text-white hover:bg-gray-800';
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
      plan.popular 
        ? 'border-blue-500 transform scale-105' 
        : 'border-gray-200'
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
            <Star size={14} className="mr-1" />
            {language === 'english' ? 'Most Popular' : 'سب سے مقبول'}
          </div>
        </div>
      )}

      {hasDiscount && campaign && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Gift size={12} className="mr-1" />
            {campaign.discountPercentage}% OFF
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          {plan.popular && <Crown className="text-yellow-500 mr-2" size={24} />}
          <h3 className="text-2xl font-bold text-gray-900">
            {language === 'english' ? plan.name : plan.nameUrdu}
          </h3>
        </div>
        
        <div className="flex items-baseline justify-center">
          {hasDiscount && (
            <span className="text-lg text-gray-400 line-through mr-2">
              {plan.currency === 'PKR' ? '₨' : '$'}{plan.price}
            </span>
          )}
          <span className="text-4xl font-bold text-gray-900">
            {plan.id === 'enterprise' 
              ? (language === 'english' ? 'Custom' : 'کسٹم')
              : `${plan.currency === 'PKR' ? '₨' : '$'}${displayPrice}`
            }
          </span>
          {plan.id !== 'enterprise' && (
            <span className="text-gray-500 ml-1">
              /{language === 'english' ? plan.interval : (plan.interval === 'month' ? 'ماہ' : 'سال')}
            </span>
          )}
        </div>

        {plan.savings && (
          <div className="mt-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {plan.savings}
            </span>
          </div>
        )}

        {plan.category === 'institutional' && plan.limits.students && (
          <div className="mt-2 text-sm text-gray-600">
            {language === 'english' ? 'Per student per month' : 'فی طالب علم فی ماہ'}
          </div>
        )}
      </div>
      
      <ul className="space-y-3 mb-8">
        {(language === 'english' ? plan.features.english : plan.features.urdu).map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check size={16} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => onSelectPlan(plan)}
        disabled={isLoading || plan.id === 'free'}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${getButtonStyle()} ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {getButtonText()}
      </button>

      {plan.category === 'institutional' && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          {language === 'english'
            ? 'Includes setup assistance and training'
            : 'سیٹ اپ کی مدد اور تربیت شامل ہے'
          }
        </p>
      )}
    </div>
  );
};

export default PricingCard;