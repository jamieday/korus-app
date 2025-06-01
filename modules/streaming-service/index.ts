import { StreamingService } from './types';
import * as AppleMusic from './apple-music';
// import * as Spotify from './spotify';

export const findService = (key: string): StreamingService => {
  return AppleMusic;
  switch (key) {
    case AppleMusic.uniqueKey:
      return AppleMusic;
    // case Spotify.uniqueKey:
    //   return Spotify;
    default:
      throw new Error(`unknown streaming service ${key}`);
  }
};
