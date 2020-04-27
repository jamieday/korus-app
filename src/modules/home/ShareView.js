import React from 'react';
import { StyleSheet, View } from 'react-native';

import { fonts, colors } from '../../styles';
import { TextInput } from '../../components';
import { SelectionList } from '../../components/SelectionList';
import ShareIcon from '../../../assets/images/icons/share.svg';
import { API_HOST } from '../discover/DiscoverScreen';

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
    const username = getUsername();
    if (!username) {
      return;
    }

    const host = API_HOST();
    await fetch(`${host}`, {
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

    const chorusUserToken = getUsername();
    if (!chorusUserToken) {
      return;
    }

    log(`Searching for ${input}...`);

    const host = API_HOST();
    const response = await fetch(
      `${host}/api/songs/search?query=${encodeURIComponent(input)}`,
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
      <View>
        <View style={{ margin: 30, marginBottom: 0 }}>
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
        <View>
          <SelectionList
            keyExtractor={song => song.playbackStoreId}
            items={songs}
            onItemPressed={shareSong}
            getItemDetail={song => ({
              title: song.name,
              subtitle: song.artist,
              imageUrl: song.artworkUrl,
            })}
            actionIcon={
              <ShareIcon width={20} height={20} fill={colors.white} />
            }
          />
        </View>
      </View>
    </View>
  );
};
