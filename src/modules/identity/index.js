import auth from '@react-native-firebase/auth';

export const getUsername = () => {
  const user = auth().currentUser;
  return user && user.displayName;
};

export const getUserToken = async () => {
  const user = auth().currentUser;
  return user && (await auth().currentUser.getIdToken());
};

export const logout = () => auth().signOut();
