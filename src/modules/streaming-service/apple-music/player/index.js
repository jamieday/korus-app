import { appleMusicApi } from '../appleMusicApi';

// eslint-disable-next-line import/prefer-default-export
export const usePlayer = () => ({
  canPlay: (song) => typeof song.appleMusic !== 'undefined',
  playSong: async (song) => {
    console.debug(
      `[Apple Music] Playing playbackStoreID ${song.appleMusic.playbackStoreId}`,
    );
    appleMusicApi.playSong(song.appleMusic.playbackStoreId);
  },
  pauseSong: async () => {
    appleMusicApi.pauseSong();
  },
});
