import { motion } from 'framer-motion';
import { Flame, Calendar } from 'lucide-react';

interface StudyStreakCardProps {
  currentStreak: number;
  longestStreak: number;
  language: 'english' | 'urdu';
}

const StudyStreakCard: React.FC<StudyStreakCardProps> = ({
  currentStreak,
  longestStreak,
  language
}) => {
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const isActive = i < currentStreak;
    return isActive;
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Flame size={24} className="mr-2" />
          <h3 className="font-semibold">
            {language === 'english' ? 'Study Streak' : 'مطالعہ اسٹریک'}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{currentStreak}</div>
          <div className="text-xs opacity-80">
            {language === 'english' ? 'days' : 'دن'}
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        {streakDays.map((isActive, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              isActive 
                ? 'bg-white text-orange-500' 
                : 'bg-white/20 text-white/60'
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm opacity-80">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          <span>
            {language === 'english' ? 'Best' : 'بہترین'}: {longestStreak} {language === 'english' ? 'days' : 'دن'}
          </span>
        </div>
        <span>
          {language === 'english' ? 'Keep it up!' : 'جاری رکھیں!'}
        </span>
      </div>
    </motion.div>
  );
};

export default StudyStreakCard;