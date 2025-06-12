import { Building, Users, Shield, Zap, Mail, Phone } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { SubscriptionPlan } from '../../types/subscription';
import PricingCard from './PricingCard';

interface InstitutionalPricingProps {
  plans: SubscriptionPlan[];
  onSelectPlan: (plan: SubscriptionPlan) => void;
  isLoading: boolean;
}

const InstitutionalPricing: React.FC<InstitutionalPricingProps> = ({ 
  plans, 
  onSelectPlan, 
  isLoading 
}) => {
  const { language } = useUser();

  const benefits = [
    {
      icon: <Users className="text-blue-500" size={24} />,
      title: language === 'english' ? 'Bulk Student Management' : 'بلک اسٹوڈنٹ مینجمنٹ',
      description: language === 'english' 
        ? 'Manage hundreds of students with ease'
        : 'آسانی سے سینکڑوں طلباء کا انتظام کریں'
    },
    {
      icon: <Shield className="text-green-500" size={24} />,
      title: language === 'english' ? 'Advanced Analytics' : 'ایڈوانس تجزیات',
      description: language === 'english'
        ? 'Detailed performance insights for teachers and admins'
        : 'اساتذہ اور ایڈمنز کے لیے تفصیلی کارکردگی کی بصیرت'
    },
    {
      icon: <Zap className="text-purple-500" size={24} />,
      title: language === 'english' ? 'Custom Content' : 'کسٹم مواد',
      description: language === 'english'
        ? 'Create and share custom study materials'
        : 'کسٹم اسٹڈی میٹریل بنائیں اور شیئر کریں'
    }
  ];

  return (
    <div>
      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              {benefit.icon}
              <h3 className="text-lg font-semibold text-gray-900 ml-3">
                {benefit.title}
              </h3>
            </div>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelectPlan={onSelectPlan}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Contact Section for Enterprise */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <Building className="mx-auto text-blue-400 mb-4" size={48} />
          <h3 className="text-2xl font-bold mb-2">
            {language === 'english' ? 'Need a Custom Solution?' : 'کسٹم حل کی ضرورت ہے؟'}
          </h3>
          <p className="text-gray-300">
            {language === 'english'
              ? 'Contact our enterprise team for custom pricing and features tailored to your institution.'
              : 'اپنے ادارے کے لیے کسٹم قیمت اور فیچرز کے لیے ہماری انٹرپرائز ٹیم سے رابطہ کریں۔'
            }
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-lg p-6">
            <h4 className="font-semibold mb-4">
              {language === 'english' ? 'Enterprise Features' : 'انٹرپرائز فیچرز'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• {language === 'english' ? 'White-label solution' : 'وائٹ لیبل حل'}</li>
              <li>• {language === 'english' ? 'API access' : 'اے پی آئی رسائی'}</li>
              <li>• {language === 'english' ? 'Custom integrations' : 'کسٹم انٹیگریشنز'}</li>
              <li>• {language === 'english' ? 'On-premise deployment' : 'آن پریمائس ڈیپلائمنٹ'}</li>
              <li>• {language === 'english' ? 'Dedicated support' : 'مخصوص سپورٹ'}</li>
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6">
            <h4 className="font-semibold mb-4">
              {language === 'english' ? 'Contact Information' : 'رابطے کی معلومات'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span className="text-sm">enterprise@studygenius.pk</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span className="text-sm">+92-300-1234567</span>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                {language === 'english' ? 'Schedule a Demo' : 'ڈیمو شیڈول کریں'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalPricing;