/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { View } from 'react-native';

import crashlytics from '@react-native-firebase/crashlytics';
import { colors } from '../../styles';
import { TextInput } from '../../components';
import { SelectionList } from '../../components/SelectionList';
import ShareIcon from '../../../assets/images/icons/share.svg';
import { useApi } from '../api';

const log = (msg) => {
  crashlytics().log(msg);
  console.debug(msg);
};

export const ShareScreen = ({ navigation }) => {
  const api = useApi();
  const [searchQueryInput, setSearchQueryInput] = React.useState('');
  const [songs, setSongs] = React.useState([]);

  const shareSong = async (song) => {
    await api.post(`/share/publish`, {
      'song-name': song.name,
      'artist-name': song.artist,
      'playback-store-id': song.playbackStoreId,
    });

    log(`Shared ${song.name} by ${song.artist}.`);
    navigation.navigate('Discover', { refresh: true });

    // Clear input
    setSearchQueryInput('');
    setSongs([]);
  };

  const searchAppleMusic = async (input) => {
    if (!input.trim()) {
      setSongs([]);
      return;
    }

    log(`Searching for ${input}...`);

    const [songs] = await api.get(
      `/song/search?query=${encodeURIComponent(input)}`,
    );

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
            keyExtractor={(song) => song.playbackStoreId}
            items={songs}
            onItemPressed={shareSong}
            getItemDetail={(song) => ({
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
