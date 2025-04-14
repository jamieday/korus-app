import { useContext } from 'react';

import axios from 'axios';

import { AuthNContext } from '@/modules/auth/auth';
import { useStreamingService } from '@/modules/streaming-service/StreamingServiceContext';

import Profile from './Profile';
import Share from './Share';

export const useAuthN = () => useContext(AuthNContext);

// Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
const USER_TOKEN_HEADER = 'X-Firebase-User-Token';

// Header duplicated 57A476A2-EF30-4CFD-896E-36CFB1E0A5A1
const API_VERSION_HEADER = 'X-Api-Version';
const API_VERSION = 5;

export const useApi = () => {
  const { user, userToken, refreshToken } = useAuthN();
  const { type, service, context } = useStreamingService();

  const call = async <T>(
    endpoint: string,
    method: string,
    body: any = undefined,
    isRetry = false,
  ): Promise<[T | undefined, string | undefined]> => {
    try {
      const host = process.env.EXPO_PUBLIC_API_HOST;
      const path = `/api${endpoint}`;
      const url = host + path;
      console.debug(`[${method}] ${url}`);
      const response = await axios(url, {
        method,
        timeout: 8000,
        headers: {
          ...(method === 'POST' && { 'Content-Type': 'application/json' }),
          [USER_TOKEN_HEADER]: userToken,
          [API_VERSION_HEADER]: API_VERSION,
          ...(type === 'connected' && {
            [service.header]: context.accessToken,
          }),
        },
        data: body,
        // metadata: { userId: user?.uid },
      });
      return [response.data, undefined];
    } catch (e: any) {
      if (typeof e.response?.data?.message !== 'undefined') {
        console.error('API Error:', e.response.data.message);
        return [undefined, e.response.data.message];
      }
      if (e.response?.status) {
        console.error('HTTP Error:', e.response?.status);
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

  const get = <T>(url: string) => call<T>(url, 'GET', undefined);
  const post = <T>(url: string, body: any = undefined) =>
    call<T>(url, 'POST', body);

  const getGroupSummary = (groupId: string) =>
    get(`/groups/group/${encodeURIComponent(groupId)}/summary`);
  const listMyGroups = () => get('/groups/my-groups');
  const createGroup = (createGroupPayload: any) =>
    post('/groups/create', createGroupPayload);

  const listShares = (
    scope: any,
    olderThan: any,
    limit: number | undefined = undefined,
  ) =>
    get<Share[]>(
      `/share/list?scopeType=${scope.type}${
        scope.id ? `&scopeId=${scope.id}` : ''
      }${limit ? `&limit=${limit}` : ''}${olderThan ? `&olderThan=${olderThan}` : ''}`,
    );

  const listLikedSongs = (userId: string) =>
    get(`/song/${encodeURIComponent(userId)}/list-liked`);
  const listTopSongs = () => get('/song/top-songs/list');

  const updateProfile = (profileData: any) =>
    post('/people/user/me/profile-update', profileData);

  const updateCoverPhoto = (coverPhotoUri: string) =>
    post('/people/user/me/cover-photo-update', { coverPhotoUri });

  const listUsers = () => get('/people/users/all');

  const viewProfile = (id: string) => {
    // analytics().logEvent('view_profile', { id });
    return get<Profile>(`/people/user/${encodeURIComponent(id)}/profile`);
  };

  const followUser = (id: string) => {
    // analytics().logEvent('follow_user', { targetUserId: id });
    return post(`/people/user/${encodeURIComponent(id)}/follow`);
  };

  const unfollowUser = (id: string) => {
    // analytics().logEvent('unfollow_user', { targetUserId: id });
    return post(`/people/user/${encodeURIComponent(id)}/unfollow`);
  };

  const getMyActivity = () => {
    return get('/activity/get');
  };

  return {
    get,
    post,

    listShares,

    getGroupSummary,
    listMyGroups,
    createGroup,

    listLikedSongs,
    listTopSongs,

    listUsers,

    updateProfile,
    updateCoverPhoto,
    viewProfile,
    followUser,
    unfollowUser,

    getMyActivity,
  };
};

export const toQuery =
  <T>(apiMethod: () => Promise<[T | undefined, string | undefined]>) =>
  async () => {
    const [data, error] = await apiMethod();
    if (error) {
      throw new Error(error);
    }
    return data;
  };
