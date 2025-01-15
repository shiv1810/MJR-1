import React from 'react';
import { LandingPage } from './components/LandingPage/LandingPage';
import { Dashboard } from './components/Dashboard';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { SupabaseTest } from './components/common/SupabaseTest';

function AppContent() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LandingPage />;
  }

  if (!profile?.onboarding_completed) {
    return <OnboardingFlow />;
  }

  return (
    <>
      <Dashboard />
      <SupabaseTest />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}