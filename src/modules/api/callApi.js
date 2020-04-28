import axios from 'axios';
import { getUsername } from '../identity/getUsername';
import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';

export const api = (() => {
  const initPromise = (async () => {
    const chorusUserToken = getUsername();
    if (!chorusUserToken) {
      return [
        undefined,
        "Hmm, it seems like you're not logged in. Try restarting the app.",
      ];
    }

    const appleMusicPermission = await appleMusicApi.requestPermission();
    if (appleMusicPermission !== 'ok') {
      return [
        undefined,
        'Please provide access to Apple Music in your settings.',
      ];
    }

    const result = await appleMusicApi.requestUserToken();
    if (result.isError) {
      return [
        undefined,
        "Hmm, we can't access your Apple Music. Do you have an Apple Music subscription?",
      ];
    }
    const appleMusicUserToken = result.result;

    return [{ appleMusicUserToken, chorusUserToken }, undefined];
  })();

  const call = async (endpoint, method, body) => {
    try {
      const [authTokens, errorMessage] = await initPromise;
      if (errorMessage) {
        return [undefined, { message: errorMessage }];
      }
      if (!authTokens) {
        return [
          undefined,
          {
            message:
              "Oops, we're having trouble connecting... or maybe it's you? Jk it's us. Try again.",
          },
        ];
      }

      const host = process.env.API_HOST || 'http://chorus.media';
      const path = `/api${endpoint}`;
      const url = host + path;
      console.log(`${method} ${path}`);
      const response = await axios(url, {
        method,
        headers: {
          ...(method === 'POST' && { 'Content-Type': 'application/json' }),
          // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
          'X-Chorus-User-Token': authTokens.chorusUserToken,
          // Header duplicated in backend {8eeaa95a-ab4f-45ca-a97a-f4767d8f4872}
          'X-Apple-Music-User-Token': authTokens.appleMusicUserToken,
        },
        data: body,
      });
      switch (response.status) {
        case 500:
          throw new Error('500 error for ' + path);

        case 503: // Service Unavailable
          return [
            undefined,
            {
              message:
                "Wow we're popular and our servers are down. Check back in a bit?",
            },
          ];
        case 504:
          return [
            undefined,
            {
              message:
                'Oh... our servers are slow right now. Check back in a bit?',
            },
          ];
      }
      if (response.status != 200) {
        console.log(`Bad status code: ${response.status}`);
      }
      return [await response.data, undefined];
    } catch (e) {
      console.log(e);
      return [
        undefined,
        {
          message:
            "Didn't expect this. Something went wrong, can you check back in a bit?",
        },
      ];
    }
  };

  return () => ({
    get: url => call(url, 'GET'),
    post: (url, body) => call(url, 'POST', body),
  });
})();
