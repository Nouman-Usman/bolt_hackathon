import { Gift, Clock, Star } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { Campaign } from '../../types/subscription';

interface CampaignBannerProps {
  campaign: Campaign;
}

const CampaignBanner: React.FC<CampaignBannerProps> = ({ campaign }) => {
  const { language } = useUser();

  const getIcon = () => {
    switch (campaign.type) {
      case 'ramadan':
        return <Star className="text-yellow-300" size={24} />;
      case 'exam_rush':
        return <Clock className="text-red-300" size={24} />;
      case 'rural_support':
        return <Gift className="text-green-300" size={24} />;
      default:
        return <Gift className="text-blue-300" size={24} />;
    }
  };

  const getBgGradient = () => {
    switch (campaign.type) {
      case 'ramadan':
        return 'from-green-600 to-emerald-700';
      case 'exam_rush':
        return 'from-red-600 to-pink-700';
      case 'rural_support':
        return 'from-blue-600 to-indigo-700';
      default:
        return 'from-purple-600 to-blue-700';
    }
  };

  const timeRemaining = Math.ceil((campaign.validTo.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`bg-gradient-to-r ${getBgGradient()} rounded-2xl p-6 mb-8 text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getIcon()}
          <div className="ml-4">
            <h3 className="text-xl font-bold">
              {language === 'english' ? campaign.name : campaign.nameUrdu}
            </h3>
            <p className="text-white/90">
              {language === 'english' ? campaign.description : campaign.descriptionUrdu}
            </p>
            {campaign.sponsorName && (
              <p className="text-sm text-white/80 mt-1">
                {language === 'english' ? 'Sponsored by' : 'کی جانب سے سپانسر'} {campaign.sponsorName}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold">
            {campaign.discountPercentage}% {language === 'english' ? 'OFF' : 'رعایت'}
          </div>
          <div className="text-sm text-white/90">
            {timeRemaining > 0 
              ? `${timeRemaining} ${language === 'english' ? 'days left' : 'دن باقی'}`
              : language === 'english' ? 'Expires soon' : 'جلد ختم'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBanner;