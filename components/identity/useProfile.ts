import { useQuery } from '@tanstack/react-query';
import { toQuery, useApi } from '../../api/useApi';

const profileQueryKey = (userId?: string) => ['view-profile', userId ?? 'me'];

export function useProfile(userId?: string) {
  const api = useApi();

  const {
    data: profile,
    error,
    refetch: reloadProfile,
    isLoading,
  } = useQuery({
    queryKey: profileQueryKey(userId),
    queryFn: toQuery(() =>
      api.viewProfile(
        userId ??
          // weird "me" thing {F4355E59-9F78-400B-BA86-5517B5CF2116}
          'me',
      ),
    ),
  });

  return {
    profile,
    error,
    reloadProfile,
    isLoading,
  };
}
