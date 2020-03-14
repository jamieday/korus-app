import { NativeModules } from 'react-native';

// type Response<T, TError = never> = { isError: true, data: TError } | {isError:false, data : T}

// interface MusicKit {
//   requestPermission: () => Promise<
//     Response<'ok', 'denied' | 'not determined' | 'restricted'>
//   >;

//   requestUserToken: (
//     developerToken: string
//   ) => Promise<Response<string>>;

//   playMusic(ids: string[]): Promise<void>;
// }

const {
  requestPermission,
  requestUserToken,
  selectSong,
  playMusic,
} = NativeModules.AppleMusic;

export class AppleMusicApi {
  // appleMusicWebApi: AppleMusicWebApi;

  constructor(config) {
    // this.appleMusicWebApi = new AppleMusicWebApi(
    // config.developerToken
    // );
  }

  requestPermission = requestPermission;
  requestUserToken = () => requestUserToken(this.config.developerToken);
  selectSong = selectSong;
  playMusic = playMusic;
  // public fetchSong = (id: string) =>
  // this.appleMusicWebApi.fetchSong(id);
}

export const appleMusicApi = new AppleMusicApi({
  developerToken:
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlBMNDZSUjk2SEcifQ.eyJpYXQiOjE1ODM4MDg3MTgsImV4cCI6MTU5OTM2MDcxOCwiaXNzIjoiWDk5Q1hKVUdESCJ9.IUt00CNvZYiEDRV27FNpdI79n6FhH6qyDzsTXaxeFPcQ_GDWaergg2ARs8tHGUbLuCCPLqpAB32iGcCVPr-prQ',
});
