import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, X, ArrowLeft } from 'lucide-react';
import PricingCard from '../components/payment/PricingCard';
import translations from '../utils/translations';

const PricingPage = () => {
  const { user, language } = useUser();
  const navigate = useNavigate();
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      nameUrdu: 'مفت',
      price: 0,
      currency: 'PKR',
      interval: 'month' as const,
      features: {
        english: [
          '2 subjects access',
          'Basic quizzes',
          'Limited flashcards',
          'Community support'
        ],
        urdu: [
          '2 مضامین تک رسائی',
          'بنیادی کوئزز',
          'محدود فلیش کارڈز',
          'کمیونٹی سپورٹ'
        ]
      },
      stripePriceId: ''
    },
    {
      id: 'premium_monthly',
      name: 'Premium',
      nameUrdu: 'پریمیم',
      price: 1500,
      currency: 'PKR',
      interval: 'month' as const,
      popular: true,
      features: {
        english: [
          'All subjects access',
          'Unlimited quizzes & tests',
          'AI essay evaluation',
          'Personalized study plans',
          'Progress analytics',
          '24/7 AI tutor chat',
          'Downloadable content',
          'Priority support'
        ],
        urdu: [
          'تمام مضامین تک رسائی',
          'لامحدود کوئزز اور ٹیسٹس',
          'اے آئی مضمون کی تشخیص',
          'ذاتی مطالعہ کے منصوبے',
          'پیشرفت کا تجزیہ',
          '24/7 اے آئی ٹیوٹر چیٹ',
          'ڈاؤن لوڈ کے قابل مواد',
          'ترجیحی سپورٹ'
        ]
      },
      stripePriceId: 'price_premium_monthly'
    },
    {
      id: 'premium_yearly',
      name: 'Premium Annual',
      nameUrdu: 'پریمیم سالانہ',
      price: 15000,
      currency: 'PKR',
      interval: 'year' as const,
      features: {
        english: [
          'All Premium features',
          '2 months free (16% savings)',
          'Exclusive study materials',
          'Live tutoring sessions',
          'Exam preparation bootcamps',
          'Parent progress reports',
          'Offline content access'
        ],
        urdu: [
          'تمام پریمیم فیچرز',
          '2 ماہ مفت (16% بچت)',
          'خصوصی مطالعہ کا مواد',
          'لائیو ٹیوٹرنگ سیشنز',
          'امتحان کی تیاری کے بوٹ کیمپس',
          'والدین کی پیشرفت کی رپورٹس',
          'آف لائن مواد تک رسائی'
        ]
      },
      stripePriceId: 'price_premium_yearly'
    }
  ];

  const handleSelectPlan = async (plan: any) => {
    if (plan.id === 'free') {
      // Handle free plan selection
      return;
    }

    setIsLoading(true);
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId: user?.id,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = (await import('@stripe/stripe-js')).loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      );
      
      if (stripe) {
        const { error } = await (await stripe).redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe error:', error);
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentFeatures = {
    english: [
      'Access to 2 subjects only',
      'Basic quiz functionality',
      'Limited study materials',
      'No AI tutoring',
      'No progress analytics'
    ],
    urdu: [
      'صرف 2 مضامین تک رسائی',
      'بنیادی کوئز فیچر',
      'محدود مطالعہ کا مواد',
      'کوئی اے آئی ٹیوٹرنگ نہیں',
      'کوئی پیشرفت کا تجزیہ نہیں'
    ]
  };

  const premiumFeatures = {
    english: [
      'All subjects unlocked',
      'Unlimited AI-generated quizzes',
      'Personalized study plans',
      '24/7 AI tutor support',
      'Advanced progress tracking',
      'Essay evaluation & feedback',
      'Exam preparation tools'
    ],
    urdu: [
      'تمام مضامین کھلے ہوئے',
      'لامحدود اے آئی کوئزز',
      'ذاتی مطالعہ کے منصوبے',
      '24/7 اے آئی ٹیوٹر سپورٹ',
      'ایڈوانس پیشرفت کی ٹریکنگ',
      'مضمون کی تشخیص اور فیڈبیک',
      'امتحان کی تیاری کے ٹولز'
    ]
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          {language === 'english' ? 'Back' : 'واپس'}
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'english' ? 'Choose Your Plan' : 'اپنا پلان منتخب کریں'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'english'
              ? 'Unlock your full potential with our AI-powered study coach. Choose the plan that fits your needs.'
              : 'ہمارے اے آئی پاور اسٹڈی کوچ کے ساتھ اپنی مکمل صلاحیت کو کھولیں۔ اپنی ضروریات کے مطابق پلان منتخب کریں۔'
            }
          </p>
        </div>
      </div>

      {/* Current vs Premium Comparison */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            {language === 'english' ? 'Current Plan (Free)' : 'موجودہ پلان (مفت)'}
          </h3>
          <ul className="space-y-3">
            {(language === 'english' ? currentFeatures.english : currentFeatures.urdu).map((feature, index) => (
              <li key={index} className="flex items-start">
                <X size={16} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Crown className="text-yellow-500 mr-2" size={24} />
            {language === 'english' ? 'Premium Plan' : 'پریمیم پلان'}
          </h3>
          <ul className="space-y-3">
            {(language === 'english' ? premiumFeatures.english : premiumFeatures.urdu).map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check size={16} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelectPlan={handleSelectPlan}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {language === 'english' ? 'Frequently Asked Questions' : 'اکثر پوچھے جانے والے سوالات'}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'english' ? 'Can I cancel anytime?' : 'کیا میں کسی بھی وقت منسوخ کر سکتا ہوں؟'}
            </h4>
            <p className="text-gray-600">
              {language === 'english'
                ? 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.'
                : 'جی ہاں، آپ اپنی سبسکرپشن کسی بھی وقت منسوخ کر سکتے ہیں۔ آپ کو اپنے بلنگ پیریڈ کے اختتام تک رسائی حاصل رہے گی۔'
              }
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'english' ? 'Is my payment secure?' : 'کیا میری ادائیگی محفوظ ہے؟'}
            </h4>
            <p className="text-gray-600">
              {language === 'english'
                ? 'Absolutely. We use Stripe for payment processing, which is bank-level secure and trusted by millions worldwide.'
                : 'بالکل۔ ہم ادائیگی کے لیے Stripe استعمال کرتے ہیں، جو بینک کی سطح کا محفوظ اور دنیا بھر میں لاکھوں لوگوں کا بھروسہ ہے۔'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;