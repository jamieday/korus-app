import React from 'react';
// import { remote } from 'react-native-spotify-remote';
import { StreamingServiceContext } from '../../StreamingServiceContext';
import { PlaybackContext } from '../../PlaybackContext';
import { PlaybackState } from '../../types';

const canPlay = (song: PlaybackState['song']) =>
  typeof song?.spotify !== 'undefined';

export const usePlayer = () => {
  const context = React.useContext(StreamingServiceContext);
  const { playbackState, dispatch } = React.useContext(PlaybackContext);

  return {
    supportsTracking: true,
    playbackState,
    seek: async (positionMs: number) => {
      dispatch({ type: 'seek', positionMs });
      if (!(await remote.isConnectedAsync())) {
        console.debug('[Spotify] Not connected.');
        if (context?.connectPlayer && playbackState.song?.spotify?.playUri) {
          await context.connectPlayer(playbackState.song.spotify.playUri);
        }
      }
      await remote.seek(positionMs);
    },
    canPlay,
    playSong: async (song: PlaybackState['song']) => {
      if (!canPlay(song)) {
        console.debug("[Spotify] Can't play that song.");
        return;
      }
      console.debug(`[Spotify] Playing ${song?.spotify?.playUri}`);
      if (await remote.isConnectedAsync()) {
        console.debug('[Spotify] Already connected.');
        if (playbackState.song?.spotify?.playUri === song?.spotify?.playUri) {
          console.debug('[Spotify] Song already playing. Resuming!');
          dispatch({
            type: 'resume',
          });
          if (playbackState.progress) {
            await remote.seek(playbackState.progress.lastElapsedMs);
          }
          await remote.resume();
        } else {
          console.debug('[Spotify] Playing.');
          dispatch({
            type: 'play',
            song,
          });
          if (
            playbackState.song?.spotify?.playUri === song?.spotify?.playUri &&
            playbackState.progress
          ) {
            await remote.seek(playbackState.progress.lastElapsedMs);
          }
          if (song?.spotify?.playUri) {
            await remote.playUri(song.spotify.playUri);
          }
        }
        return;
      }
      console.debug('[Spotify] Not connected. Connecting & playing.');
      dispatch({
        type: 'play',
        song,
      });
      if (song?.spotify?.playUri && context?.connectPlayer) {
        await context.connectPlayer(song.spotify.playUri);
      }
    },
    pauseSong: async () => {
      if (!(await remote.isConnectedAsync())) {
        if (context?.connectPlayer && playbackState.song?.spotify?.playUri) {
          await context.connectPlayer(playbackState.song.spotify.playUri);
        }
      }
      dispatch({ type: 'pause' });
      console.debug(`[Spotify] Pausing.`);
      await remote.pause();
    },
  };
};
