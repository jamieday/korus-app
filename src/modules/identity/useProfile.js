import React from 'react';
import { toQuery, useApi } from '../api';
import { queryCache, useQuery } from 'react-query';

export const optimisticFollow = (targetUserId) => {
  queryCache.setQueryData(profileQueryKey(targetUserId), (profile) => ({
    ...profile,
    isFollowing: true,
  }));
  queryCache.setQueryData(profileQueryKey(), (profile) => ({
    ...profile,
    totalFollowing: profile.totalFollowing + 1,
  }));
};

export const optimisticUnfollow = (targetUserId) => {
  console.log(profileQueryKey(targetUserId));
  queryCache.setQueryData(profileQueryKey(targetUserId), (profile) => ({
    ...profile,
    isFollowing: false,
  }));
  queryCache.setQueryData(profileQueryKey(), (profile) => ({
    ...profile,
    totalFollowing: profile.totalFollowing - 1,
  }));
};

const profileQueryKey = (userId) => ['view-profile', userId ?? 'me'];

export const useProfile = (userId) => {
  const api = useApi();

  const {
    data: profile,
    error,
    refetch: reloadProfile,
    isLoading,
  } = useQuery(
    profileQueryKey(userId),
    toQuery(() =>
      api.viewProfile(
        userId ??
          // weird "me" thing {F4355E59-9F78-400B-BA86-5517B5CF2116}
          'me',
      ),
    ),
  );

  return {
    profile,
    error,
    reloadProfile,
    isLoading,
  };
};
