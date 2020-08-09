import React from 'react';

import analytics from '@react-native-firebase/analytics';
import { colors } from '../../styles';

import { useIdentity } from '../identity';

import LovedIcon from '../../../assets/images/icons/loved.svg';
import LoveableIcon from '../../../assets/images/icons/loveable.svg';

import ProfileIcon from '../../../assets/images/pages/profile.svg';
import { useApi } from '../api';
import { formatCount } from '../profile/formatCount';
import { Song } from '../song/Song';
import { usePlayer } from '../streaming-service/usePlayer';
import { refreshLikedSongs } from '../liked/LikedScreen';

export const SharedSong = ({
  song: share,
  height,
  style,
  didUnshare,
  navigation,
}) => {
  const api = useApi();
  const player = usePlayer();
  const [totalLikes, setTotalLikes] = React.useState(share.totalLikes);
  const [isLiked, setIsLiked] = React.useState(share.isLiked);
  React.useEffect(() => setTotalLikes(share.totalLikes), [share.totalLikes]);
  React.useEffect(() => setIsLiked(share.isLiked), [share.isLiked]);

  const myUsername = useIdentity().displayName;

  // This is most certainly an anti-pattern
  // See 242A1CC6-851F-45F7-8EE9-C3973349C5ED
  const isPlaying =
    player.state.key === 'playing' &&
    player.state.songId.id ===
      (player.state.songId.service === 'spotify'
        ? share.spotify?.id
        : player.state.songId.service === 'apple-music'
        ? share.appleMusic?.playbackStoreId
        : (() => {
            throw new Error(`${player.state.songId.service} not supported`);
          })());

  const unlikeShare = async () => {
    if (!isLiked) {
      return;
    }
    analytics().logEvent('unlike_share', share);
    setTotalLikes(totalLikes - 1);
    setIsLiked(false);
    await api.post(`/share/${encodeURIComponent(share.id)}/unlike`);
    await refreshLikedSongs(); // this could be a cache mutation
  };

  const likeShare = async () => {
    if (isLiked) {
      return;
    }
    analytics().logEvent('like_share', share);
    setTotalLikes(totalLikes + 1);
    setIsLiked(true);
    await api.post(`/share/${encodeURIComponent(share.id)}/like`);
    await refreshLikedSongs(); // this could be a cache mutation
  };

  const isMine = share.sharer === myUsername;

  return (
    <Song
      style={style}
      song={share}
      height={height}
      onDoubleTap={likeShare}
      description={share.caption}
      leftAction={{
        execute: () => {
          navigation.navigate('Profile', {
            id: share.sharerId,
          });
        },
        icon: (
          <ProfileIcon
            style={{ marginRight: 5 }}
            width={20}
            fill={colors.white}
          />
        ),
        detail: share.sharer,
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
                    analytics().logEvent('unshare_song', share);
                    const [, error] = await api.post(
                      `/share/${encodeURIComponent(share.id)}/unshare`,
                    );
                    if (error) {
                      console.error(error);
                    }
                    didUnshare();
                    if (isPlaying) await player.pauseSong(share);
                  })();
                },
              },
            ]
          : undefined
      }
    />
  );
};
