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
import analytics from '@react-native-firebase/analytics';
import { colors } from '../../styles';

import { DoubleTap } from '../double-tap/DoubleTap';

import PauseIcon from '../../../assets/images/icons/pause.svg';
import PlayIcon from '../../../assets/images/icons/play.svg';

import MoreOptions from '../../../assets/images/icons/more-options.svg';

import { usePlayer } from '../streaming-service/usePlayer';
import { isSongPlaying } from '../liked/LikedScreen';

const log = (message) => {
  console.debug(message);
};

export const Song = ({
  song,
  height,
  style,
  onDoubleTap,
  description,
  leftAction,
  shareAction,
  rightAction,
  options,
}) => {
  const player = usePlayer();
  const isPlaying = isSongPlaying(song, player.state);

  // ui - should be extracted
  const [isPressingPlayPause, setIsPressingPlayPause] = React.useState(false);

  const pauseSong = async () => {
    log('[Song] Pausing song.');
    analytics().logEvent('pause_song', {
      id: song.songId,
      name: song.name,
      artist: song.artist,
    });
    await player.pauseSong(song);
  };

  const playSong = async () => {
    log('[Song] Playing song.');
    analytics().logEvent('play_song', {
      id: song.songId,
      name: song.name,
      artist: song.artist,
    });
    await player.playSong(song);
  };

  return (
    <ImageBackground
      style={[styles.container, style]}
      source={{
        uri: song.artworkUrl,
      }}
      borderRadius={15}
    >
      <DoubleTap doubleTap={onDoubleTap}>
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
                <TouchableOpacity
                  onPressIn={() => {
                    setIsPressingPlayPause(true);
                  }}
                  onPressOut={() => {
                    setIsPressingPlayPause(false);
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
                        fill={
                          isPressingPlayPause ? colors.lightGray : colors.white
                        }
                      />
                    );
                  })()}
                </TouchableOpacity>
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
              },
            ]}
          >
            <View style={{ flex: 1 }}>
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
                {options && (
                  <TouchableOpacity
                    style={{ padding: 15 }}
                    hitSlop={{ left: 10, bottom: 20 }}
                    onPress={() => {
                      const fullOptions = options.concat({
                        label: 'Cancel',
                        execute: () => {},
                      });
                      const actionOptions = fullOptions.map(
                        (option) => option.label,
                      );
                      ActionSheetIOS.showActionSheetWithOptions(
                        {
                          options: actionOptions,
                          cancelButtonIndex: actionOptions.indexOf('Cancel'),
                          // TODO breaks encapsulation
                          destructiveButtonIndex: actionOptions.indexOf(
                            'Unshare',
                          ),
                        },
                        (selectedIndex) => {
                          const action = fullOptions.filter(
                            (option) =>
                              option.label === actionOptions[selectedIndex],
                          )[0];
                          action.execute();
                        },
                      );
                    }}
                  >
                    <MoreOptions width={17} height={17} fill={colors.white} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexShrink: 1 }}>
                {description && (
                  <View>
                    <Text
                      style={{
                        color: colors.white,
                        // fontWeight: 'bold',
                        marginBottom: 5,
                        fontSize: 14,
                      }}
                      adjustsFontSizeToFit={true}
                      numberOfLines={1}
                    >
                      {description}
                    </Text>
                  </View>
                )}
                {leftAction && (
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      leftAction.execute();
                    }}
                    hitSlop={{ top: 50, right: 50 }}
                  >
                    {leftAction.icon}
                    {leftAction.detail && (
                      <Text style={styles.recommenders}>
                        {leftAction.detail}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ flexDirection: 'row' }}>
                {shareAction && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: 20,
                    }}
                    onPress={() => {
                      shareAction.execute();
                    }}
                    hitSlop={{ top: 20 }}
                  >
                    {shareAction.icon}
                    {shareAction.detail && (
                      <Text style={styles.recommenders}>
                        {shareAction.detail}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                {rightAction && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: 10,
                    }}
                    onPress={() => {
                      rightAction.execute();
                    }}
                    hitSlop={{ top: 20 }}
                  >
                    {rightAction.icon}
                    {rightAction.detail && (
                      <Text style={styles.recommenders}>
                        {rightAction.detail}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
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
