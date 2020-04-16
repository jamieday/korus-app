import React from 'react';

import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { colors, fonts } from '../../styles';

import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { API_HOSTNAME } from '../discover/DiscoverView';
import { DoubleTap } from '../../modules/double-tap/DoubleTap';
import { getUsername } from '../identity/getUsername';

import LinearGradient from 'react-native-linear-gradient';
import crashlytics from '@react-native-firebase/crashlytics';
import ProfileIcon from '../../../assets/images/pages/profile.svg';
import LoveIcon from '../../../assets/images/icons/love.svg';

const playIcon = require('../../../assets/images/icons/play.png');
const pauseIcon = require('../../../assets/images/icons/pause.png');

const log = message => {
  console.log(message);
  crashlytics().log(message);
};

export const Recommendation = ({ item, style, isPlaying, onPlay }) => {
  const [isLoved, setLoved] = React.useState(item.isLoved);

  const playSong = item => {
    if (typeof item.unsupported['playback'] === 'undefined') {
      log(`Playing song ${item.playbackStoreId}`);
      if (onPlay) onPlay();
      appleMusicApi.playMusic(item.playbackStoreId);
    } else {
      (async () => {
        await crashlytics().setAttribute('song', item);
        log(`Tried to play song ${item.playbackStoreId}`);
      })();
    }
  };

  const addToLibrary = async () => {
    if (item.playbackStoreId === 0 || isLoved) {
      log('Could not love song');
      return;
    }
    const username = await getUsername();
    if (!username) {
      log('Could not resolve user');
      return;
    }
    const result = await appleMusicApi.requestUserToken();
    if (result.isError) {
      log('Could not get apple music user token');
      // TODO deal with error cases of authorization
      return;
    }
    const userToken = result.result;
    setLoved(true);
    log('Loving song...');
    await fetch(`http://${API_HOSTNAME}/api/song/love`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
        'X-Chorus-User-Token': username,
        // Header duplicated in backend {8eeaa95a-ab4f-45ca-a97a-f4767d8f4872}
        'X-Apple-Music-User-Token': userToken,
      },
      body: JSON.stringify({
        'song-id': item.id,
        'song-playback-store-id': item.playbackStoreId,
        'user-token': userToken,
      }),
    });
  };

  const height = 350;

  return (
    <ImageBackground
      key={item.id}
      style={[styles.container, style]}
      source={{
        uri: item.artworkUrl,
      }}
      borderRadius={15}
    >
      <DoubleTap
        singleTap={() => playSong(item)}
        doubleTap={() => !isLoved && addToLibrary()}
      >
        <LinearGradient
          locations={[0, 0.25, 0.72, 1]}
          style={[styles.gradientContainer, { height }]}
          colors={['#000000b4', '#00000000', '#00000000', '#000000b4']}
        >
          <View
            style={{
              position: 'absolute',
              top: '39%',
              left: '40%',
            }}
          >
            {!isPlaying && (
              <Image style={{ width: 75, height: 75 }} source={playIcon} />
            )}
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
            <View>
              <Text style={styles.artistDesc}>{item.subtitle}</Text>
              <Text
                numberOfLines={1}
                style={[styles.songTitle, { marginBottom: 0 }]}
              >
                {item.title}
              </Text>
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
                <Text style={styles.recommenders}>{item.price}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'white', marginRight: 5 }}>
                  {isLoved ? '❤️' : '♡'}
                </Text>
                {/* <LoveIcon
                  style={{ marginRight: 5 }}
                  width={25}
                  fill={colors.white}
                /> */}
                <Text style={styles.recommenders}>{isLoved ? 1 : 0}</Text>
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

  songTitle: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 20,
    marginTop: 5,
  },

  recommenders: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 14,
    marginBottom: 5,
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
