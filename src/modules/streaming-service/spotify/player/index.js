import React from 'react';
import { remote } from 'react-native-spotify-remote';
import { StreamingServiceContext } from '../../StreamingServiceContext';
import { PlaybackContext } from '../../PlaybackContext';

const canPlay = (song) => typeof song.spotify !== 'undefined';

export const usePlayer = () => {
  const { connectPlayer } = React.useContext(StreamingServiceContext);
  const { playbackState, dispatch } = React.useContext(PlaybackContext);

  return {
    supportsTracking: true,
    playbackState,
    seek: async (positionMs) => {
      dispatch({ type: 'seek', positionMs });
      if (!(await remote.isConnectedAsync())) {
        console.debug('[Spotify] Not connected.');
        await connectPlayer();
      }
      await remote.seek(positionMs);
    },
    canPlay,
    playSong: async (song) => {
      if (!canPlay(song)) {
        console.debug("[Spotify] Can't play that song.");
        return;
      }
      console.debug(`[Spotify] Playing ${song.spotify.playUri}`);
      if (await remote.isConnectedAsync()) {
        console.debug('[Spotify] Already connected.');
        // await remote.setRepeatMode(RepeatMode.Off);
        if (playbackState.song?.spotify?.playUri === song.spotify.playUri) {
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
            playbackState.song?.spotify?.playUri === song.spotify.playUri &&
            playbackState.progress
          ) {
            await remote.seek(playbackState.progress.lastElapsedMs);
          }
          await remote.playUri(song.spotify.playUri);
        }
        return;
      }
      console.debug('[Spotify] Not connected. Connecting & playing.');
      dispatch({
        type: 'play',
        song,
      });
      await connectPlayer(song.spotify.playUri);
      // await remote.setRepeatMode(RepeatMode.Off);
    },
    pauseSong: async () => {
      if (!(await remote.isConnectedAsync())) {
        await connectPlayer();
      }
      dispatch({ type: 'pause' });
      console.debug(`[Spotify] Pausing.`);
      await remote.pause();
    },
  };
};
