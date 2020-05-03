/* eslint-disable default-case */
import axios from 'axios';
import { useContext } from 'react';
import { AuthNContext } from '../auth';
import { useStreamingService } from '../streaming-service';
import { getHost } from './getHost';

export const useAuthN = () => useContext(AuthNContext);

export const useApi = () => {
  const { userToken, refreshToken } = useAuthN();
  const streamingService = useStreamingService();

  const call = async (endpoint, method, body, isRetry = false) => {
    try {
      if (!userToken || !streamingService) {
        return [
          undefined,
          'Hmm, I think we messed up. Can you restart the app & try again?',
        ];
      }

      const host = getHost();
      const path = `/api${endpoint}`;
      const url = host + path;
      console.debug(`${method} ${path}`);
      const response = await axios(url, {
        method,
        headers: {
          ...(method === 'POST' && { 'Content-Type': 'application/json' }),
          // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
          'X-Firebase-User-Token': userToken,
          [streamingService.service.header]: streamingService.context.token,
        },
        data: body,
      });
      switch (response.status) {
        case 401:
          if (!isRetry) {
            console.debug('Refreshing user token...');
            await refreshToken();
            console.debug('OK. Retrying that request.');
            return await call(endpoint, method, body, true);
          }
          throw new Error(`${response.status} error for ${path}`);
        case 500:
          throw new Error(`${response.status} error for ${path}`);

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
