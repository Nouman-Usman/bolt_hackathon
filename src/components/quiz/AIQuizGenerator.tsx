import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useAIQuiz } from '../../hooks/useAIQuiz';
import { getCurriculum } from '../../data/curriculum';
import { Brain, Settings, Play, BookOpen, Clock, Target } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { QuizGenerationRequest, GeneratedQuestion } from '../../services/aiAgents';

interface AIQuizGeneratorProps {
  onQuizGenerated: (questions: GeneratedQuestion[], metadata: any) => void;
}

const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({ onQuizGenerated }) => {
  const { user, language } = useUser();
  const { generateQuiz, loading, error } = useAIQuiz();
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState<Partial<QuizGenerationRequest>>({
    questionCount: 10,
    questionTypes: ['MCQ'],
    difficulty: 'medium',
    language: language,
    includeFormulas: true,
    focusAreas: []
  });

  if (!user) return null;

  const curriculum = getCurriculum(user.subjects[0], user.board, user.grade);
  const availableChapters = curriculum?.chapters || [];

  const handleGenerate = async () => {
    if (!user || !formData.chapterIds || formData.chapterIds.length === 0) {
      return;
    }

    const request: QuizGenerationRequest = {
      subject: user.subjects[0],
      board: user.board,
      grade: user.grade,
      chapterIds: formData.chapterIds,
      questionCount: formData.questionCount || 10,
      questionTypes: formData.questionTypes || ['MCQ'],
      difficulty: formData.difficulty || 'medium',
      language: formData.language || 'english',
      includeFormulas: formData.includeFormulas,
      focusAreas: formData.focusAreas
    };

    const result = await generateQuiz(request);
    if (result) {
      onQuizGenerated(result.questions, result.metadata);
    }
  };

  const handleChapterToggle = (chapterId: string) => {
    const currentChapters = formData.chapterIds || [];
    const newChapters = currentChapters.includes(chapterId)
      ? currentChapters.filter(id => id !== chapterId)
      : [...currentChapters, chapterId];
    
    setFormData({ ...formData, chapterIds: newChapters });
  };

  const handleQuestionTypeToggle = (type: string) => {
    const currentTypes = formData.questionTypes || [];
    const newTypes = currentTypes.includes(type as any)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type as any];
    
    setFormData({ ...formData, questionTypes: newTypes });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="text-blue-600 mr-3" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'english' ? 'AI Quiz Generator' : 'اے آئی کوئز جنریٹر'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'english' 
                ? 'Generate custom quizzes based on your curriculum and past papers'
                : 'اپنے نصاب اور پاسٹ پیپرز کی بنیاد پر کسٹم کوئزز بنائیں'
              }
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <Settings size={16} className="mr-1" />
          {language === 'english' ? 'Advanced' : 'ایڈوانس'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Chapter Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <BookOpen size={16} className="inline mr-2" />
            {language === 'english' ? 'Select Chapters' : 'چیپٹرز منتخب کریں'}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableChapters.map((chapter) => (
              <label key={chapter.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.chapterIds?.includes(chapter.id) || false}
                  onChange={() => handleChapterToggle(chapter.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Ch {chapter.number}: {language === 'english' ? chapter.title : chapter.titleUrdu || chapter.title}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Basic Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'english' ? 'Number of Questions' : 'سوالات کی تعداد'}
            </label>
            <select
              value={formData.questionCount}
              onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
              <option value={25}>25 Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'english' ? 'Difficulty Level' : 'مشکل کی سطح'}
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">{language === 'english' ? 'Easy' : 'آسان'}</option>
              <option value="medium">{language === 'english' ? 'Medium' : 'درمیانہ'}</option>
              <option value="hard">{language === 'english' ? 'Hard' : 'مشکل'}</option>
              <option value="mixed">{language === 'english' ? 'Mixed' : 'مخلوط'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'english' ? 'Quiz Language' : 'کوئز کی زبان'}
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="english">English</option>
              <option value="urdu">اردو</option>
            </select>
          </div>
        </div>

        {/* Question Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {language === 'english' ? 'Question Types' : 'سوال کی اقسام'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['MCQ', 'Short Answer', 'Long Answer', 'Numerical'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.questionTypes?.includes(type as any) || false}
                  onChange={() => handleQuestionTypeToggle(type)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="border-t pt-6 space-y-4">
            <h4 className="font-medium text-gray-900">
              {language === 'english' ? 'Advanced Options' : 'ایڈوانس آپشنز'}
            </h4>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeFormulas"
                checked={formData.includeFormulas || false}
                onChange={(e) => setFormData({ ...formData, includeFormulas: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeFormulas" className="ml-2 text-sm text-gray-700">
                {language === 'english' ? 'Include formula-based questions' : 'فارمولا پر مبنی سوالات شامل کریں'}
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'english' ? 'Focus Areas (Optional)' : 'توجہ کے علاقے (اختیاری)'}
              </label>
              <input
                type="text"
                placeholder={language === 'english' ? 'e.g., Newton\'s laws, Kinematics' : 'مثال: نیوٹن کے قوانین، حرکیات'}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({ 
                  ...formData, 
                  focusAreas: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleGenerate}
            disabled={loading || !formData.chapterIds?.length || !formData.questionTypes?.length}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              loading || !formData.chapterIds?.length || !formData.questionTypes?.length
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <LoadingSpinner size={16} className="mr-2" />
            ) : (
              <Play size={16} className="mr-2" />
            )}
            {loading 
              ? (language === 'english' ? 'Generating Quiz...' : 'کوئز بنایا جا رہا ہے...')
              : (language === 'english' ? 'Generate AI Quiz' : 'اے آئی کوئز بنائیں')
            }
          </button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start">
            <Target className="text-blue-600 mr-2 mt-0.5" size={16} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">
                {language === 'english' ? 'AI-Powered Quiz Generation' : 'اے آئی پاور کوئز جنریشن'}
              </p>
              <p>
                {language === 'english'
                  ? 'Our AI analyzes your curriculum, past papers, and exam patterns to create personalized quizzes that match board exam standards.'
                  : 'ہمارا اے آئی آپ کے نصاب، پاسٹ پیپرز، اور امتحان کے پیٹرن کا تجزیہ کرکے ذاتی کوئزز بناتا ہے جو بورڈ امتحان کے معیار سے میل کھاتے ہیں۔'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuizGenerator;