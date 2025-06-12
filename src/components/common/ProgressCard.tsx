import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'amber' | 'red';
  progress?: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  progress,
  trend,
  onClick
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      progress: 'bg-blue-600'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      progress: 'bg-green-600'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      progress: 'bg-purple-600'
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      progress: 'bg-amber-600'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      progress: 'bg-red-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } transition-all duration-200`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-xs ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={colors.text} size={24} />
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className={`h-2 rounded-full ${colors.progress}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProgressCard;