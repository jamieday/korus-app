/* eslint-disable default-case */
import axios from 'axios';
import { useContext } from 'react';
import { AuthNContext } from '../auth';
import { useStreamingService } from '../streaming-service';
import { API_HOST } from 'react-native-dotenv';
import perf from '@react-native-firebase/perf';
import analytics from '@react-native-firebase/analytics';

export const useAuthN = () => useContext(AuthNContext);

// Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
const userTokenHeader = 'X-Firebase-User-Token';

axios.interceptors.request.use(async (config) => {
  console.debug(`[API] ${config.method.toUpperCase()} ${config.url}`);

  config.metadata.startTime = new Date().getTime();

  try {
    const httpMetric = perf().newHttpMetric(
      config.url,
      config.method.toUpperCase(),
    );
    config.metadata.httpMetric = httpMetric;

    httpMetric.putAttribute('userId', config.metadata.userId);
    httpMetric.putAttribute('timeout', config.timeout.toString());
    await httpMetric.start();
  } catch (e) {
    // Metrics failed
    console.error(e);
  }

  return config;
});
axios.interceptors.response.use(
  async (response) => {
    const { httpMetric, startTime } = response.config.metadata;
    try {
      httpMetric.setHttpResponseCode(response.status);
      httpMetric.setResponseContentType(
        response.headers['content-type'] ?? null,
      );
      await httpMetric.stop();
    } catch (e) {
      // Metrics failed
      console.error(e);
    }

    console.debug(
      `[API] Succeeded in ${((new Date().getTime() - startTime) / 1000).toFixed(
        3,
      )}s.`,
    );

    return response;
  },
  async (error) => {
    // Request failed, e.g. HTTP code 500
    if (!error.isAxiosError) {
      console.error(error);
    } else {
      console.debug(
        `[API] Failed with ${
          error.response
            ? `${error.response.status} ${error.response.statusText}`
            : 'timeout'
        }`,
      );
    }

    try {
      const { httpMetric } = error.config.metadata;

      httpMetric.setHttpResponseCode(error.response?.status ?? null);
      httpMetric.setResponseContentType(
        error.response?.headers['content-type'] ?? null,
      );
      await httpMetric.stop();
    } catch (e) {
      // Metrics failed
      console.error(e);
    }

    // Ensure failed requests throw after interception
    return Promise.reject(error);
  },
);

export const useApi = () => {
  const { user, userToken, refreshToken } = useAuthN();
  const { service, context } = useStreamingService();

  const call = async (endpoint, method, body, isRetry = false) => {
    try {
      if (!userToken || !service) {
        return [
          undefined,
          'Hmm, I think we messed up. Can you restart the app & try again?',
        ];
      }

      const host = API_HOST;
      const path = `/api${endpoint}`;
      const url = host + path;
      const response = await axios(url, {
        method,
        timeout: 8000,
        headers: {
          ...(method === 'POST' && { 'Content-Type': 'application/json' }),
          [userTokenHeader]: userToken,
          [service.header]: context.accessToken,
        },
        data: body,
        metadata: { userId: user?.uid },
      });
      return [response.data, undefined];
    } catch (e) {
      switch (e.response?.status) {
        case 401:
          if (!isRetry) {
            console.debug('Refreshing user token...');
            await refreshToken();
            console.debug('OK. Retrying that request.');
            return await call(endpoint, method, body, true);
          }
        case 503: // Service Unavailable
          return [
            undefined,
            "Wow we're popular and our servers are down. Check back in a bit?",
          ];
        case 504:
        case undefined:
          return [
            undefined,
            'Oh... our servers are slow right now. Check back in a bit?',
          ];
        default:
          return [
            undefined,
            "Oops, we're having trouble connecting... or maybe it's you? Jk it's us. Maybe try again.",
          ];
      }
    }
  };

  const get = (url) => call(url, 'GET');
  const post = (url, body) => call(url, 'POST', body);

  const viewProfile = (username) => {
    if (username !== user.displayName) {
      analytics().logEvent('view_profile', { username });
    }
    return get(`/people/user/${encodeURIComponent(username)}/profile`);
  };

  const followUser = (username) => {
    analytics().logEvent('follow_user', { username });
    return post(`/people/user/${encodeURIComponent(username)}/follow`);
  };
  const unfollowUser = (username) => {
    analytics().logEvent('unfollow_user', { username });
    return post(`/people/user/${encodeURIComponent(username)}/unfollow`);
  };

  return {
    get,
    post,

    viewProfile,
    followUser,
    unfollowUser,
  };
};
