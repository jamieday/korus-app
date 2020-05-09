import React from 'react';
import { StreamingServiceContext } from '../../StreamingServiceContext';
import { remote, RepeatMode } from 'react-native-spotify-remote';

export const usePlayer = () => {
  const { connectPlayer } = React.useContext(StreamingServiceContext);

  return {
    playSong: async ({ spotify: { playUri } }) => {
      console.debug(`[Spotify] Playing ${playUri}`);
      if (await remote.isConnectedAsync()) {
        console.debug('[Spotify] Already connected. Playing directly.');
        await remote.setRepeatMode(RepeatMode.Off);
        await remote.playUri(playUri);
        return;
      }
      await connectPlayer(playUri);
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
