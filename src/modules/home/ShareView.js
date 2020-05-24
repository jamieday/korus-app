/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import analytics from '@react-native-firebase/analytics';
import { colors } from '../../styles';
import { SelectionList } from '../../components/SelectionList';
import { TextInput } from '../../components/TextInput';
import ShareIcon from '../../../assets/images/icons/share.svg';
import { useApi } from '../api';

const log = (msg) => {
  console.debug(msg);
};

export const ShareScreen = ({ navigation }) => {
  const api = useApi();
  const [searchQueryInput, setSearchQueryInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState();
  const [songs, setSongs] = React.useState(undefined);

  const shareSong = async (song) => {
    const [_, error] = await api.post(`/share/publish`, {
      'song-name': song.name,
      'artist-name': song.artist,
      ...(typeof song.appleMusic !== 'undefined' && {
        'playback-store-id': song.appleMusic.playbackStoreId,
      }),
      ...(typeof song.spotify !== 'undefined' && {
        'spotify-id': song.spotify.id,
      }),
    });

    if (error) {
      setError(error);
      return;
    }

    analytics().logEvent('share_song', song);

    log(`Shared ${song.name} by ${song.artist}.`);
    navigation.navigate('Discover', { refresh: true });

    // Clear input
    setSearchQueryInput('');
    setSongs(undefined);
    setError(undefined);
  };

  const search = async (input) => {
    if (!input.trim()) {
      setSongs(undefined);
      return;
    }

    log(`Searching for ${input}...`);

    setLoading(true);
    analytics().logEvent('search_song', { query: input });
    const [songs, error] = await api.get(
      `/song/search?query=${encodeURIComponent(input)}`,
    );

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    log(`Fetched ${songs.length} songs.`);

    setLoading(false);
    setSongs(songs);
    if (songs.length === 0) {
      setError(`We looked everywhere but couldn't find ${input}`);
    } else {
      setError(undefined);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.lightBlack,
        height: '100%',
      }}
    >
      <View>
        <View style={{ margin: 30, marginBottom: 0 }}>
          <TextInput
            error={error}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onChangeText={setSearchQueryInput}
            onSubmitEditing={({ nativeEvent: { text } }) => search(text)}
            value={searchQueryInput}
            placeholder="search by song, album, or artist"
          />
        </View>
        <View>
          {loading ? (
            <View style={{ marginTop: 30 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <SelectionList
              keyExtractor={(song) =>
                song.appleMusic?.playbackStoreId ?? song.spotify?.id
              }
              items={songs ?? []}
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
          )}
        </View>
      </View>
    </View>
  );
};
