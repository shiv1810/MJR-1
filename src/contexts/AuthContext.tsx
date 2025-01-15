import React, { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '../lib/supabase';
import { AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock user and profile data
const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  user_metadata: {
    full_name: 'Jenny Jones'
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString()
};

const mockProfile: Profile = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  full_name: 'Jenny Jones',
  first_name: 'Jenny',
  last_name: 'Jones',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  role: 'Entrepreneur',
  bio: 'Passionate entrepreneur focused on EdTech innovation',
  location: 'San Francisco, CA',
  interests: ['EdTech', 'AI', 'Product Strategy'],
  active_projects: [
    {
      name: 'EdTech Platform',
      description: 'AI-powered learning platform',
      status: 'in-progress'
    }
  ],
  communities: ['EdTech Innovators', 'Women in Tech'],
  onboarding_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Hardcoded auth state
  const value: AuthContextType = {
    user: mockUser,
    profile: mockProfile,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    loading: false,
    error: null,
    initialized: true
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}