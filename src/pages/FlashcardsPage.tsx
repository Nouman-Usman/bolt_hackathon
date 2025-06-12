import { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { RotateCcw, ChevronRight, ChevronLeft, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import translations from '../utils/translations';

interface Flashcard {
  id: string;
  front: {
    english: string;
    urdu?: string;
  };
  back: {
    english: string;
    urdu?: string;
  };
  subject: string;
  chapter: string;
}

const FlashcardsPage = () => {
  const { user, language } = useUser();
  const t = translations[language];
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<string>(user?.subjects[0] || '');
  
  // Reference to the card container for swipe detection
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mock flashcards data
  const mockFlashcards: Flashcard[] = [
    {
      id: '1',
      front: {
        english: "Define Newton's First Law of Motion",
        urdu: "نیوٹن کا پہلا قانون حرکت کی تعریف کریں"
      },
      back: {
        english: "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
        urdu: "کوئی جسم جو سکون میں ہے وہ سکون میں رہتا ہے اور کوئی جسم جو حرکت میں ہے وہ اسی رفتار اور اسی سمت میں حرکت میں رہتا ہے جب تک کہ اس پر کوئی غیر متوازن قوت عمل نہ کرے۔"
      },
      subject: "Physics",
      chapter: "Laws of Motion"
    },
    {
      id: '2',
      front: {
        english: "What is the difference between Mitosis and Meiosis?",
        urdu: "مائٹوسس اور میوسس میں کیا فرق ہے؟"
      },
      back: {
        english: "Mitosis results in 2 identical daughter cells with the same number of chromosomes as the parent cell. Meiosis results in 4 genetically diverse haploid cells with half the number of chromosomes.",
        urdu: "مائٹوسس کے نتیجے میں 2 بالکل ایک جیسے خلیے پیدا ہوتے ہیں جن میں والدین کے خلیے کے برابر کروموسومز ہوتے ہیں۔ میوسس کے نتیجے میں 4 جینیاتی طور پر متنوع ہیپلوئڈ خلیے پیدا ہوتے ہیں جن میں آدھے کروموسومز ہوتے ہیں۔"
      },
      subject: "Biology",
      chapter: "Cell Division"
    },
    {
      id: '3',
      front: {
        english: "What is a covalent bond?",
        urdu: "کوویلینٹ بانڈ کیا ہے؟"
      },
      back: {
        english: "A covalent bond is a chemical bond formed by the sharing of electron pairs between atoms.",
        urdu: "کوویلینٹ بانڈ ایک کیمیائی بانڈ ہے جو ایٹموں کے درمیان الیکٹران جوڑوں کے اشتراک سے بنتا ہے۔"
      },
      subject: "Chemistry",
      chapter: "Chemical Bonding"
    }
  ].filter(card => user?.subjects.includes(card.subject as any));

  const filteredCards = mockFlashcards.filter(
    card => selectedSubject === '' || card.subject === selectedSubject
  );
  
  const currentCard = filteredCards[currentCardIndex];
  
  const nextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setDirection(1);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      }, 300);
    }
  };
  
  const prevCard = () => {
    if (currentCardIndex > 0) {
      setDirection(-1);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex - 1);
        setIsFlipped(false);
      }, 300);
    }
  };
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle swipe
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;
      
      // Only consider horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          prevCard();
        } else {
          nextCard();
        }
      }
    };
    
    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentCardIndex, filteredCards.length]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t.flashcardsTitle}
        </h1>
        <p className="text-gray-600">
          {language === 'english'
            ? 'Review key concepts with flashcards.'
            : 'فلیش کارڈز کے ساتھ اہم تصورات کا جائزہ لیں۔'
          }
        </p>
      </div>

      {/* Subject filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedSubject('')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              selectedSubject === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {language === 'english' ? 'All Subjects' : 'تمام مضامین'}
          </button>
          {user?.subjects.map((subject) => (
            <button 
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                selectedSubject === subject 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {filteredCards.length > 0 ? (
        <>
          {/* Flashcard container */}
          <div className="mb-6 flex justify-center">
            <div 
              ref={cardRef}
              className="w-full max-w-md aspect-[4/3] perspective"
              onClick={toggleFlip}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentCardIndex + (isFlipped ? '-flipped' : '')}
                  initial={{ 
                    opacity: 0, 
                    x: direction * 100, 
                    rotateY: isFlipped ? 180 : 0 
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    rotateY: isFlipped ? 180 : 0 
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -direction * 100
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-full h-full rounded-xl shadow-md cursor-pointer transform-style-3d bg-white`}
                >
                  <div className={`absolute inset-0 p-6 ${!isFlipped ? 'backface-hidden' : 'backface-hidden rotate-y-180'}`}>
                    <div className="text-sm text-gray-500 mb-2">
                      {currentCard.subject} - {currentCard.chapter}
                    </div>
                    <div className="text-xl font-medium text-center h-full flex flex-col items-center justify-center">
                      {language === 'english' 
                        ? currentCard.front.english
                        : currentCard.front.urdu || currentCard.front.english
                      }
                      <div className="mt-6 text-sm text-blue-600">
                        {t.flip}
                      </div>
                    </div>
                  </div>
                  <div className={`absolute inset-0 p-6 ${isFlipped ? 'backface-hidden' : 'backface-hidden rotate-y-180'}`}>
                    <div className="text-sm text-gray-500 mb-2">
                      {currentCard.subject} - {currentCard.chapter}
                    </div>
                    <div className="text-lg text-center h-full flex items-center justify-center">
                      {language === 'english' 
                        ? currentCard.back.english
                        : currentCard.back.urdu || currentCard.back.english
                      }
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevCard}
              disabled={currentCardIndex === 0}
              className={`p-2 rounded-full ${
                currentCardIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {currentCardIndex + 1} / {filteredCards.length}
              </p>
              <div className="flex mt-1 space-x-2">
                <button 
                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextCard();
                  }}
                >
                  <ThumbsDown size={12} className="mr-1" />
                  {language === 'english' ? 'Still Learning' : 'ابھی سیکھ رہا ہوں'}
                </button>
                <button 
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextCard();
                  }}
                >
                  <ThumbsUp size={12} className="mr-1" />
                  {language === 'english' ? 'Got It' : 'سمجھ گیا'}
                </button>
              </div>
            </div>
            
            <button
              onClick={nextCard}
              disabled={currentCardIndex === filteredCards.length - 1}
              className={`p-2 rounded-full ${
                currentCardIndex === filteredCards.length - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Restart button */}
          <div className="flex justify-center">
            <button 
              onClick={() => {
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className="flex items-center text-blue-600 font-medium hover:text-blue-700"
            >
              <RotateCcw size={16} className="mr-1" />
              {language === 'english' ? 'Restart Deck' : 'ڈیک دوبارہ شروع کریں'}
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <RotateCcw size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {language === 'english'
              ? 'No flashcards available'
              : 'کوئی فلیش کارڈ دستیاب نہیں ہیں'
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'english'
              ? 'Select a different subject or create a new flashcard deck.'
              : 'ایک مختلف مضمون منتخب کریں یا ایک نیا فلیش کارڈ ڈیک بنائیں۔'
            }
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            {language === 'english' ? 'Create Flashcards' : 'فلیش کارڈز بنائیں'}
          </button>
        </div>
      )}

      {/* Custom flashcard section */}
      {filteredCards.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'english' ? 'Create Your Own Flashcards' : 'اپنے فلیش کارڈز بنائیں'}
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-600 mb-4">
              {language === 'english'
                ? 'Create custom flashcards for concepts you want to remember.'
                : 'ان تصورات کے لیے اپنی مرضی کے فلیش کارڈز بنائیں جنہیں آپ یاد رکھنا چاہتے ہیں۔'
              }
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
              {language === 'english' ? 'Create Flashcards' : 'فلیش کارڈز بنائیں'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;