import React from 'react';
import { remote } from 'react-native-spotify-remote';
import { useStreamingService } from './StreamingServiceContext';
import { PlaybackState, PlaybackAction, PlaybackContextType } from './types';

const initialState: PlaybackState = { key: 'ready' };

export const PlaybackContext = React.createContext<PlaybackContextType>({
  playbackState: initialState,
  dispatch: () => {},
});

const compatibilitySong = (
  song: PlaybackState['song'],
): PlaybackState['song'] => {
  if (!song) return song;
  const compatibleSong = { ...song };
  if (!compatibleSong.name) {
    compatibleSong.name = compatibleSong.songName;
  }
  if (!compatibleSong.songName) {
    compatibleSong.songName = compatibleSong.name;
  }
  if (!compatibleSong.artist) {
    compatibleSong.artist = compatibleSong.artistName;
  }
  if (!compatibleSong.artistName) {
    compatibleSong.artistName = compatibleSong.artist;
  }
  return compatibleSong;
};

const playbackReducerByService =
  (serviceKey: string) =>
  (prevState: PlaybackState, action: PlaybackAction): PlaybackState => {
    switch (action.type) {
      case 'resume':
        // Mutation - resume
        return prevState;
      // Caused conflict with player state changed evt
      // return { ...prevState, key: 'playing' };
      case 'play': {
        const songId = action.song?.spotify
          ? { service: 'spotify' as const, id: action.song.spotify.id }
          : action.song?.appleMusic
            ? {
                service: 'apple-music' as const,
                id: action.song.appleMusic.playbackStoreId,
              }
            : undefined;

        return { key: 'playing', songId, song: compatibilitySong(action.song) };
      }
      case 'pause':
        // Mutation - pause
        if (serviceKey !== 'spotify') {
          // In Spotify, this caused conflict with player state changed evt
          if (prevState.key !== 'playing') {
            return prevState;
          }
          return {
            key: 'paused',
            songId: prevState.songId,
            song: prevState.song,
          };
        }
        return prevState;
      case 'seek':
        // Mutation - seek
        if (typeof prevState.progress === 'undefined') {
          return prevState;
        }
        return {
          ...prevState,
          progress: {
            ...prevState.progress,
            lastElapsedMs: action.positionMs,
            lastUpdateMs: new Date().getTime(),
          },
        };
      case 'playerStateChanged': {
        // Real state change from source
        // todo song id is weird anyway
        const spotifyTrackId = action.playbackState.song?.spotify?.id;
        return {
          key: action.playbackState.mode,
          songId: spotifyTrackId
            ? { service: 'spotify' as const, id: spotifyTrackId }
            : undefined,
          song: compatibilitySong(action.playbackState.song as any),
          progress: {
            lastElapsedMs: action.playbackState.playbackPosition,
            totalMs: action.playbackState.playbackDuration,
            lastUpdateMs: new Date().getTime(),
          },
        };
      }
      default:
        throw new Error('Unhandled playback action');
    }
  };

export const PlaybackContextProvider: React.FC<{
  children: React.ReactNode,
}> = ({ children }) => {
  const streamingService = useStreamingService();

  const [playbackState, dispatch] = React.useReducer(
    playbackReducerByService(streamingService.service?.uniqueKey || ''),
    initialState,
  );

  const playback = React.useMemo(
    () => ({
      playbackState,
      dispatch,
    }),
    [playbackState, dispatch],
  );

  React.useEffect(() => {
    const playerStateChangedListener = (spotifyPlaybackState: any) => {
      const spotifyTrackId = spotifyPlaybackState.track.uri.split(':')[2];
      dispatch({
        type: 'playerStateChanged',
        playbackState: {
          playbackPosition: spotifyPlaybackState.playbackPosition,
          playbackDuration: spotifyPlaybackState.track.duration,
          mode: spotifyPlaybackState.isPaused ? 'paused' : 'playing',
          song: {
            songId: {
              service: 'spotify',
              id: spotifyTrackId,
            },
            spotify: {
              id: spotifyTrackId,
              playUri: spotifyPlaybackState.track.uri,
            },
            name: spotifyPlaybackState.track.name,
            artist: spotifyPlaybackState.track.artist.name,
            artworkUrl:
              'https://www.oca.org/Images/About/Worship/ascension.jpg',
          },
        },
      });
    };

    remote.addListener('playerStateChanged', playerStateChangedListener);
    return () => {
      remote.removeListener('playerStateChanged', playerStateChangedListener);
    };
  }, []);

  return (
    <PlaybackContext.Provider value={playback}>
      {children}
    </PlaybackContext.Provider>
  );
};
