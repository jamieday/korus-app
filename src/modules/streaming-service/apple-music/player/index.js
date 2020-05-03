import { appleMusicApi } from '../../../../react-native-apple-music/io/appleMusicApi';

export const usePlayer = () => ({
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
