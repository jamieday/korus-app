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
import crashlytics from '@react-native-firebase/crashlytics';
import { colors, fonts } from '../../styles';

import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { DoubleTap } from '../double-tap/DoubleTap';
import { useIdentity } from '../identity';

import PauseIcon from '../../../assets/images/icons/pause.svg';
import PlayIcon from '../../../assets/images/icons/play.svg';

import LovedIcon from '../../../assets/images/icons/loved.svg';
import LoveableIcon from '../../../assets/images/icons/loveable.svg';

import MoreOptions from '../../../assets/images/icons/more-options.svg';

import ProfileIcon from '../../../assets/images/pages/profile.svg';
import { useApi } from '../api';

const log = (message) => {
  console.debug(message);
  crashlytics().log(message);
};

export const Song = ({
  song,
  style,
  isPlaying,
  onPlay,
  onPause,
  didUnshare,
}) => {
  const api = useApi();
  const [loves, setLoves] = React.useState(song.loves);
  React.useEffect(() => setLoves(song.loves), [song.loves]);
  const username = useIdentity().displayName;

  const pauseSong = () => {
    log('Pausing song.');
    appleMusicApi.pauseSong();
    if (onPause) onPause();
  };

  const playSong = (song) => {
    if (typeof song.unsupported.playback === 'undefined') {
      log(`Playing song ${song.appleMusic.playbackStoreId}`);
      if (onPlay) onPlay();
      appleMusicApi.playSong(song.appleMusic.playbackStoreId);
    } else {
      (async () => {
        await crashlytics().setAttribute('song', song);
        log(`Tried to play song ${song.appleMusic.playbackStoreId}`);
      })();
    }
  };

  const unloveSong = async () => {
    if (loves.indexOf(username) === -1) {
      return;
    }
    setLoves(loves.filter((lover) => lover !== username));
    await api.post(`/share/${encodeURIComponent(song.shareId)}/unlove`);
  };

  const loveSong = async () => {
    if (loves.indexOf(username) !== -1) {
      return;
    }
    setLoves([...new Set([...loves, username]).values()]);
    await api.post(`/share/${encodeURIComponent(song.shareId)}/love`);
  };

  const isLoved = loves.indexOf(username) !== -1;
  const isMine = song.sharer === username;

  const height = 350;

  return (
    <ImageBackground
      style={[styles.container, style]}
      source={{
        uri: song.artworkUrl,
      }}
      borderRadius={15}
    >
      <DoubleTap
        singleTap={() => (isPlaying ? pauseSong() : playSong(song))}
        doubleTap={loveSong}
      >
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
              width: '100%',
              height: '100%',
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
                  fill={colors.white}
                />
              );
            })()}
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
                              const [, error] = await api.post(
                                `/share/${encodeURIComponent(
                                  song.shareId,
                                )}/unshare`,
                              );
                              if (error) {
                                console.error(error);
                              }
                              pauseSong();
                              didUnshare();
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ProfileIcon
                  style={{ marginRight: 5 }}
                  width={25}
                  fill={colors.white}
                />
                <Text style={styles.recommenders}>{song.sharer}</Text>
              </View>
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
    fontFamily: fonts.primaryBold,
    fontSize: 20,
  },

  recommenders: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 14,
  },
  artistDesc: {
    color: colors.lightGray,
    fontFamily: fonts.primaryRegular,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  unsupportedAction: {
    marginTop: 15,
    color: colors.white,
    fontFamily: fonts.primaryBold,
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
