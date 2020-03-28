import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { colors, fonts } from '../../styles';

import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { API_HOSTNAME } from '../discover/DiscoverView';
import { DoubleTap } from '../../modules/double-tap/DoubleTap';
import { getUsername } from '../identity/getUsername';

const profileImgSize = 55;

export const Recommendation = ({ item, style }) => {
  const [isLoved, setLoved] = React.useState(item.isLoved);
  const addToLibrary = async () => {
    const username = await getUsername();
    if (!username) {
      return;
    }
    const result = await appleMusicApi.requestUserToken();
    if (result.isError) {
      // TODO deal with error cases of authorization
      return;
    }
    const userToken = result.result;
    setLoved(true);
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
        <DoubleTap doubleTap={() => !isLoved && addToLibrary()}>
          <Image
            style={{ opacity: isLoved ? 1 : 0.66, height: 350 }}
            source={{
              uri: item.artworkUrl,
            }}
            resizeMode={'contain'}
          />
        </DoubleTap>
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
          {(() => {
            const OperationButton = ({
              onPress,
              label,
              disabled,
              disabledLabel,
            }) => (
              <View>
                <TouchableOpacity disabled={disabled} onPress={onPress}>
                  <Text
                    style={[
                      styles.callToAction,
                      ...[disabled && { color: '#ffffff65' }],
                    ]}
                  >
                    {(disabled && disabledLabel
                      ? disabledLabel
                      : label
                    ).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            );
            return (
              <React.Fragment>
                <OperationButton
                  disabled={typeof item.unsupported['playback'] !== 'undefined'}
                  disabledLabel={item.unsupported['playback']}
                  onPress={() => appleMusicApi.playMusic(item.playbackStoreId)}
                  label="Play"
                />
                <OperationButton
                  disabled={item.playbackStoreId === 0 || isLoved}
                  onPress={addToLibrary}
                  label={isLoved ? '❤️' : '♡'}
                />
              </React.Fragment>
            );
          })()}
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginBottom: 100,
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
