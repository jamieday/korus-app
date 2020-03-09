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
  playMusic = playMusic;
  // public fetchSong = (id: string) =>
  // this.appleMusicWebApi.fetchSong(id);
}
