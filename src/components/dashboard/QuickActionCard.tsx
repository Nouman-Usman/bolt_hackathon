import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  disabled?: boolean;
  badge?: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
  disabled = false,
  badge
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-md hover:border-gray-200'
      }`}
    >
      {badge && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 text-xs font-medium px-2 py-1 rounded-full">
          {badge}
        </div>
      )}
      
      <div className={`p-3 rounded-lg mb-3 ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </motion.button>
  );
};

export default QuickActionCard;