import { useContext } from 'react';
import auth from '@react-native-firebase/auth';
import { AuthNContext } from '../auth';

export const useIdentity = () => {
  const { user } = useContext(AuthNContext);
  return user;
};

export const logout = () => auth().signOut();
