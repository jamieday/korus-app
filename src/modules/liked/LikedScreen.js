import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { List } from 'immutable';
import { useQuery, queryCache } from 'react-query';
import { colors } from '../../styles';
import PlayIcon from '../../../assets/images/icons/play.svg';
import PauseIcon from '../../../assets/images/icons/pause.svg';
import { toQuery, useApi } from '../api';
import { ErrorView } from '../error/ErrorView';
import { SelectionList } from '../../korui/selection/SelectionList';
import { usePlayer } from '../streaming-service/usePlayer';

const LIKED_SONGS_QUERY_KEY = 'liked-songs';

export const refreshLikedSongs = () => {
  // one - want to refresh liked songs
  // two - activity
  return queryCache.refetchQueries(LIKED_SONGS_QUERY_KEY);
};

export const LikedScreen = () => {
  const api = useApi();

  const { data: likedSongsArray, error, status, refetch } = useQuery(
    LIKED_SONGS_QUERY_KEY,
    toQuery(api.listLikedSongs),
    {
      retry: false,
      refetchOnWindowFocus: true,
    },
  );
  const likedSongs = List(likedSongsArray);

  const player = usePlayer();

  if (status === 'loading') {
    return (
      <View
        style={{
          backgroundColor: colors.lightBlack,
          height: '100%',
          paddingTop: 15,
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return <ErrorView error={error.message} refresh={refetch} />;
  }

  const isPlaying = (song) => {
    const playbackState = player.state;
    return (
      playbackState.key === 'playing' &&
      playbackState.songId.id ===
        (playbackState.songId.service === 'spotify'
          ? song.spotify?.id
          : playbackState.songId.service === 'apple-music'
          ? song.appleMusic?.playbackStoreId
          : (() => {
              throw new Error(`${playbackState.songId.service} not supported`);
            })())
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.lightBlack,
        height: '100%',
      }}
    >
      <View>
        <SelectionList
          style={{
            paddingHorizontal: 30,
          }}
          keyExtractor={(song) => song.id}
          items={likedSongs.toArray()}
          getItemDetail={(song) => ({
            title: song.songName,
            subtitle: song.artistName,
            imageUrl: song.artworkUrl,
          })}
          actionIcon={(song) =>
            isPlaying(song) ? (
              <PauseIcon width={20} height={20} fill={colors.white} />
            ) : (
              <PlayIcon
                width={20}
                height={20}
                fill={player.canPlay(song) ? colors.white : colors.gray}
              />
            )
          }
          onItemPressed={(song) => {
            if (isPlaying(song)) {
              player.pauseSong(song);
            } else if (player.canPlay(song)) {
              player.playSong(song);
            }
          }}
        />
      </View>
    </View>
  );
};
