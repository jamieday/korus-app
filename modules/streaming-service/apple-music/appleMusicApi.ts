import { NativeModules } from 'react-native';

// const { requestPermission, requestUserToken, playSong, pauseSong } =
//   NativeModules.AppleMusic;

export interface AppleMusicApi {
  requestPermission: () => Promise<string>;
  requestUserToken: (
    developerToken: string
  ) => Promise<{ isError: boolean, result: string }>;
  playSong: (playbackStoreId: string) => Promise<void>;
  pauseSong: () => Promise<void>;
}

// Mock Implementation
export const appleMusicApi: AppleMusicApi = {
  requestPermission: async () => 'granted',
  requestUserToken: async (developerToken: string) => ({
    isError: false,
    result: 'user-token'
  }),
  playSong: async (playbackStoreId: string) => {},
  pauseSong: async () => {}
};
