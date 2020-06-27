import React from 'react';
import { remote } from 'react-native-spotify-remote';
import { useStreamingService } from './StreamingServiceContext';

const initialState = { key: 'ready' };

export const PlaybackContext = React.createContext(initialState);

/* eslint-disable no-param-reassign */
// Just a temporary method to support all sorts of song objects
// that might come through ;) Lovely
const compatibilitySong = (song) => {
  if (!song.name) {
    song.name = song.songName;
  }
  if (!song.songName) {
    song.songName = song.name;
  }
  if (!song.artist) {
    song.artist = song.artistName;
  }
  if (!song.artistName) {
    song.artistName = song.artist;
  }
  return song;
};

const playbackReducerByService = (serviceKey) => (prevState, action) => {
  switch (action.type) {
    case 'resume':
      // Mutation - resume
      return prevState;
    // Caused conflict with player state changed evt
    // return { ...prevState, key: 'playing' };
    case 'play':
      // Mutation - play
      const songId = action.song.spotify
        ? { service: 'spotify', id: action.song.spotify.id }
        : {
            service: 'apple-music',
            id: action.song.appleMusic.playbackStoreId,
          };

      return { key: 'playing', songId, song: compatibilitySong(action.song) };
    case 'pause':
      // Mutation - pause
      if (serviceKey !== 'spotify') {
        // In spotify caused conflict with player state changed evt
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
      // Mutation - Seek
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
    case 'playerStateChanged':
      // Real state change from source
      // todo song id is weird anyway
      return {
        key: action.playbackState.mode,
        songId: action.playbackState.song.songId,
        song: compatibilitySong(action.playbackState.song),
        progress: {
          lastElapsedMs: action.playbackState.playbackPosition,
          totalMs: action.playbackState.playbackDuration,
          lastUpdateMs: new Date().getTime(),
        },
      };
    default:
      throw new Error('Unhandled playback action');
  }
};

export const PlaybackContextProvider = ({ children }) => {
  const streamingService = useStreamingService();

  const [playbackState, dispatch] = React.useReducer(
    playbackReducerByService(streamingService.service.uniqueKey),
    initialState,
  );

  const playback = React.useMemo(
    () => ({
      playbackState,
      dispatch,
    }),
    [playbackState, dispatch],
  );

  // TODO factorization
  React.useEffect(() => {
    const playerStateChangedListener = (spotifyPlaybackState) => {
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
    return () =>
      remote.removeListener('playerStateChanged', playerStateChangedListener);
  }, []);

  return (
    <PlaybackContext.Provider value={playback}>
      {children}
    </PlaybackContext.Provider>
  );
};
