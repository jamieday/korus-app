/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { appleMusicApi } from './appleMusicApi';

export const uniqueKey = 'apple-music';
// Header duplicated in backend {5998EFBB-47E5-4CE5-AB47-FA36DF822201}
export const header = 'X-Apple-Music-User-Token';

export const playSong = async (song) => {
  console.debug(
    `[Apple Music] Playing with playbackStoreId ${song.appleMusic.playbackStoreId}`,
  );
  await appleMusicApi.playSong(song.appleMusic.playbackStoreId);
};

export const authenticate = async () => {
  const appleMusicPermission = await appleMusicApi.requestPermission();
  if (appleMusicPermission !== 'ok') {
    return [
      undefined,
      {
        problem: "To connect, we'll need access to your Apple Music.",
        solution: { message: 'Grant access', action: Linking.openSettings },
      },
    ];
  }
  const result = await appleMusicApi.requestUserToken();
  if (result.isError) {
    return [
      undefined,
      "Hmm, we can't access your Apple Music. Do you have an Apple Music subscription?",
    ];
  }
  return [result.result, undefined];
};
