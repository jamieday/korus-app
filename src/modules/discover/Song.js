import React from 'react';

import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { colors, fonts } from '../../styles';

import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { API_HOST } from './DiscoverScreen';
import { DoubleTap } from '../double-tap/DoubleTap';
import { getUsername } from '../identity/getUsername';

import LinearGradient from 'react-native-linear-gradient';
import crashlytics from '@react-native-firebase/crashlytics';
import ProfileIcon from '../../../assets/images/pages/profile.svg';

const log = message => {
  console.log(message);
  crashlytics().log(message);
};

export const Song = ({ song, style, onPlay }) => {
  const [loves, setLoves] = React.useState(song.loves);
  React.useEffect(() => setLoves(song.loves), [song.loves]);
  const username = getUsername();

  const playSong = song => {
    if (typeof song.unsupported['playback'] === 'undefined') {
      log(`Playing song ${song.playbackStoreId}`);
      if (onPlay) onPlay();
      appleMusicApi.playMusic(song.playbackStoreId);
    } else {
      (async () => {
        await crashlytics().setAttribute('song', song);
        log(`Tried to play song ${song.playbackStoreId}`);
      })();
    }
  };

  const addToLibrary = async () => {
    if (song.playbackStoreId === 0 || loves.indexOf(username) != -1) {
      log('Could not love song');
      return;
    }
    const result = await appleMusicApi.requestUserToken();
    if (result.isError) {
      log('Could not get apple music user token');
      // TODO deal with error cases of authorization
      return;
    }
    const userToken = result.result;
    setLoves([...loves, username]);
    log('Loving song...');
    const host = API_HOST();
    await fetch(`${host}/api/song/love`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
        'X-Chorus-User-Token': username,
        // Header duplicated in backend {8eeaa95a-ab4f-45ca-a97a-f4767d8f4872}
        'X-Apple-Music-User-Token': userToken,
      },
      body: JSON.stringify({
        'song-id': song.id,
        'song-playback-store-id': song.playbackStoreId,
        'user-token': userToken,
      }),
    });
  };

  const height = 350;

  return (
    <ImageBackground
      key={song.id}
      style={[styles.container, style]}
      source={{
        uri: song.artworkUrl,
      }}
      borderRadius={15}
    >
      <DoubleTap
        singleTap={() => playSong(song)}
        doubleTap={() => addToLibrary()}
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
              top: '39%',
              left: '40%',
            }}
          >
            {/* {!isPlaying && (
              <Image style={{ width: 75, height: 75 }} source={playIcon} />
            )} */}
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
              <Text style={styles.artistDesc}>{song.artist}</Text>
              <Text
                numberOfLines={1}
                style={[styles.songName, { marginBottom: 0 }]}
              >
                {song.name}
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
                <Text style={styles.recommenders}>{song.sharer}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'white', marginRight: 5 }}>
                  {loves.indexOf(username) !== -1 ? '❤️' : '♡'}
                </Text>
                {/* <LoveIcon
                  style={{ marginRight: 5 }}
                  width={25}
                  fill={colors.white}
                /> */}
                <Text style={styles.recommenders}>{loves.length}</Text>
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
