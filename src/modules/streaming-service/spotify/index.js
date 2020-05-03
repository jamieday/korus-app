/* eslint-disable no-bitwise */
/* eslint-disable import/prefer-default-export */
import { Linking } from 'react-native';
import { auth, remote, ApiScope } from 'react-native-spotify-remote';
// import { getHost } from '../../api/getHost';

// const host = getHost();

const spotifyConfig = {
  clientID: '478eb84f217c4dd79145a565bffd07ee',
  redirectURL: `chorusapp://spotify/redirect`,
  // tokenRefreshURL: `${host}/spotify/refresh`,
  // tokenSwapURL: `${host}/spotify/swap`,
  showDialog: true,
  scope:
    ApiScope.AppRemoteControlScope |
    ApiScope.UserFollowReadScope |
    ApiScope.PlaylistModifyPublicScope |
    ApiScope.UserLibraryReadScope |
    ApiScope.UserReadBirthDateScope |
    ApiScope.UserTopReadScope |
    ApiScope.StreamingScope |
    ApiScope.UserReadPlaybackStateScope |
    ApiScope.UserModifyPlaybackStateScope |
    ApiScope.UserReadCurrentlyPlayingScope |
    ApiScope.UserReadRecentlyPlayedScope,
};

export const uniqueKey = 'spotify';
export const header = 'X-Spotify-User-Token';

export const requestToken = async () => {
  try {
    console.log('Initializing...');
    const token = await auth.initialize(spotifyConfig);
    Linking.addEventListener('url', (url) => {
      console.error(url);
    });
    console.log('Connecting...');
    await remote.connect(token);
    console.log('Playing a track...');
    await remote.playUri('spotify:track:6IA8E2Q5ttcpbuahIejO74');
    return [undefined, `We have a token: ${token}`];
    // return [token, undefined];
  } catch (e) {
    return [
      undefined,
      "We weren't able to connect to Spotify. Not sure who's fault that is. Can you try again?",
    ];
  }
};
