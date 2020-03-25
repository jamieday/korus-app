import { Alert } from 'react-native';

const users = ['andrew', 'jamie', 'alex'];

export const getUsername = () =>
  new Promise(resolve =>
    Alert.alert('Who are you again?', undefined, [
      ...users.map(user => ({
        text: user,
        onPress: () => resolve(user),
      })),
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => resolve(undefined),
      },
    ]),
  );
