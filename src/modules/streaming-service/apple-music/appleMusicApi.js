import { NativeModules } from 'react-native';

const { requestPermission, requestUserToken, playSong, pauseSong } =
  NativeModules.AppleMusic;

export class AppleMusicApi {
  config;

  constructor(config) {
    this.config = config;
  }

  requestPermission = requestPermission;

  requestUserToken = () => requestUserToken(this.config.developerToken);

  playSong = playSong;

  pauseSong = pauseSong;
}

export const appleMusicApi = new AppleMusicApi({
  developerToken:
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkJXNEFEQjRTOU0ifQ.eyJpYXQiOjE2MDQ5NzU3NjcsImV4cCI6MTYyMDUyNzc2NywiaXNzIjoiWDk5Q1hKVUdESCJ9.mpfKpcmT5dbrUFci34zM4Kr9ZFGcGuu0-Ne3BiGnFPpFyuoEdNexxCghT3kHJiW55pz2wuwvD5IpAFBkjWUC4g',
});
