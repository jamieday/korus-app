import React from 'react';

import analytics from '@react-native-firebase/analytics';
import { colors } from '../../styles';

import { useIdentity } from '../identity';

import LovedIcon from '../../../assets/images/icons/loved.svg';
import LoveableIcon from '../../../assets/images/icons/loveable.svg';
import ReshareIcon from '../../../assets/images/icons/reshare.svg';

import ProfileIcon from '../../../assets/images/pages/profile.svg';
import { useApi } from '../api';
import { formatCount } from '../profile/formatCount';
import { Song } from '../song/Song';
import { usePlayer } from '../streaming-service/usePlayer';
import { isSongPlaying, refreshLikedSongs } from '../liked/LikedScreen';

const SHARED_SONG_HEIGHT = 350;

export const SharedSong = ({ share, style, didUnshare, navigation }) => {
  const api = useApi();
  const player = usePlayer();
  const [totalLikes, setTotalLikes] = React.useState(share.totalLikes);
  const [isLiked, setIsLiked] = React.useState(share.isLiked);
  React.useEffect(() => setTotalLikes(share.totalLikes), [share.totalLikes]);
  React.useEffect(() => setIsLiked(share.isLiked), [share.isLiked]);

  const myUsername = useIdentity().displayName;
  const isPlaying = isSongPlaying(share, player.state);

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
      height={SHARED_SONG_HEIGHT}
      onDoubleTap={likeShare}
      description={share.caption}
      leftAction={{
        execute: () => {
          if (isMine) {
            navigation.navigate('MyProfile');
          } else {
            navigation.navigate('Profile', {
              id: share.sharerId,
            });
          }
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
      shareAction={
        isMine
          ? undefined
          : {
              execute: () => {
                navigation.navigate('Share a song', {
                  song: share,
                  reshareOf: share,
                });
              },
              icon: (
                <ReshareIcon
                  style={{ paddingHorizontal: 20 }}
                  width={15}
                  height={15}
                  fill={colors.white}
                />
              ),
            }
      }
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
