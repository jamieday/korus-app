/* eslint-disable import/prefer-default-export */
import React from 'react';
import { remote, RepeatMode } from 'react-native-spotify-remote';
import { StreamingServiceContext } from '../../StreamingServiceContext.ts';

export const usePlayer = () => {
  const { connectPlayer } = React.useContext(StreamingServiceContext);

  return {
    canPlay: (song) => typeof song.spotify !== 'undefined',
    playSong: async ({ spotify: { playUri } }) => {
      console.debug(`[Spotify] Playing ${playUri}`);
      if (await remote.isConnectedAsync()) {
        console.debug('[Spotify] Already connected. Playing directly.');
        // await remote.setRepeatMode(RepeatMode.Off);
        await remote.playUri(playUri);
        return;
      }
      console.debug('[Spotify] Not connected. Connecting & playing.');
      await connectPlayer(playUri);
      // await remote.setRepeatMode(RepeatMode.Off);
    },
    pauseSong: async () => {
      if (!(await remote.isConnectedAsync())) {
        await connectPlayer();
      }
      console.debug(`[Spotify] Pausing.`);
      await remote.pause();
    },
  };
};
