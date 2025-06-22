import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserProfile, LanguagePreference } from '../types/user';

interface UserContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isOnboarded: boolean;
  language: LanguagePreference;
  setLanguage: (lang: LanguagePreference) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isOnboarded: false,
  language: 'english',
  setLanguage: () => {},
  logout: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, signOut, updateProfile } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<LanguagePreference>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as LanguagePreference) || 'english';
  });

  // Sync with auth context
  useEffect(() => {
    console.log('UserContext - userProfile changed:', !!userProfile, userProfile?.name);
    setUser(userProfile);
    if (userProfile?.languagePreference) {
      setLanguage(userProfile.languagePreference);
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Update user profile if language changes and user is logged in
    if (user && user.languagePreference !== language) {
      updateProfile({ languagePreference: language });
    }
  }, [language, user, updateProfile]);

  // Check if user has completed onboarding
  const isOnboarded = Boolean(user && user.grade && user.board && user.subjects?.length);

  console.log('UserContext - isOnboarded:', isOnboarded, 'user:', !!user, 'grade:', user?.grade, 'board:', user?.board, 'subjects:', user?.subjects?.length);

  const logout = async () => {
    await signOut();
    setUser(null);
    localStorage.removeItem('language');
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        isOnboarded, 
        language, 
        setLanguage,
        logout 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};