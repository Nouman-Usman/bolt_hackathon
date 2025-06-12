import { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Send, User, Bot, Trash2, PlusCircle } from 'lucide-react';
import translations from '../utils/translations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatbotPage = () => {
  const { user, language } = useUser();
  const t = translations[language];
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: language === 'english'
        ? `Hello ${user?.name || 'there'}! I'm your AI study tutor. How can I help you with your ${user?.grade || ''} studies today?`
        : `ہیلو ${user?.name || 'وہاں'}! میں آپ کا اے آئی سٹڈی ٹیوٹر ہوں۔ آج میں آپ کی ${user?.grade || ''} کی تعلیم میں کیسے مدد کر سکتا ہوں؟`,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTopic, setActiveTopic] = useState<string>('');

  // Mock AI responses based on input
  const getMockResponse = (input: string): string => {
    // English responses
    if (language === 'english') {
      if (input.toLowerCase().includes('meiosis') || input.toLowerCase().includes('mitosis')) {
        return "Mitosis and meiosis are both types of cell division, but they serve different purposes. Mitosis occurs in somatic cells and results in 2 identical daughter cells with the same number of chromosomes as the parent cell. It's used for growth and repair. Meiosis, on the other hand, occurs in germ cells and creates 4 unique gametes with half the number of chromosomes. This is essential for sexual reproduction and genetic diversity. Would you like me to explain any specific aspect of these processes in more detail?";
      } 
      
      if (input.toLowerCase().includes('newton') || input.toLowerCase().includes('law of motion')) {
        return "Newton's Laws of Motion are three fundamental principles that describe the relationship between a body and the forces acting upon it. The First Law (Law of Inertia) states that an object will remain at rest or in uniform motion unless acted upon by an external force. The Second Law defines that force equals mass times acceleration (F=ma). The Third Law states that for every action, there is an equal and opposite reaction. These laws form the foundation of classical mechanics. Would you like me to explain any of these laws with examples from your textbook?";
      }
      
      if (input.toLowerCase().includes('solve') || input.toLowerCase().includes('problem') || input.toLowerCase().includes('question')) {
        return "I'd be happy to help you solve this problem! Could you please share the complete question or problem statement? For mathematical problems, try to be as specific as possible with the equations or scenario. For conceptual questions, let me know which chapter or topic this relates to so I can provide the most accurate answer according to your board's syllabus.";
      }
      
      return "That's a great question about your studies! To give you the most helpful answer according to your board's curriculum, could you tell me a bit more about what specific concept you're trying to understand? I'm here to help with explanations, worked examples, or even practice questions on this topic.";
    } 
    // Urdu responses
    else {
      if (input.includes('میوسس') || input.includes('مائٹوسس')) {
        return "مائٹوسس اور میوسس دونوں ہی خلیے کی تقسیم کی اقسام ہیں، لیکن ان کے مقاصد مختلف ہیں۔ مائٹوسس جسمانی خلیوں میں ہوتا ہے اور اس کے نتیجے میں 2 بالکل ایک جیسے خلیے پیدا ہوتے ہیں جن میں والدین کے خلیے کے برابر کروموسومز ہوتے ہیں۔ یہ نشوونما اور مرمت کے لیے استعمال ہوتا ہے۔ دوسری طرف، میوسس جرم خلیوں میں ہوتا ہے اور 4 منفرد گیمیٹس پیدا کرتا ہے جن میں آدھے کروموسومز ہوتے ہیں۔ یہ جنسی تولید اور جینیاتی تنوع کے لیے ضروری ہے۔ کیا آپ چاہتے ہیں کہ میں ان عملوں کے کسی خاص پہلو کو مزید تفصیل سے سمجھاؤں؟";
      }
      
      if (input.includes('نیوٹن') || input.includes('قانون حرکت')) {
        return "نیوٹن کے قوانین حرکت تین بنیادی اصول ہیں جو ایک جسم اور اس پر عمل کرنے والے قوتوں کے درمیان تعلق کو بیان کرتے ہیں۔ پہلا قانون (قانون جمود) بتاتا ہے کہ کوئی جسم سکون یا یکساں حرکت میں رہے گا جب تک کہ اس پر کوئی خارجی قوت عمل نہ کرے۔ دوسرا قانون بیان کرتا ہے کہ قوت کثافت ضرب تیزی کے برابر ہوتی ہے (F=ma)۔ تیسرا قانون بتاتا ہے کہ ہر عمل کے لیے ایک مساوی اور متضاد رد عمل ہوتا ہے۔ یہ قوانین کلاسیکی میکانکس کی بنیاد ہیں۔ کیا آپ چاہتے ہیں کہ میں آپ کی درسی کتاب سے مثالوں کے ساتھ ان قوانین میں سے کسی کی وضاحت کروں؟";
      }
      
      if (input.includes('حل') || input.includes('مسئلہ') || input.includes('سوال')) {
        return "میں آپ کے اس مسئلے کو حل کرنے میں آپ کی مدد کروں گا! براہ کرم مکمل سوال یا مسئلہ شیئر کریں۔ ریاضی کے مسائل کے لیے، مساوات یا صورتحال کے ساتھ جتنا ممکن ہو سکے اتنا مخصوص ہونے کی کوشش کریں۔ تصوراتی سوالات کے لیے، مجھے بتائیں کہ یہ کس باب یا موضوع سے متعلق ہے تاکہ میں آپ کے بورڈ کے نصاب کے مطابق سب سے زیادہ درست جواب فراہم کر سکوں۔";
      }
      
      return "آپ کے تعلیمی سوال کے لیے شکریہ! آپ کے بورڈ کے نصاب کے مطابق آپ کو سب سے زیادہ مددگار جواب دینے کے لیے، کیا آپ مجھے بتا سکتے ہیں کہ آپ کس مخصوص تصور کو سمجھنے کی کوشش کر رہے ہیں؟ میں وضاحت، حل شدہ مثالوں، یا اس موضوع پر عملی سوالات کے ساتھ مدد کرنے کے لیے موجود ہوں۔";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI typing
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(input),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Mock topics for quick access
  const suggestedTopics = [
    language === 'english' ? "Newton's Laws of Motion" : "نیوٹن کے قوانین حرکت",
    language === 'english' ? "Cell Division" : "خلیہ کی تقسیم",
    language === 'english' ? "Chemical Bonding" : "کیمیائی بانڈنگ",
    language === 'english' ? "Integration" : "انٹیگریشن"
  ];

  const handleTopicClick = (topic: string) => {
    setActiveTopic(topic);
    setInput(topic);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] md:h-[calc(100vh-148px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t.chatbot}
        </h1>
        <p className="text-gray-600">
          {language === 'english'
            ? 'Ask your AI tutor any question related to your studies.'
            : 'اپنے مطالعہ سے متعلق کوئی بھی سوال اپنے اے آئی ٹیوٹر سے پوچھیں۔'
          }
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Suggested topics sidebar */}
        <div className="md:w-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100 md:h-full">
          <h3 className="font-medium text-gray-700 mb-3">
            {language === 'english' ? 'Suggested Topics' : 'تجویز کردہ موضوعات'}
          </h3>
          <div className="space-y-2">
            {suggestedTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicClick(topic)}
                className={`w-full text-left p-2 rounded-lg text-sm ${
                  activeTopic === topic
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="font-medium text-gray-700 mb-3">
              {language === 'english' ? 'Recent Conversations' : 'حالیہ بات چیت'}
            </h3>
            <div className="space-y-2">
              <button className="flex items-center justify-between w-full text-left p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                <span className="truncate">
                  {language === 'english' ? 'Physics - Motion Problems' : 'فزکس - حرکت کے مسائل'}
                </span>
                <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
              </button>
              <button className="flex items-center justify-between w-full text-left p-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                <span className="truncate">
                  {language === 'english' ? 'Chemistry - Reactions' : 'کیمسٹری - ری ایکشنز'}
                </span>
                <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
            <button className="mt-2 text-blue-600 text-sm font-medium flex items-center">
              <PlusCircle size={14} className="mr-1" />
              {language === 'english' ? 'New Conversation' : 'نئی بات چیت'}
            </button>
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    <div className="flex items-center mb-1">
                      {message.role === 'assistant' ? (
                        <Bot size={16} className="mr-1 text-blue-600" />
                      ) : (
                        <User size={16} className="mr-1" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.role === 'assistant' 
                          ? language === 'english' ? 'AI Tutor' : 'اے آئی ٹیوٹر'
                          : language === 'english' ? 'You' : 'آپ'
                        }
                      </span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-gray-100 rounded-2xl rounded-tl-none p-4">
                    <div className="flex items-center mb-1">
                      <Bot size={16} className="mr-1 text-blue-600" />
                      <span className="text-xs text-gray-500">
                        {language === 'english' ? 'AI Tutor' : 'اے آئی ٹیوٹر'}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.chatPlaceholder}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`px-4 rounded-lg flex items-center justify-center ${
                  input.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {language === 'english'
                ? 'AI responses are aligned with your board curriculum and textbooks.'
                : 'اے آئی جوابات آپ کے بورڈ کے نصاب اور درسی کتابوں کے مطابق ہیں۔'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;