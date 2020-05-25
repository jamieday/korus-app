/* eslint-disable no-shadow */
/* eslint-disable default-case */
/* eslint-disable import/prefer-default-export */
import React from 'react';

import analytics from '@react-native-firebase/analytics';
import { colors } from '../../styles';

import { useIdentity } from '../identity';

import LovedIcon from '../../../assets/images/icons/loved.svg';
import LoveableIcon from '../../../assets/images/icons/loveable.svg';

import ProfileIcon from '../../../assets/images/pages/profile.svg';
import { useStreamingService } from '../streaming-service';
import { useApi } from '../api';
import { formatCount } from '../profile/formatCount';
import { Song } from '../song/Song';

const log = (message) => {
  console.debug(message);
};

export const SharedSong = ({ song, height, style, didUnshare, navigation }) => {
  const api = useApi();
  const { player, playbackState } = useStreamingService();
  const [totalLikes, setTotalLikes] = React.useState(song.totalLikes);
  const [isLiked, setIsLiked] = React.useState(song.isLiked);
  React.useEffect(() => setTotalLikes(song.totalLikes), [song.totalLikes]);
  React.useEffect(() => setIsLiked(song.isLiked), [song.isLiked]);

  const myUsername = useIdentity().displayName;

  // This is most certainly an anti-pattern
  // See 242A1CC6-851F-45F7-8EE9-C3973349C5ED
  const isPlaying =
    playbackState.key === 'playing' &&
    playbackState.songId.id ===
      (playbackState.songId.service === 'spotify'
        ? song.spotify?.id
        : playbackState.songId.service === 'apple-music'
        ? song.appleMusic?.playbackStoreId
        : (() => {
            throw new Error(`${playbackState.songId.service} not supported`);
          })());

  const unlikeShare = async () => {
    if (!isLiked) {
      return;
    }
    analytics().logEvent('unlike_song', song);
    setTotalLikes(totalLikes - 1);
    setIsLiked(false);
    await api.post(`/share/${encodeURIComponent(song.shareId)}/unlike`);
  };

  const likeShare = async () => {
    if (isLiked) {
      return;
    }
    analytics().logEvent('like_song', song);
    setTotalLikes(totalLikes + 1);
    setIsLiked(true);
    await api.post(`/share/${encodeURIComponent(song.shareId)}/like`);
  };

  const isMine = song.sharer === myUsername;

  return (
    <Song
      style={style}
      song={song}
      height={height}
      onDoubleTap={likeShare}
      leftAction={{
        execute: () => {
          navigation.push('Profile', { username: song.sharer });
        },
        icon: (
          <ProfileIcon
            style={{ marginRight: 5 }}
            width={25}
            fill={colors.white}
          />
        ),
        detail: song.sharer,
      }}
      rightAction={{
        execute: () => {
          if (isLiked) {
            unlikeShare();
          } else {
            likeShare();
          }
        },
        icon: (() => {
          const LoveStateIcon = isLiked ? LovedIcon : LoveableIcon;
          return (
            <LoveStateIcon
              style={{ marginRight: 5 }}
              width={15}
              height={15}
              fill={colors.white}
            />
          );
        })(),
        detail: totalLikes > 0 ? formatCount(totalLikes) : undefined,
      }}
      options={
        isMine
          ? [
              {
                label: 'Unshare',
                execute: () => {
                  (async () => {
                    analytics().logEvent('unshare_song', song);
                    const [, error] = await api.post(
                      `/share/${encodeURIComponent(song.shareId)}/unshare`,
                    );
                    if (error) {
                      console.error(error);
                    }
                    didUnshare();
                    if (isPlaying) await player.pauseSong(song);
                  })();
                },
              },
            ]
          : undefined
      }
    />
  );
};
