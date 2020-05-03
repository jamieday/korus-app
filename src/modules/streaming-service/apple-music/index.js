/* eslint-disable import/prefer-default-export */
import { appleMusicApi } from '../../../react-native-apple-music/io/appleMusicApi';
import { Linking } from 'react-native';

export const uniqueKey = 'apple-music';
// Header duplicated in backend {8eeaa95a-ab4f-45ca-a97a-f4767d8f4872}
export const header = 'X-Apple-Music-User-Token';

export const requestToken = async () => {
  const appleMusicPermission = await appleMusicApi.requestPermission();
  if (appleMusicPermission !== 'ok') {
    return [
      undefined,
      {
        problem: "To connect, we'll need access to your Apple Music.",
        solution: { message: 'Grant access', action: Linking.openSettings },
      },
    ];
  }
  const result = await appleMusicApi.requestUserToken();
  if (result.isError) {
    return [
      undefined,
      "Hmm, we can't access your Apple Music. Do you have an Apple Music subscription?",
    ];
  }
  return [result.result, undefined];
};
