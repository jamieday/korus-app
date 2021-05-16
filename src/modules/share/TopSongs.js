import React from 'react';
import { useQuery } from 'react-query';
import { Text, ActivityIndicator } from 'react-native';
import { toQuery, useApi } from '../api';
import { colors } from '../../styles';
import { SelectionList } from '../../korui/selection/SelectionList';
import NextIcon from '../../../assets/images/icons/next.svg';

export const TopSongs = ({ onSelectSong }) => {
  const api = useApi();

  const {
    data: topSongs,
    error,
    status,
  } = useQuery('top-songs', toQuery(api.listTopSongs), { retry: false });

  if (status === 'loading') {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text style={{ color: colors.white }}>{error.message}</Text>;
  }

  return (
    <SelectionList
      keyExtractor={(song) =>
        song.appleMusic?.playbackStoreId ?? song.spotify?.id
      }
      items={topSongs}
      onItemPressed={onSelectSong}
      discrete
      getItemDetail={(song) => ({
        title: song.name,
        subtitle: song.artist,
        imageUrl: song.artworkUrl,
      })}
      actionIcon={<NextIcon width={20} height={20} fill={colors.white} />}
    />
  );
};
