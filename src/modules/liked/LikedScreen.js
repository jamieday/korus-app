/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { List } from 'immutable';
import { colors } from '../../styles';
import PlayIcon from '../../../assets/images/icons/play.svg';
import PauseIcon from '../../../assets/images/icons/pause.svg';
import { useApi } from '../api';
import { ErrorView } from '../error/ErrorView';
import { SelectionList } from '../../korui/selection/SelectionList';
import { usePlayer } from '../streaming-service/usePlayer';

export const LikedScreen = () => {
  const api = useApi();

  const player = usePlayer();

  const [likedSongs, setLikedSongs] = React.useState('LOADING');

  const loadLikedSongs = async () => {
    const [likedSongsR, errorR] = await api.listLikedSongs();
    if (errorR) {
      setLikedSongs({ error: errorR });
      return;
    }
    setLikedSongs(List(likedSongsR));
  };

  React.useEffect(() => {
    loadLikedSongs();
  }, []);

  if (likedSongs === 'LOADING') {
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

  if (typeof likedSongs.error !== 'undefined') {
    return <ErrorView error={likedSongs.error} refresh={loadLikedSongs} />;
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
