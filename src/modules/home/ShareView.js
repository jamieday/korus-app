import React from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';

import { fonts, colors } from '../../styles';
import { TextInput } from '../../components';
import { Text } from '../../components/StyledText';
import ShareIcon from '../../../assets/images/icons/share.svg';
import { API_HOSTNAME } from '../discover/DiscoverScreen';

import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { getUsername } from '../identity/getUsername';
import crashlytics from '@react-native-firebase/crashlytics';

const log = msg => {
  crashlytics().log(msg);
  console.log(msg);
};

export const ShareScreen = ({ navigation }) => {
  const [searchQueryInput, setSearchQueryInput] = React.useState('');
  const [songs, setSongs] = React.useState([]);

  const shareSong = async song => {
    const username = await getUsername();
    if (!username) {
      return;
    }
    await fetch(`http://${API_HOSTNAME}`, {
      headers: {
        'Content-Type': 'application/json',

        // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
        'X-Chorus-User-Token': username,
      },
      body: JSON.stringify({
        'song-name': song.name,
        'artist-name': song.artist,
        'playback-store-id': song.playbackStoreId,
      }),
      method: 'POST',
    });
    log(`Shared ${song.name} by ${song.artist}.`);
    navigation.navigate('Discover', { refresh: true });

    // Clear input
    setSearchQueryInput('');
    setSongs([]);
  };

  const searchAppleMusic = async input => {
    if (!input.trim()) {
      setSongs([]);
      return;
    }
    const appleMusicPermission = await appleMusicApi.requestPermission();
    if (appleMusicPermission !== 'ok') {
      // TODO
      // nope cannot recommend or play music ? what can do ?
      log("Wasn't given apple music permission!");
    }
    const result = await appleMusicApi.requestUserToken();
    if (result.isError) {
      // TODO deal with error cases of authorization
      return;
    }
    const appleMusicUserToken = result.result;

    const chorusUserToken = await getUsername();
    if (!chorusUserToken) {
      return;
    }

    log(`Searching for ${input}...`);

    const response = await fetch(
      `http://${API_HOSTNAME}/api/songs/search?query=${encodeURIComponent(
        input,
      )}`,
      {
        headers: {
          // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
          'X-Chorus-User-Token': chorusUserToken,
          // Header duplicated in backend {8eeaa95a-ab4f-45ca-a97a-f4767d8f4872}
          'X-Apple-Music-User-Token': appleMusicUserToken,
        },
      },
    );
    const songs = await response.json();
    if (!songs) {
      log("Couldn't find any songs.");
      return;
    }
    log(`Fetched ${songs.length} songs.`);

    setSongs(songs);
  };

  return (
    <View
      style={{
        backgroundColor: colors.black,
        height: '100%',
      }}
    >
      <View style={styles.container}>
        <View style={[styles.section, { marginTop: 30 }]}>
          <TextInput
            autoCapitalize="none"
            returnKeyType="search"
            onChangeText={setSearchQueryInput}
            onSubmitEditing={({ nativeEvent: { text } }) =>
              searchAppleMusic(text)
            }
            value={searchQueryInput}
            placeholder="search by song, album, or artist"
          />
        </View>
        <View style={[styles.section, { width: '100%' }]}>
          <FlatList
            keyExtractor={song => song.playbackStoreId}
            style={{
              padding: 15,
            }}
            data={songs}
            renderItem={({ item: song }) => (
              <TouchableOpacity
                onPress={() => shareSong(song)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}
                key={song.playbackStoreId}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ color: colors.white }} numberOfLines={1}>
                    {song.name}
                  </Text>
                  <Text style={{ color: colors.gray }} numberOfLines={1}>
                    {song.artist}
                  </Text>
                </View>
                <ShareIcon width={20} height={20} fill={colors.white} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
  },
  bgImage: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sectionLarge: {
    flex: 2,
    justifyContent: 'space-around',
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sharerContainer: {
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
  sharer: {
    marginBottom: 5,
  },
  sharerLink: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
});
