import { useContext } from 'react';
import { appleMusicApi } from '../appleMusicApi';
import { PlaybackContext } from '../../PlaybackContext';

const canPlay = (song) => typeof song.appleMusic !== 'undefined';

export const usePlayer = () => {
  const { dispatch } = useContext(PlaybackContext);

  return {
    supportsTracking: false,
    canPlay,
    seek: (positionMs) => {
      // TODO implement.
    },
    playSong: async (song) => {
      if (!canPlay(song)) {
        console.debug("[Apple Music] Can't play that song.");
        return;
      }
      dispatch({
        type: 'play',
        song,
      });
      console.debug(
        `[Apple Music] Playing playbackStoreID ${song.appleMusic.playbackStoreId}`,
      );
      appleMusicApi.playSong(song.appleMusic.playbackStoreId);
    },
    pauseSong: async () => {
      dispatch({ type: 'pause' });
      appleMusicApi.pauseSong();
    },
  };
};
