import { NativeModules } from 'react-native';

const {
  requestPermission,
  requestUserToken,
  playSong,
  pauseSong,
} = NativeModules.AppleMusic;

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
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Iks2RDJIWkc5VEIifQ.eyJpYXQiOjE1OTUzODQ2ODEsImV4cCI6MTYwNTc1MjY4MSwiaXNzIjoiWDk5Q1hKVUdESCJ9.GdTDZdLZ0a-lP9Q6edIz69Eu307fuuCkj86WFr-vsEdKlcHejzPCMesCDbL4SvStlV7x7cul_KUFBu-T0CaSCQ',
});
