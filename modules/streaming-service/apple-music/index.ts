import { Linking } from 'react-native';
import { appleMusicApi } from './appleMusicApi';
import { StreamingService } from '../types';

export const uniqueKey = 'apple-music';
export const header = 'X-Apple-Music-User-Token';

export const authenticate = async (): Promise<[string | undefined, any]> => {
  // const appleMusicPermission = await appleMusicApi.requestPermission();
  // if (appleMusicPermission !== 'ok') {
  return [
    undefined,
    {
      problem: "To connect, we'll need access to your Apple Music.",
      solution: { message: 'Grant access', action: Linking.openSettings }
    }
  ];
  // }
  // const result = await appleMusicApi.requestUserToken();
  // if (result.isError) {
  return [
    undefined,
    "Hmm, we can't access your Apple Music. Do you have an Apple Music subscription?"
  ];
  // }
  // return [result.result, undefined];
};

const AppleMusicService: StreamingService = {
  uniqueKey,
  header,
  authenticate
};

export default AppleMusicService;
