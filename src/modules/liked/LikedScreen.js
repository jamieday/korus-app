/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../../styles';
import PlayIcon from '../../../assets/images/icons/play.svg';
import PauseIcon from '../../../assets/images/icons/pause.svg';
import { useApi } from '../api';
import { ErrorView } from '../error/ErrorView';
import { SelectionList } from '../../components/SelectionList';
import { List } from 'immutable';
import { useStreamingService } from '../streaming-service';

export const LikedScreen = ({ navigation }) => {
  const api = useApi();

  const { player } = useStreamingService();

  const [likedSongs, setLikedSongs] = React.useState('LOADING');
  const [playingSongId, setPlayingSongId] = React.useState();

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

  return (
    <View
      style={{
        backgroundColor: colors.lightBlack,
        height: '100%',
      }}
    >
      <SelectionList
        keyExtractor={(song) => song.id}
        items={likedSongs.toArray()}
        getItemDetail={(song) => ({
          title: song.songName,
          subtitle: song.artistName,
          imageUrl: song.artworkUrl,
        })}
        actionIcon={(song) =>
          song.id === playingSongId ? (
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
          if (song.id === playingSongId) {
            player.pauseSong(song);
            setPlayingSongId(undefined);
          } else {
            if (player.canPlay(song)) {
              player.playSong(song);
              setPlayingSongId(song.id);
            }
          }
        }}
      />
    </View>
  );
};
