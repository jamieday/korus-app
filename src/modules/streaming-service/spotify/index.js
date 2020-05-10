/* eslint-disable no-bitwise */
/* eslint-disable import/prefer-default-export */
import { auth, remote, ApiScope } from 'react-native-spotify-remote';
import { API_HOST } from 'react-native-dotenv';

export const apiConfig = {
  clientID: '478eb84f217c4dd79145a565bffd07ee',
  redirectURL: `chorusapp://spotify-login-callback`,
  tokenRefreshURL: `${API_HOST}/spotify/refresh`,
  tokenSwapURL: `${API_HOST}/spotify/swap`,
  scope:
    ApiScope.PlaylistReadPrivateScope |
    ApiScope.PlaylistReadCollaborativeScope |
    ApiScope.PlaylistModifyPublicScope |
    ApiScope.PlaylistModifyPrivateScope |
    ApiScope.UserFollowReadScope |
    ApiScope.UserFollowModifyScope |
    ApiScope.UserLibraryReadScope |
    ApiScope.UserLibraryModifyScope |
    // ApiScope.UserReadBirthDateScope |
    ApiScope.UserReadEmailScope |
    ApiScope.UserReadPrivateScope |
    ApiScope.UserTopReadScope |
    ApiScope.UGCImageUploadScope |
    ApiScope.StreamingScope |
    ApiScope.AppRemoteControlScope |
    ApiScope.UserReadPlaybackStateScope |
    ApiScope.UserModifyPlaybackStateScope |
    ApiScope.UserReadCurrentlyPlayingScope |
    ApiScope.UserReadRecentlyPlayedScope,
};

export const uniqueKey = 'spotify';
// Duplicated in backend {3BBDE216-6A94-4007-8E93-453070E5A77B}
export const header = 'X-Spotify-Access-Token';

const log = (msg) => console.debug(`[Spotify] ${msg}`);

export const authenticate = async () => {
  try {
    const session = await auth.getSession();
    if (session) {
      log('Already initialized.');
      return [session.accessToken, undefined];
    }
    log('Initializing...');
    const token = await auth.initialize(apiConfig);
    log('Initialized.');
    return [token, undefined];
  } catch (e) {
    console.error(e);
    return [
      undefined,
      "We weren't able to connect to Spotify. Not sure who's fault it is. Ours? Theirs? Yours? Anyway can you try again?",
    ];
  }
};

export const connect = async (playUri) => {
  try {
    if (await remote.isConnectedAsync()) {
      log('Already connected.');
      return [(await auth.getSession()).accessToken, undefined];
    }
    log('Ending session...');
    await auth.endSession(); // for some reason need this
    log('Initializing...');
    const token = await auth.initialize({ ...apiConfig, playURI: playUri });
    await remote.connect(token);
    log('Connected.');
    return [token, undefined];
  } catch (e) {
    if (__DEV__) {
      console.error(e.message);
      return [undefined, e.message];
    }
    return [
      undefined,
      "We weren't able to connect to Spotify. Not sure who's fault it is. Ours? Theirs? Yours? Anyway can you try again?",
    ];
  }
};

export * from './player';
