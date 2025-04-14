import { NativeModules } from 'react-native';

const { requestPermission, requestUserToken, playSong, pauseSong } =
  NativeModules.AppleMusic;

export interface AppleMusicApi {
  requestPermission: () => Promise<string>;
  requestUserToken: (
    developerToken: string,
  ) => Promise<{ isError: boolean, result: string }>;
  playSong: (playbackStoreId: string) => Promise<void>;
  pauseSong: () => Promise<void>;
}

export const appleMusicApi: AppleMusicApi = {
  requestPermission,
  requestUserToken: (developerToken: string) =>
    requestUserToken(developerToken),
  playSong,
  pauseSong,
};
