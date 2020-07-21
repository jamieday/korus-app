import { auth, remote, ApiScope } from 'react-native-spotify-remote';
import { API_HOST } from '@env';

export const apiConfig = {
  clientID: '478eb84f217c4dd79145a565bffd07ee',
  redirectURL: `korusapp://spotify-login-callback`,
  tokenRefreshURL: `${API_HOST}/spotify/refresh`,
  tokenSwapURL: `${API_HOST}/spotify/swap`,
  scopes: [
    ApiScope.PlaylistReadPrivateScope,
    ApiScope.PlaylistReadCollaborativeScope,
    ApiScope.PlaylistModifyPublicScope,
    ApiScope.PlaylistModifyPrivateScope,
    ApiScope.UserFollowReadScope,
    ApiScope.UserFollowModifyScope,
    ApiScope.UserLibraryReadScope,
    ApiScope.UserLibraryModifyScope,
    // ApiScope.UserReadBirthDateScope,
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
// Duplicated in backend {3BBDE216-6A94-4007-8E93-453070E5A77B}
export const header = 'X-Spotify-Access-Token';

const log = (msg) => console.debug(`[Spotify] ${msg}`);

export const authenticate = async () => {
  return connect(undefined);
  // try {
  //   const session = await auth.getSession();
  //   if (session) {
  //     log('Already initialized.');
  //     return [session.accessToken, undefined];
  //   }
  //   log('Initializing...');
  //   const { accessToken } = await auth.authorize(apiConfig);
  //   log('Initialized.');
  //   return [accessToken, undefined];
  // } catch (e) {
  //   console.error(e);
  //   return [undefined, "We weren't able to connect to Spotify. :("];
  // }
};

export const connect = async (playUri) => {
  try {
    if (await remote.isConnectedAsync()) {
      log('Already connected.');
      return [(await auth.getSession()).accessToken, undefined];
    }
    log('Ending session...');
    await auth.endSession(); // for some reason need this
    log('Authorizing...');
    const { accessToken } = await auth.authorize({
      ...apiConfig,
      playURI: playUri,
    });
    log('Authorized. Connecting...');
    await remote.connect(accessToken);
    log('Connected.');
    return [accessToken, undefined];
  } catch (e) {
    // eslint-disable-next-line no-undef
    if (__DEV__) {
      return [undefined, `Dev-only message: ${e.message}`];
    }
    return [undefined, "We weren't able to connect to Spotify. :("];
  }
};
