/* eslint-disable default-case */
import axios from 'axios';
import { useContext } from 'react';
import { AuthNContext } from '../auth';
import { useStreamingService } from '../streaming-service';
import { getHost } from './getHost';
import perf from '@react-native-firebase/perf';

export const useAuthN = () => useContext(AuthNContext);

// Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
const userTokenHeader = 'X-Firebase-User-Token';

axios.interceptors.request.use(async (config) => {
  console.debug(`[API] ${config.method.toUpperCase()} ${config.url}`);

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
    console.debug(`[API] Succeeded.`);

    try {
      // Request was successful, e.g. HTTP code 200
      const { httpMetric } = response.config.metadata;

      httpMetric.setHttpResponseCode(response.status);
      httpMetric.setResponseContentType(
        response.headers['content-type'] ?? null,
      );
      await httpMetric.stop();
    } catch (e) {
      // Metrics failed
      console.error(e);
    }

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

      const host = getHost();
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

  return {
    get: (url) => call(url, 'GET'),
    post: (url, body) => call(url, 'POST', body),
  };
};
