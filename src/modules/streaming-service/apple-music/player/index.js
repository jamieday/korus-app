import { appleMusicApi } from '../../../../react-native-apple-music/io/appleMusicApi';

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
