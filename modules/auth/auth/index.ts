import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React from 'react';

export const AuthNContext = React.createContext<{
  user: FirebaseAuthTypes.User | null,
  userToken: string | null,
  refreshToken: () => Promise<void>,
}>({
  user: null,
  userToken: null,
  refreshToken: () => Promise.resolve(),
});
