import { Crown } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface PremiumBadgeProps {
  feature: string;
  onClick?: () => void;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ feature, onClick }) => {
  const { language } = useUser();

  return (
    <div 
      className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:from-yellow-500 hover:to-orange-600 transition-colors duration-200"
      onClick={onClick}
    >
      <Crown size={12} className="mr-1" />
      {language === 'english' ? 'Premium' : 'پریمیم'}
    </div>
  );
};

export default PremiumBadge;