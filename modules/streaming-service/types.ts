export interface StreamingService {
  uniqueKey: string;
  header: string;
  authenticate: () => Promise<[string | undefined, any]>;
  connect?: (playUri: string) => Promise<[string | undefined, any]>;
}

export interface StreamingServiceContext {
  key: string;
  accessToken: string;
  reset: () => void;
  connectPlayer?: (playUri: string) => Promise<void>;
}

export interface StreamingServiceHook {
  context: StreamingServiceContext | undefined;
  service: StreamingService | undefined;
}

export type PlaybackState = {
  key: 'ready' | 'playing' | 'paused',
  songId?: {
    service: 'spotify' | 'apple-music',
    id: string,
  },
  song?: {
    name: string,
    songName: string,
    artist: string,
    artistName: string,
    spotify?: {
      id: string,
      playUri: string,
    },
    appleMusic?: {
      playbackStoreId: string,
    },
    artworkUrl?: string,
  },
  progress?: {
    lastElapsedMs: number,
    totalMs: number,
    lastUpdateMs: number,
  },
};

export type PlaybackStateChangedPlaybackState = {
  playbackPosition: number,
  playbackDuration: number,
  mode: 'playing' | 'paused',
  song: {
    songId: {
      service: 'spotify',
      id: string,
    },
    spotify: {
      id: string,
      playUri: string,
    },
    name: string,
    artist: string,
    artworkUrl: string,
  },
};

export type PlaybackAction =
  | { type: 'resume' }
  | { type: 'play', song: PlaybackState['song'] }
  | { type: 'pause' }
  | { type: 'seek', positionMs: number }
  | {
      type: 'playerStateChanged',
      playbackState: PlaybackStateChangedPlaybackState,
    };

export type PlaybackContextType = {
  playbackState: PlaybackState,
  dispatch: React.Dispatch<PlaybackAction>,
};

export type PlayerHook = {
  seek: (positionMs: number) => void,
  canPlay: (song: PlaybackState['song']) => boolean,
  playSong: (song: PlaybackState['song']) => void,
  pauseSong: () => void,
  state: PlaybackState,
  supportsTracking: boolean,
};
