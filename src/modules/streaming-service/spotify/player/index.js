/* eslint-disable import/prefer-default-export */
import React from 'react';
import { remote } from 'react-native-spotify-remote';
import { StreamingServiceContext } from '../../StreamingServiceContext';
import { PlaybackContext } from '../../PlaybackContext';

const canPlay = (song) => typeof song.spotify !== 'undefined';

export const usePlayer = () => {
  const { connectPlayer } = React.useContext(StreamingServiceContext);
  const { playbackState, dispatch } = React.useContext(PlaybackContext);

  return {
    playbackState,
    canPlay,
    playSong: async (song) => {
      if (!canPlay(song)) {
        console.debug("[Spotify] Can't play that song.");
        return;
      }
      dispatch({
        type: 'play',
        songId: { service: 'spotify', id: song.spotify.id },
      });
      console.debug(`[Spotify] Playing ${song.spotify.playUri}`);
      if (await remote.isConnectedAsync()) {
        console.debug('[Spotify] Already connected. Playing directly.');
        // await remote.setRepeatMode(RepeatMode.Off);
        await remote.playUri(song.spotify.playUri);
        return;
      }
      console.debug('[Spotify] Not connected. Connecting & playing.');
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
