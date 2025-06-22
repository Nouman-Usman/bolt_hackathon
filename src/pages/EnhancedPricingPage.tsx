import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, X, ArrowLeft, Users, Building, Star, Gift, Clock, Zap, Shield, BookOpen } from 'lucide-react';
import PricingCard from '../components/payment/PricingCard';
import AddOnCard from '../components/payment/AddOnCard';
import CampaignBanner from '../components/payment/CampaignBanner';
import InstitutionalPricing from '../components/payment/InstitutionalPricing';
import translations from '../utils/translations';
import { SubscriptionPlan, AddOn } from '../types/subscription';

const EnhancedPricingPage = () => {
  const { user, language } = useUser();
  const { activeCampaign, getDiscountedPrice } = useSubscription();
  const navigate = useNavigate();
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'individual' | 'institutional'>('individual');

  const individualPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      nameUrdu: 'مفت',
      type: 'free',
      price: 0,
      currency: 'PKR',
      interval: 'month',
      category: 'individual',
      features: {
        english: [
          '2 subjects access',
          '5 quizzes per month',
          '10 AI tutor queries/day',
          'Basic flashcards',
          'Community support'
        ],
        urdu: [
          '2 مضامین تک رسائی',
          'ماہانہ 5 کوئزز',
          'روزانہ 10 اے آئی ٹیوٹر سوالات',
          'بنیادی فلیش کارڈز',
          'کمیونٹی سپورٹ'
        ]
      },
      limits: {
        subjects: 2,
        quizzes: 5,
        aiQueries: 10
      },
      stripePriceId: ''
    },
    {
      id: 'premium_monthly',
      name: 'Premium',
      nameUrdu: 'پریمیم',
      type: 'premium_monthly',
      price: 800,
      currency: 'PKR',
      interval: 'month',
      category: 'individual',
      popular: true,
      features: {
        english: [
          'All subjects access',
          'Unlimited quizzes & tests',
          'Unlimited AI tutor chat',
          'AI essay evaluation',
          'Personalized study plans',
          'Progress analytics',
          'Downloadable content',
          'Priority support'
        ],
        urdu: [
          'تمام مضامین تک رسائی',
          'لامحدود کوئزز اور ٹیسٹس',
          'لامحدود اے آئی ٹیوٹر چیٹ',
          'اے آئی مضمون کی تشخیص',
          'ذاتی مطالعہ کے منصوبے',
          'پیشرفت کا تجزیہ',
          'ڈاؤن لوڈ کے قابل مواد',
          'ترجیحی سپورٹ'
        ]
      },
      limits: {
        subjects: -1,
        quizzes: -1,
        aiQueries: -1
      },
      stripePriceId: 'price_premium_monthly'
    },
    {
      id: 'premium_yearly',
      name: 'Premium Annual',
      nameUrdu: 'پریمیم سالانہ',
      type: 'premium_yearly',
      price: 8000,
      currency: 'PKR',
      interval: 'year',
      category: 'individual',
      savings: 'Save 17%',
      features: {
        english: [
          'All Premium features',
          '2 months free (17% savings)',
          'Exclusive study materials',
          'Live tutoring sessions (2/month)',
          'Exam preparation bootcamps',
          'Parent progress reports',
          'Offline content access',
          'Priority customer support'
        ],
        urdu: [
          'تمام پریمیم فیچرز',
          '2 ماہ مفت (17% بچت)',
          'خصوصی مطالعہ کا مواد',
          'لائیو ٹیوٹرنگ سیشنز (2/ماہ)',
          'امتحان کی تیاری کے بوٹ کیمپس',
          'والدین کی پیشرفت کی رپورٹس',
          'آف لائن مواد تک رسائی',
          'ترجیحی کسٹمر سپورٹ'
        ]
      },
      limits: {
        subjects: -1,
        quizzes: -1,
        aiQueries: -1,
        liveSupport: true
      },
      stripePriceId: 'price_premium_yearly'
    }
  ];

  const institutionalPlans: SubscriptionPlan[] = [
    {
      id: 'institutional_basic',
      name: 'School Basic',
      nameUrdu: 'اسکول بیسک',
      type: 'institutional_basic',
      price: 300,
      currency: 'PKR',
      interval: 'month',
      category: 'institutional',
      features: {
        english: [
          'Up to 100 students',
          'Teacher dashboard',
          'Basic analytics',
          'All subjects access',
          'Unlimited quizzes',
          'Email support'
        ],
        urdu: [
          '100 طلباء تک',
          'ٹیچر ڈیش بورڈ',
          'بنیادی تجزیات',
          'تمام مضامین تک رسائی',
          'لامحدود کوئزز',
          'ای میل سپورٹ'
        ]
      },
      limits: {
        subjects: -1,
        quizzes: -1,
        aiQueries: -1,
        students: 100,
        teachers: 10
      },
      stripePriceId: 'price_institutional_basic'
    },
    {
      id: 'institutional_premium',
      name: 'School Premium',
      nameUrdu: 'اسکول پریمیم',
      type: 'institutional_premium',
      price: 500,
      currency: 'PKR',
      interval: 'month',
      category: 'institutional',
      popular: true,
      features: {
        english: [
          'Up to 500 students',
          'Advanced teacher dashboard',
          'Admin panel',
          'Advanced analytics',
          'Custom content creation',
          'Live support',
          'Parent portal access'
        ],
        urdu: [
          '500 طلباء تک',
          'ایڈوانس ٹیچر ڈیش بورڈ',
          'ایڈمن پینل',
          'ایڈوانس تجزیات',
          'کسٹم مواد کی تخلیق',
          'لائیو سپورٹ',
          'والدین کے پورٹل تک رسائی'
        ]
      },
      limits: {
        subjects: -1,
        quizzes: -1,
        aiQueries: -1,
        students: 500,
        teachers: 50,
        analytics: true
      },
      stripePriceId: 'price_institutional_premium'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      nameUrdu: 'انٹرپرائز',
      type: 'enterprise',
      price: 0, // Custom pricing
      currency: 'PKR',
      interval: 'month',
      category: 'institutional',
      features: {
        english: [
          'Unlimited students',
          'White-label solution',
          'API access',
          'Custom integrations',
          'Dedicated support',
          'On-premise deployment',
          'Custom training'
        ],
        urdu: [
          'لامحدود طلباء',
          'وائٹ لیبل حل',
          'اے پی آئی رسائی',
          'کسٹم انٹیگریشنز',
          'مخصوص سپورٹ',
          'آن پریمائس ڈیپلائمنٹ',
          'کسٹم ٹریننگ'
        ]
      },
      limits: {
        subjects: -1,
        quizzes: -1,
        aiQueries: -1,
        students: -1,
        teachers: -1
      },
      stripePriceId: ''
    }
  ];

  const addOns: AddOn[] = [
    {
      id: 'exam_bootcamp',
      name: '4-Week Exam Rush Bootcamp',
      nameUrdu: '4 ہفتے کا امتحان رش بوٹ کیمپ',
      description: 'Intensive 4-week preparation program with daily sessions',
      descriptionUrdu: 'روزانہ سیشنز کے ساتھ 4 ہفتے کا انتہائی تیاری پروگرام',
      price: 2000,
      currency: 'PKR',
      type: 'bootcamp',
      duration: 28,
      stripePriceId: 'price_exam_bootcamp',
      popular: true
    },
    {
      id: 'live_tutoring',
      name: 'One-on-One Live Tutoring',
      nameUrdu: 'ون آن ون لائیو ٹیوٹرنگ',
      description: 'Personal tutoring sessions with expert teachers',
      descriptionUrdu: 'ماہر اساتذہ کے ساتھ ذاتی ٹیوٹرنگ سیشنز',
      price: 500,
      currency: 'PKR',
      type: 'tutoring',
      sessions: 1,
      stripePriceId: 'price_live_tutoring'
    },
    {
      id: 'past_papers',
      name: 'Complete Past Papers Package',
      nameUrdu: 'مکمل پاسٹ پیپرز پیکج',
      description: '10 years of solved past papers for all subjects',
      descriptionUrdu: 'تمام مضامین کے لیے 10 سال کے حل شدہ پاسٹ پیپرز',
      price: 800,
      currency: 'PKR',
      type: 'papers',
      stripePriceId: 'price_past_papers'
    },
    {
      id: 'ai_mentoring',
      name: 'AI Study Mentor (Premium)',
      nameUrdu: 'اے آئی اسٹڈی مینٹر (پریمیم)',
      description: 'Advanced AI mentoring with personalized guidance',
      descriptionUrdu: 'ذاتی رہنمائی کے ساتھ ایڈوانس اے آئی مینٹرنگ',
      price: 1200,
      currency: 'PKR',
      type: 'mentoring',
      duration: 30,
      stripePriceId: 'price_ai_mentoring'
    }
  ];

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (plan.id === 'free') {
      // Handle free plan selection
      return;
    }

    if (plan.id === 'enterprise') {
      // Redirect to contact form
      alert(language === 'english' 
        ? 'Enterprise plan selected. Contact information will be available soon.'
        : 'انٹرپرائز پلان منتخب کیا گیا۔ رابطے کی معلومات جلد دستیاب ہوں گی۔'
      );
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate plan selection
      setTimeout(() => {
        alert(language === 'english' 
          ? `${plan.name} plan selected! Payment integration will be available soon.`
          : `${plan.nameUrdu} پلان منتخب کیا گیا! ادائیگی کا انٹیگریشن جلد دستیاب ہوگا۔`
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error selecting plan:', error);
      setIsLoading(false);
    }
  };

  const handlePurchaseAddOn = async (addOn: AddOn) => {
    setIsLoading(true);
    
    try {
      // Simulate add-on purchase
      setTimeout(() => {
        alert(language === 'english' 
          ? `${addOn.name} add-on selected! Payment integration will be available soon.`
          : `${addOn.nameUrdu} ایڈ آن منتخب کیا گیا! ادائیگی کا انٹیگریشن جلد دستیاب ہوگا۔`
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error purchasing add-on:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          {language === 'english' ? 'Back' : 'واپس'}
        </button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'english' ? 'Choose Your Plan' : 'اپنا پلان منتخب کریں'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'english'
              ? 'Unlock your full potential with our AI-powered study coach. From individual students to entire institutions.'
              : 'ہمارے اے آئی پاور اسٹڈی کوچ کے ساتھ اپنی مکمل صلاحیت کو کھولیں۔ انفرادی طلباء سے لے کر پورے اداروں تک۔'
            }
          </p>
          
          {/* Demo Notice */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              {language === 'english'
                ? '🚀 Demo Mode: Payment integration coming soon. Explore all features now!'
                : '🚀 ڈیمو موڈ: ادائیگی کا انٹیگریشن جلد آرہا ہے۔ ابھی تمام فیچرز دیکھیں!'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Campaign Banner */}
      {activeCampaign && <CampaignBanner campaign={activeCampaign} />}

      {/* Category Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveCategory('individual')}
            className={`px-6 py-3 rounded-md text-sm font-medium flex items-center ${
              activeCategory === 'individual'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users size={18} className="mr-2" />
            {language === 'english' ? 'Individual Students' : 'انفرادی طلباء'}
          </button>
          <button
            onClick={() => setActiveCategory('institutional')}
            className={`px-6 py-3 rounded-md text-sm font-medium flex items-center ${
              activeCategory === 'institutional'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building size={18} className="mr-2" />
            {language === 'english' ? 'Schools & Institutions' : 'اسکول اور ادارے'}
          </button>
        </div>
      </div>

      {/* Individual Plans */}
      {activeCategory === 'individual' && (
        <>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {individualPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                onSelectPlan={handleSelectPlan}
                isLoading={isLoading}
                discountedPrice={getDiscountedPrice(plan.price, plan.type)}
                campaign={activeCampaign}
              />
            ))}
          </div>

          {/* Add-ons Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'english' ? 'Boost Your Learning' : 'اپنی تعلیم کو بہتر بنائیں'}
              </h2>
              <p className="text-lg text-gray-600">
                {language === 'english'
                  ? 'Add specialized programs and services to accelerate your success'
                  : 'اپنی کامیابی کو تیز کرنے کے لیے خصوصی پروگرام اور خدمات شامل کریں'
                }
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addOn) => (
                <AddOnCard
                  key={addOn.id}
                  addOn={addOn}
                  onPurchase={handlePurchaseAddOn}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Institutional Plans */}
      {activeCategory === 'institutional' && (
        <InstitutionalPricing
          plans={institutionalPlans}
          onSelectPlan={handleSelectPlan}
          isLoading={isLoading}
        />
      )}

      {/* Features Comparison */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {language === 'english' ? 'Feature Comparison' : 'فیچرز کا موازنہ'}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-medium text-gray-900">
                  {language === 'english' ? 'Features' : 'فیچرز'}
                </th>
                <th className="text-center py-4 px-4 font-medium text-gray-900">
                  {language === 'english' ? 'Free' : 'مفت'}
                </th>
                <th className="text-center py-4 px-4 font-medium text-gray-900">
                  {language === 'english' ? 'Premium' : 'پریمیم'}
                </th>
                <th className="text-center py-4 px-4 font-medium text-gray-900">
                  {language === 'english' ? 'Institutional' : 'ادارہ جاتی'}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Subjects Access', free: '2', premium: 'All', institutional: 'All' },
                { feature: 'AI Tutor Queries', free: '10/day', premium: 'Unlimited', institutional: 'Unlimited' },
                { feature: 'Progress Analytics', free: '✗', premium: '✓', institutional: '✓' },
                { feature: 'Essay Grading', free: '✗', premium: '✓', institutional: '✓' },
                { feature: 'Live Support', free: '✗', premium: '✓', institutional: '✓' },
                { feature: 'Admin Dashboard', free: '✗', premium: '✗', institutional: '✓' }
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-700">{row.feature}</td>
                  <td className="py-4 px-4 text-center">{row.free}</td>
                  <td className="py-4 px-4 text-center">{row.premium}</td>
                  <td className="py-4 px-4 text-center">{row.institutional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {language === 'english' ? 'Frequently Asked Questions' : 'اکثر پوچھے جانے والے سوالات'}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              q: language === 'english' ? 'When will payment processing be available?' : 'ادائیگی کی پروسیسنگ کب دستیاب ہوگی؟',
              a: language === 'english'
                ? 'Payment integration is coming soon. You can explore all features in demo mode for now.'
                : 'ادائیگی کا انٹیگریشن جلد آرہا ہے۔ فی الوقت آپ ڈیمو موڈ میں تمام فیچرز دیکھ سکتے ہیں۔'
            },
            {
              q: language === 'english' ? 'Will my data be secure?' : 'کیا میرا ڈیٹا محفوظ ہوگا؟',
              a: language === 'english'
                ? 'Absolutely. We use bank-level security and never share your personal information.'
                : 'بالکل۔ ہم بینک کی سطح کا سیکیورٹی استعمال کرتے ہیں اور آپ کی ذاتی معلومات کبھی شیئر نہیں کرتے۔'
            },
            {
              q: language === 'english' ? 'Do you offer discounts for rural students?' : 'کیا آپ دیہی طلباء کے لیے رعایت دیتے ہیں؟',
              a: language === 'english'
                ? 'Yes, we will have special sponsorship programs for rural students. Contact us for more information.'
                : 'جی ہاں، ہمارے پاس دیہی طلباء کے لیے خصوصی سپانسرشپ پروگرام ہوں گے۔ مزید معلومات کے لیے ہم سے رابطہ کریں۔'
            },
            {
              q: language === 'english' ? 'Can I try premium features?' : 'کیا میں پریمیم فیچرز آزما سکتا ہوں؟',
              a: language === 'english'
                ? 'Yes! All features are currently available in demo mode so you can explore everything.'
                : 'جی ہاں! تمام فیچرز فی الوقت ڈیمو موڈ میں دستیاب ہیں تاکہ آپ سب کچھ دیکھ سکیں۔'
            }
          ].map((faq, index) => (
            <div key={index}>
              <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPricingPage;