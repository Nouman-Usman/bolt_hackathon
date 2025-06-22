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
  authUser: any; // The authenticated user from Supabase
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isOnboarded: false,
  language: 'english',
  setLanguage: () => {},
  logout: () => {},
  authUser: null,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, signOut, updateProfile, user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<LanguagePreference>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as LanguagePreference) || 'english';
  });

  // Sync with auth context
  useEffect(() => {
    console.log('UserContext - userProfile changed:', !!userProfile, userProfile?.name);
    console.log('UserContext - authUser:', !!authUser, authUser?.email);
    setUser(userProfile);
    if (userProfile?.languagePreference) {
      setLanguage(userProfile.languagePreference);
    }
  }, [userProfile, authUser]);

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Update user profile if language changes and user is logged in
    if (user && user.languagePreference !== language) {
      updateProfile({ languagePreference: language });
    }
  }, [language, user, updateProfile]);

  // Check if user has completed onboarding
  // For onboarding check, we need either a complete profile OR at least an authenticated user
  const isOnboarded = Boolean(user && user.grade && user.board && user.subjects?.length);
  
  // User is considered "logged in" if they have an authenticated user (even without profile)
  const hasAuthenticatedUser = Boolean(authUser);

  console.log('UserContext - isOnboarded:', isOnboarded, 'user:', !!user, 'authUser:', !!authUser, 'grade:', user?.grade, 'board:', user?.board, 'subjects:', user?.subjects?.length);

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
        logout,
        authUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};