import analytics from '@react-native-firebase/analytics';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useApi } from '../api';
import { log } from '../utils/log';

export const useShareApi = (options) => {
  const onSuccess = options?.onSuccess;

  const api = useApi();
  const navigation = useNavigation();
  const [error, setError] = useState(undefined);
  const [status, setStatus] = useState('ready');

  const share = async ({ song, reshareOfShareId, caption, recipients }) => {
    setStatus('loading');
    const [data, apiError] = await api.post(`/share/publish`, {
      recipients,
      reshareOfShareId,
      ...(typeof song.appleMusic !== 'undefined' && {
        'playback-store-id': song.appleMusic.playbackStoreId,
      }),
      ...(typeof song.spotify !== 'undefined' && {
        'spotify-id': song.spotify.id,
      }),
      caption,
    });

    if (apiError) {
      setError(apiError);
      setStatus('error');
      return;
    }

    setStatus('success');

    analytics().logEvent('share_song', song);
    log(`Shared ${song.name} by ${song.artist}.`);

    navigation.navigate('Discover', { refresh: true });

    if (onSuccess) onSuccess();

    return data;
  };

  return { share, status, error };
};
