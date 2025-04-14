import { StreamingService } from './types';
import * as AppleMusic from './apple-music';
import * as Spotify from './spotify';

export const findService = (key: string): StreamingService => {
  switch (key) {
    case AppleMusic.uniqueKey:
      return AppleMusic;
    case Spotify.uniqueKey:
      return Spotify;
    default:
      throw new Error(`unknown streaming service ${key}`);
  }
};

export {
  StreamingServiceContext,
  useStreamingService,
} from './StreamingServiceContext';
export { PlaybackContext, PlaybackContextProvider } from './PlaybackContext';
export { usePlayer } from './usePlayer';
export { AppleMusic, Spotify };
