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
    'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Iks2RDJIWkc5VEIifQ.eyJpYXQiOjE1ODQ5MTg5NjUsImV4cCI6MTU5NTI4Njk2NSwiaXNzIjoiWDk5Q1hKVUdESCJ9.xvnwF49hVhuBQz4mi8OqEIbBDOBG9t4HNj_Q4qiLh8KKgmBR28T6bIcq0ZxnKvGFQ-NeyJX4_rxkGAVIMFDF-w',
});
