import auth from '@react-native-firebase/auth';

export const getUsername = () => {
  const user = auth().currentUser;
  return user && user.displayName;
};
