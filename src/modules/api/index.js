import axios from 'axios';
import { useContext } from 'react';
import { API_HOST } from '@env';
import perf from '@react-native-firebase/perf';
import analytics from '@react-native-firebase/analytics';
import { useStreamingService } from '../streaming-service/StreamingServiceContext';
import { AuthNContext } from '../auth';

export const useAuthN = () => useContext(AuthNContext);

// Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
const USER_TOKEN_HEADER = 'X-Firebase-User-Token';

// Header duplicated 57A476A2-EF30-4CFD-896E-36CFB1E0A5A1
const API_VERSION_HEADER = 'X-Api-Version';
const API_VERSION = 5;

axios.interceptors.request.use(async (config) => {
  console.debug(`[API] ${config.method.toUpperCase()} ${config.url}`);

  // eslint-disable-next-line no-param-reassign
  config.metadata.startTime = new Date().getTime();

  try {
    const httpMetric = perf().newHttpMetric(
      config.url,
      config.method.toUpperCase(),
    );
    // eslint-disable-next-line no-param-reassign
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
          error.response ? error.response.status : 'timeout'
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
      const host = API_HOST;
      const path = `/api${endpoint}`;
      const url = host + path;
      const response = await axios(url, {
        method,
        timeout: 8000,
        headers: {
          ...(method === 'POST' && { 'Content-Type': 'application/json' }),
          [USER_TOKEN_HEADER]: userToken,
          [API_VERSION_HEADER]: API_VERSION,
          ...(context && {
            [service.header]: context.accessToken,
          }),
        },
        data: body,
        metadata: { userId: user?.uid },
      });
      return [response.data, undefined];
    } catch (e) {
      if (typeof e.response?.data?.message !== 'undefined') {
        return [undefined, e.response.data.message];
      }
      switch (e.response?.status) {
        case 401:
          if (!isRetry) {
            console.debug('Refreshing user token...');
            await refreshToken();
            console.debug('OK. Retrying that request.');
            return call(endpoint, method, body, true);
          }
          return [
            undefined,
            'It seems your session has expired. Try restarting the app and if you continue to experience problems contact support.',
          ];
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
        default:
          return [undefined, 'Having trouble connecting right now.'];
      }
    }
  };

  const get = (url) => call(url, 'GET');
  const post = (url, body) => call(url, 'POST', body);

  const listMyGroups = () => get('/groups/my-groups');
  const createGroup = (createGroupPayload) =>
    post('/groups/create', createGroupPayload);

  const listShares = (scope, olderThan, limit) =>
    get(
      `/share/list?scopeType=${scope.type}${
        scope.id ? `&scopeId=${scope.id}` : ''
      }&limit=${limit}${olderThan ? `&olderThan=${olderThan}` : ''}`,
    );

  const listLikedSongs = () => get('/song/list-liked');
  const listTopSongs = () => get('/song/top-songs/list');

  const listUsers = () => get('/people/users/all');

  const viewProfile = (username) => {
    if (username !== user.displayName) {
      analytics().logEvent('view_profile', { username });
    }
    return get(`/people/user/${encodeURIComponent(username)}/profile`);
  };

  const followUser = (id) => {
    analytics().logEvent('follow_user', { targetUserId: id });
    return post(`/people/user/${encodeURIComponent(id)}/follow`);
  };

  const unfollowUser = (id) => {
    analytics().logEvent('unfollow_user', { targetUserId: id });
    return post(`/people/user/${encodeURIComponent(id)}/unfollow`);
  };

  const getMyActivity = () => {
    return get('/activity/get');
  };

  return {
    get,
    post,

    listShares,

    listMyGroups,
    createGroup,

    listLikedSongs,
    listTopSongs,

    listUsers,

    viewProfile,
    followUser,
    unfollowUser,

    getMyActivity,
  };
};

export const toQuery = (apiMethod) => async () => {
  const [data, error] = await apiMethod();
  if (error) {
    throw new Error(error);
  }
  return data;
};
