import React from 'react';

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableHighlight,
} from 'react-native';

import { colors, fonts } from '../../styles';

import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { API_HOSTNAME } from '../discover/DiscoverView';

const profileImgSize = 55;

export const Recommendation = ({ item, style }) => {
  const canPlaySong = item.playbackStoreId != 0;

  const Container = ({ children, style }) => {
    style = [styles.container, style];
    return (
      <View key={item.id} style={style}>
        {children}
      </View>
    );
  };
  return (
    <Container style={style}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Image
            style={{
              width: profileImgSize,
              height: profileImgSize,
              marginRight: 8,

              overflow: 'hidden',
              borderRadius: profileImgSize / 2,
            }}
            source={{
              uri: `http://${API_HOSTNAME}${item.image}`,
            }}
          />
          <Text style={{ flex: 1, color: colors.white }}>
            <Text style={{ fontWeight: 'bold' }}>{item.price}</Text> recommends
          </Text>
        </View>
        <Image
          style={{ height: 350 }}
          source={{
            uri: item.artworkUrl,
          }}
          resizeMode={'contain'}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 15,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.songTitle, { marginBottom: 0 }]}>
              {item.title}
            </Text>
            <Text style={styles.artistDesc}>{item.subtitle}</Text>
          </View>
          <View>
            {canPlaySong ? (
              <TouchableOpacity
                onPress={() => appleMusicApi.playMusic(item.playbackStoreId)}
              >
                <Text style={styles.callToAction}>PLAY</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.unsupportedAction}>
                Playback not supported.
              </Text>
            )}
          </View>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginBottom: '50%',
    // justifyContent: 'center',
  },

  header: {
    flex: 1,
    margin: 6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  songTitle: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 18,
  },
  artistDesc: {
    color: colors.white,
    fontFamily: fonts.primaryRegular,
    fontSize: 14,
    marginVertical: 5,
  },
  callToAction: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 12,
    padding: 15,
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
