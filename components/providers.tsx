import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthenticationProvider from '@/modules/auth/auth/AuthenticationProvider';
import { UserRegistrationGate } from '@/modules/auth/auth/UserRegistrationGate';
import { ProfileOnboardingGate } from '@/modules/onboarding/ProfileOnboardingGate';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>
        <UserRegistrationGate>
          <ProfileOnboardingGate>{children}</ProfileOnboardingGate>
        </UserRegistrationGate>
      </AuthenticationProvider>
    </QueryClientProvider>
  );
}
