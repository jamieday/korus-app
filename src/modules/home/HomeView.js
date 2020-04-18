import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

import { fonts, colors } from '../../styles';
import { Button, RadioGroup } from '../../components';
import { Text } from '../../components/StyledText';

import { API_HOSTNAME } from '../discover/DiscoverView';

import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { getUsername } from '../identity/getUsername';

export default function HomeScreen({}) {
  const [flashText, setFlashText] = React.useState();

  return (
    <View
      style={{
        backgroundColor: colors.black,
        height: '100%',
      }}
    >
      <View style={styles.container}>
        <View style={[styles.section, { marginTop: 30 }]}></View>
        <View style={[styles.section]}>
          <Button
            style={[{ height: 75 }]}
            bgColor={'#333'}
            rounded
            caption="Share a song"
            onPress={() => {
              (async () => {
                const username = await getUsername();
                if (!username) {
                  return;
                }
                const song = await appleMusicApi.selectSong();
                await fetch(`http://${API_HOSTNAME}`, {
                  headers: {
                    'Content-Type': 'application/json',

                    // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
                    'X-Chorus-User-Token': username,
                  },
                  body: JSON.stringify({
                    'song-name': song.title,
                    'artist-name': song.artist,
                    'playback-store-id': song.playbackStoreId,
                  }),
                  method: 'POST',
                });
                setFlashText(
                  `You recommended ${song.title} by ${song.artist}.`,
                );
                setTimeout(() => setFlashText(undefined), 3000);
              })();
            }}
          />
          {flashText && (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 10,
                color: '#52dd52',
              }}
            >
              {flashText}
            </Text>
          )}
        </View>
        <View style={[styles.section, styles.sectionLarge]}>
          <Text color="#19e7f700" hCenter size={15} style={styles.description}>
            {' '}
            This is a temporary page that will be removed at some point! :)
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 15,
  },
  bgImage: {
    flex: 1,
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLarge: {
    flex: 2,
    justifyContent: 'space-around',
  },
  sectionHeader: {
    marginBottom: 8,
  },
  priceContainer: {
    alignItems: 'center',
  },
  description: {
    padding: 15,
    lineHeight: 25,
  },
  titleDescription: {
    color: '#19e7f7',
    textAlign: 'center',
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
  },
  title: {
    textAlign: 'center',
  },
  price: {
    marginBottom: 5,
  },
  priceLink: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
});
