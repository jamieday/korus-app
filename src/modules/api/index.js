/* eslint-disable default-case */
import axios from 'axios';
import { useContext } from 'react';
import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { AuthNContext, AppleMusicContext } from '../auth';

export const useAuthN = () => useContext(AuthNContext);

export const useApi = () => {
  const { userToken } = useAuthN();
  const appleMusicUserToken = useContext(AppleMusicContext);

  const call = async (endpoint, method, body) => {
    try {
      if (!userToken) {
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
      if (!appleMusicUserToken) {
        return [
          undefined,
          "Hmm, we can't access your Apple Music. Do you have an Apple Music subscription?",
        ];
      }

      const host = process.env.API_HOST || 'http://chorus.media';
      const path = `/api${endpoint}`;
      const url = host + path;
      console.debug(`${method} ${path}`);
      const response = await axios(url, {
        method,
        headers: {
          ...(method === 'POST' && { 'Content-Type': 'application/json' }),
          // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
          'X-Firebase-User-Token': userToken,
          // Header duplicated in backend {8eeaa95a-ab4f-45ca-a97a-f4767d8f4872}
          'X-Apple-Music-User-Token': appleMusicUserToken,
        },
        data: body,
      });
      switch (response.status) {
        case 500:
          throw new Error(`500 error for ${path}`);

        case 503: // Service Unavailable
          return [
            undefined,
            "Wow we're popular and our servers are down. Check back in a bit?",
          ];
        case 504:
          return [
            undefined,
            'Oh... our servers are slow right now. Check back in a bit?',
          ];
      }
      if (response.status !== 200) {
        console.debug(`Bad status code: ${response.status}`);
      } else {
        console.debug('Done.');
      }
      return [response.data, undefined];
    } catch (e) {
      console.debug(e);
      return [
        undefined,
        "Oops, we're having trouble connecting... or maybe it's you? Jk it's us. Maybe try again.",
      ];
    }
  };

  return {
    get: (url) => call(url, 'GET'),
    post: (url, body) => call(url, 'POST', body),
  };
};
