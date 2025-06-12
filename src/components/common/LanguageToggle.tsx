import { useUser } from '../../contexts/UserContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useUser();
  
  return (
    <div className="inline-flex">
      <button
        onClick={() => setLanguage('english')}
        className={`px-3 py-1.5 text-xs font-medium rounded-l-md ${
          language === 'english'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('urdu')}
        className={`px-3 py-1.5 text-xs font-medium rounded-r-md ${
          language === 'urdu'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        اردو
      </button>
    </div>
  );
};

export default LanguageToggle;