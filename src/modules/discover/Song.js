/* eslint-disable no-shadow */
/* eslint-disable default-case */
/* eslint-disable import/prefer-default-export */
import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ActionSheetIOS,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../styles';

import { DoubleTap } from '../double-tap/DoubleTap';
import { useIdentity } from '../identity';

import PauseIcon from '../../../assets/images/icons/pause.svg';
import PlayIcon from '../../../assets/images/icons/play.svg';

import LovedIcon from '../../../assets/images/icons/loved.svg';
import LoveableIcon from '../../../assets/images/icons/loveable.svg';

import MoreOptions from '../../../assets/images/icons/more-options.svg';

import ProfileIcon from '../../../assets/images/pages/profile.svg';
import { useStreamingService } from '../streaming-service';
import { useApi } from '../api';
import analytics from '@react-native-firebase/analytics';

const log = (message) => {
  console.debug(message);
};

export const Song = ({
  song,
  height,
  style,
  isPlaying,
  onPlay,
  onPause,
  didUnshare,
  navigation,
}) => {
  const api = useApi();
  const { player } = useStreamingService();
  const [loves, setLoves] = React.useState(song.loves);
  React.useEffect(() => setLoves(song.loves), [song.loves]);
  const username = useIdentity().displayName;

  const pauseSong = async () => {
    log('[Song] Pausing song.');
    analytics().logEvent('pause_song', {
      id: song.id,
      name: song.name,
      artist: song.artist,
    });
    if (onPause) onPause();
    await player.pauseSong(song);
  };

  const playSong = async () => {
    log('[Song] Playing song.');
    analytics().logEvent('play_song', {
      id: song.id,
      name: song.name,
      artist: song.artist,
    });
    if (onPlay) onPlay();
    await player.playSong(song);
  };

  const unloveSong = async () => {
    if (loves.indexOf(username) === -1) {
      return;
    }
    analytics().logEvent('unlike_song', song);
    setLoves(loves.filter((lover) => lover !== username));
    await api.post(`/share/${encodeURIComponent(song.shareId)}/unlove`);
  };

  const loveSong = async () => {
    if (loves.indexOf(username) !== -1) {
      return;
    }
    analytics().logEvent('like_song', song);
    setLoves([...new Set([...loves, username]).values()]);
    await api.post(`/share/${encodeURIComponent(song.shareId)}/love`);
  };

  const isLoved = loves.indexOf(username) !== -1;
  const isMine = song.sharer === username;

  return (
    <ImageBackground
      style={[styles.container, style]}
      source={{
        uri: song.artworkUrl,
      }}
      borderRadius={15}
    >
      <DoubleTap doubleTap={loveSong}>
        <LinearGradient
          locations={[0, 0.1, 0.2, 0.3, 0.4, 0.45, 0.55, 0.6, 0.7, 0.8, 0.9, 1]}
          style={[styles.gradientContainer, { height }]}
          colors={[
            '#000000AA',
            '#00000075',
            '#00000050',
            '#00000030',
            '#00000010',
            '#00000000',
            '#00000000',
            '#00000010',
            '#00000030',
            '#00000050',
            '#00000075',
            '#000000AA',
          ]}
        >
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              top: '50%',
              left: '50%',
              zIndex: 1,
            }}
          >
            <View style={{ top: '-50%', left: '-50%' }}>
              {player.canPlay(song) ? (
                (() => {
                  const [isPressing, setIsPressing] = React.useState(false);

                  return (
                    <TouchableOpacity
                      onPressIn={() => {
                        setIsPressing(true);
                      }}
                      onPressOut={() => {
                        setIsPressing(false);
                      }}
                      activeOpacity={1}
                      hitSlop={{ top: 80, right: 80, bottom: 80, left: 80 }}
                      onPress={() => {
                        if (isPlaying) pauseSong();
                        else playSong();
                      }}
                    >
                      {(() => {
                        const ActionIcon = isPlaying ? PauseIcon : PlayIcon;
                        const size = 45;
                        return (
                          <ActionIcon
                            style={{
                              // Box shadow
                              shadowColor: '#000000DD',
                              shadowOffset: {
                                width: 2,
                                height: 4,
                              },
                              shadowOpacity: 1.0,
                            }}
                            width={size}
                            height={size}
                            fill={isPressing ? colors.lightGray : colors.white}
                          />
                        );
                      })()}
                    </TouchableOpacity>
                  );
                })()
              ) : (
                <View
                  style={{
                    backgroundColor: '#000000a0',
                    borderRadius: 5,
                    padding: 5,
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 14,
                      textShadowColor: 'black',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 2,
                    }}
                  >
                    Playback not available
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View
            style={[
              { height },
              {
                padding: 15,
                justifyContent: 'space-between',
              },
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.artistDesc}>{song.artist}</Text>
                <Text
                  numberOfLines={1}
                  style={[styles.songName, { marginBottom: 0 }]}
                >
                  {song.name}
                </Text>
              </View>
              {isMine && (
                <TouchableOpacity
                  style={{ padding: 15 }}
                  hitSlop={{ left: 10, bottom: 20 }}
                  onPress={() => {
                    const options = ['Unshare', 'Cancel'];
                    ActionSheetIOS.showActionSheetWithOptions(
                      {
                        options,
                        cancelButtonIndex: options.indexOf('Cancel'),
                        destructiveButtonIndex: options.indexOf('Unshare'),
                      },
                      (selectedIndex) => {
                        switch (options[selectedIndex]) {
                          case 'Unshare':
                            (async () => {
                              analytics().logEvent('unshare_song', song);
                              const [, error] = await api.post(
                                `/share/${encodeURIComponent(
                                  song.shareId,
                                )}/unshare`,
                              );
                              if (error) {
                                console.error(error);
                              }
                              didUnshare();
                              await pauseSong();
                            })();
                            break;
                          case 'Cancel':
                            break;
                        }
                      },
                    );
                  }}
                >
                  <MoreOptions width={17} height={17} fill={colors.white} />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                  navigation.push('Profile', { username: song.sharer });
                }}
                hitSlop={{ top: 50, right: 50 }}
              >
                <ProfileIcon
                  style={{ marginRight: 5 }}
                  width={25}
                  fill={colors.white}
                />
                <Text style={styles.recommenders}>{song.sharer}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                  if (isLoved) {
                    unloveSong();
                  } else {
                    loveSong();
                  }
                }}
                hitSlop={{ top: 20, left: 20 }}
              >
                {(() => {
                  const LoveStateIcon = isLoved ? LovedIcon : LoveableIcon;
                  return (
                    <LoveStateIcon
                      style={{ marginRight: 5 }}
                      width={15}
                      height={15}
                      fill={colors.white}
                    />
                  );
                })()}
                {loves.length > 0 && (
                  <Text style={styles.recommenders}>{loves.length}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </DoubleTap>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 15,

    // Box shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  gradientContainer: {
    borderRadius: 15,
  },

  songName: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 20,
  },

  recommenders: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  artistDesc: {
    color: colors.lightGray,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  unsupportedAction: {
    marginTop: 15,
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    fontStyle: 'italic',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#6271da',
    opacity: 0.5,
  },
});
