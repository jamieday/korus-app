import { auth, ApiScope } from 'react-native-spotify-remote';
import { StreamingService } from '../types';

export const apiConfig = {
  clientID: '478eb84f217c4dd79145a565bffd07ee',
  redirectURL: 'korus://spotify-login-callback',
  tokenRefreshURL: `${process.env.EXPO_PUBLIC_API_HOST}/spotify/refresh`,
  tokenSwapURL: `${process.env.EXPO_PUBLIC_API_HOST}/spotify/swap`,
  scopes: [
    ApiScope.PlaylistReadPrivateScope,
    ApiScope.PlaylistReadCollaborativeScope,
    ApiScope.PlaylistModifyPublicScope,
    ApiScope.PlaylistModifyPrivateScope,
    ApiScope.UserFollowReadScope,
    ApiScope.UserFollowModifyScope,
    ApiScope.UserLibraryReadScope,
    ApiScope.UserLibraryModifyScope,
    ApiScope.UserReadEmailScope,
    ApiScope.UserReadPrivateScope,
    ApiScope.UserTopReadScope,
    ApiScope.UGCImageUploadScope,
    ApiScope.StreamingScope,
    ApiScope.AppRemoteControlScope,
    ApiScope.UserReadPlaybackStateScope,
    ApiScope.UserModifyPlaybackStateScope,
    ApiScope.UserReadCurrentlyPlayingScope,
    ApiScope.UserReadRecentlyPlayedScope,
  ],
};

export const uniqueKey = 'spotify';
export const header = 'X-Spotify-Access-Token';

export const authenticate = async (): Promise<[string | undefined, any]> => {
  try {
    const session = await auth.authorize(apiConfig);
    return [session.accessToken, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

export const connect = async (
  playUri: string,
): Promise<[string | undefined, any]> => {
  try {
    const session = await auth.authorize(apiConfig);
    return [session.accessToken, undefined];
  } catch (error) {
    return [undefined, error];
  }
};

const SpotifyService: StreamingService = {
  uniqueKey,
  header,
  authenticate,
  connect,
};

export default SpotifyService;
