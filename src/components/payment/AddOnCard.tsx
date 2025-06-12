import { Clock, Users, BookOpen, Zap, Star } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { AddOn } from '../../types/subscription';

interface AddOnCardProps {
  addOn: AddOn;
  onPurchase: (addOn: AddOn) => void;
  isLoading?: boolean;
}

const AddOnCard: React.FC<AddOnCardProps> = ({ addOn, onPurchase, isLoading }) => {
  const { language } = useUser();

  const getIcon = () => {
    switch (addOn.type) {
      case 'bootcamp':
        return <Zap className="text-orange-500" size={24} />;
      case 'tutoring':
        return <Users className="text-blue-500" size={24} />;
      case 'papers':
        return <BookOpen className="text-green-500" size={24} />;
      case 'mentoring':
        return <Star className="text-purple-500" size={24} />;
      default:
        return <BookOpen className="text-gray-500" size={24} />;
    }
  };

  const getTypeLabel = () => {
    switch (addOn.type) {
      case 'bootcamp':
        return language === 'english' ? 'Bootcamp' : 'بوٹ کیمپ';
      case 'tutoring':
        return language === 'english' ? 'Tutoring' : 'ٹیوٹرنگ';
      case 'papers':
        return language === 'english' ? 'Past Papers' : 'پاسٹ پیپرز';
      case 'mentoring':
        return language === 'english' ? 'AI Mentoring' : 'اے آئی مینٹرنگ';
      default:
        return addOn.type;
    }
  };

  return (
    <div className={`relative bg-white rounded-xl shadow-md border-2 p-6 hover:shadow-lg transition-shadow duration-200 ${
      addOn.popular ? 'border-orange-300' : 'border-gray-200'
    }`}>
      {addOn.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {language === 'english' ? 'Popular' : 'مقبول'}
          </div>
        </div>
      )}
      
      <div className="flex items-center mb-4">
        {getIcon()}
        <div className="ml-3">
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {getTypeLabel()}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {language === 'english' ? addOn.name : addOn.nameUrdu}
          </h3>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        {language === 'english' ? addOn.description : addOn.descriptionUrdu}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-gray-900">
          {addOn.currency === 'PKR' ? '₨' : '$'}{addOn.price}
        </div>
        
        {addOn.duration && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            {addOn.duration} {language === 'english' ? 'days' : 'دن'}
          </div>
        )}
        
        {addOn.sessions && (
          <div className="flex items-center text-sm text-gray-500">
            <Users size={14} className="mr-1" />
            {addOn.sessions} {language === 'english' ? 'session' : 'سیشن'}
          </div>
        )}
      </div>
      
      <button
        onClick={() => onPurchase(addOn)}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
          addOn.popular
            ? 'bg-orange-500 text-white hover:bg-orange-600'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading 
          ? (language === 'english' ? 'Processing...' : 'پروسیسنگ...')
          : (language === 'english' ? 'Purchase' : 'خریدیں')
        }
      </button>
    </div>
  );
};

export default AddOnCard;