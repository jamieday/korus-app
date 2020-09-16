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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';
import { colors } from '../../styles';
import { SongTitle } from './SongTitle';

import LoveIcon from '../../../assets/images/icons/love.svg';
import { usePlayer } from '../streaming-service/usePlayer';

const log = (message) => {
  console.debug(message);
};

export const MiniShare = ({ style, miniShareData, onSelectSong }) => {
  const height = '100%';

  return (
    <TouchableOpacity onPress={onSelectSong}>
      <ImageBackground
        style={[styles.container, style]}
        source={{
          uri: miniShareData.artworkUrl,
        }}
        borderRadius={15}
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
            style={[
              { height },
              {
                padding: 10,
              },
            ]}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
              }}
            >
              <SongTitle
                style={{ flex: 1 }}
                size="small"
                songName={miniShareData.songName}
                artistName={miniShareData.artistName}
              />
              {/* {isMine && (
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
              )} */}
            </View>
            {miniShareData.totalLikes > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <LoveIcon
                  style={{ marginRight: 3 }}
                  width={10}
                  height={10}
                  fill={colors.white}
                />
                <Text style={styles.recommenders}>
                  {miniShareData.totalLikes}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  recommenders: {
    color: colors.white,
    fontSize: 10,
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
