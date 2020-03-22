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
  config;

  constructor(config) {
    // this.appleMusicWebApi = new AppleMusicWebApi(
    // config.developerToken
    // );
    this.config = config;
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
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Iks2RDJIWkc5VEIifQ.eyJpYXQiOjE1ODQ5MTg5NjUsImV4cCI6MTU5NTI4Njk2NSwiaXNzIjoiWDk5Q1hKVUdESCJ9.xvnwF49hVhuBQz4mi8OqEIbBDOBG9t4HNj_Q4qiLh8KKgmBR28T6bIcq0ZxnKvGFQ-NeyJX4_rxkGAVIMFDF-w',
});
