import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthenticationProvider from '@/modules/auth/auth/AuthenticationProvider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>{children}</AuthenticationProvider>
    </QueryClientProvider>
  );
}
