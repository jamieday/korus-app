import { User } from 'firebase/auth';
import React from 'react';

export const AuthNContext = React.createContext<{
  user: User | null,
  userToken: string | null,
  refreshToken: () => Promise<void>
}>({
  user: null,
  userToken: null,
  refreshToken: () => Promise.resolve()
});
