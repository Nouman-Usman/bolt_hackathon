import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { 
  BookOpen, 
  Home,
  Brain,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Crown
} from 'lucide-react';
import { useState } from 'react';
import LanguageToggle from '../common/LanguageToggle';
import PremiumBadge from '../common/PremiumBadge';
import translations from '../../utils/translations';

const Layout = () => {
  const { user, language, logout } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const t = translations[language];

  // Mock premium status - in real app, this would come from user context
  const isPremium = false;

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: t.home },
    { path: '/study-plan', icon: <BookOpen size={20} />, label: t.studyPlan },
    { path: '/quiz', icon: <Brain size={20} />, label: t.quizzes },
    { path: '/flashcards', icon: <BookOpen size={20} />, label: t.flashcards },
    { path: '/dashboard', icon: <BarChart3 size={20} />, label: t.dashboard },
    { path: '/chat', icon: <MessageSquare size={20} />, label: t.chatbot },
    { path: '/settings', icon: <Settings size={20} />, label: t.settings },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-4 md:hidden z-20">
        <div className="flex items-center space-x-2">
          <button onClick={toggleMobileMenu} className="p-2">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-semibold text-lg text-blue-600">{t.appName}</span>
          {isPremium && <Crown className="text-yellow-500" size={16} />}
        </div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-10 md:hidden" onClick={toggleMobileMenu}>
          <div className="absolute top-16 left-0 w-64 h-[calc(100%-4rem)] bg-white p-4" onClick={e => e.stopPropagation()}>
            <nav className="h-full flex flex-col justify-between">
              <div>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg mb-1 ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                {!isPremium && (
                  <Link
                    to="/pricing"
                    className="flex items-center space-x-3 p-3 rounded-lg mb-1 bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 border border-orange-200"
                    onClick={toggleMobileMenu}
                  >
                    <Crown size={20} />
                    <span>{language === 'english' ? 'Upgrade to Premium' : 'پریمیم میں اپگریڈ کریں'}</span>
                  </Link>
                )}
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={20} />
                <span>{t.logout}</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BookOpen className="text-blue-600" size={24} />
            <h1 className="text-xl font-bold text-gray-800">{t.appName}</h1>
            {isPremium && <Crown className="text-yellow-500" size={20} />}
          </div>
          <p className="text-sm text-gray-500 mt-1">{t.tagline}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          {!isPremium && (
            <Link
              to="/pricing"
              className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-700 border border-orange-200 hover:from-yellow-100 hover:to-orange-100 transition-colors duration-200"
            >
              <Crown size={20} />
              <span>{language === 'english' ? 'Upgrade to Premium' : 'پریمیم میں اپگریڈ کریں'}</span>
            </Link>
          )}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-700">{t.language}</div>
            <LanguageToggle />
          </div>
          
          {user && (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  {isPremium && <PremiumBadge feature="Premium" />}
                </div>
                <p className="text-xs text-gray-500">{user.grade} • {user.board}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;