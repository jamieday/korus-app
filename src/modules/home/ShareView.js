/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { colors } from '../../styles';
import { TextInput } from '../../components';
import { SelectionList } from '../../components/SelectionList';
import ShareIcon from '../../../assets/images/icons/share.svg';
import { useApi } from '../api';
import analytics from '@react-native-firebase/analytics';

const log = (msg) => {
  console.debug(msg);
};

export const ShareScreen = ({ navigation }) => {
  const api = useApi();
  const [searchQueryInput, setSearchQueryInput] = React.useState('');
  const [lastSearch, setLastSearch] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [songs, setSongs] = React.useState(undefined);

  const shareSong = async (song) => {
    analytics().logEvent('share_song', song);
    await api.post(`/share/publish`, {
      'song-name': song.name,
      'artist-name': song.artist,
      ...(song.playbackStoreId && {
        'playback-store-id': song.playbackStoreId,
      }),
      ...(typeof song.spotify !== 'undefined' && {
        'spotify-id': song.spotify.id,
      }),
    });

    log(`Shared ${song.name} by ${song.artist}.`);
    navigation.navigate('Discover', { refresh: true });

    // Clear input
    setSearchQueryInput('');
    setSongs(undefined);
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
      //TODO
      setLoading(false);
      setSongs([]);
      setLastSearch(undefined);
      log(error);
      return;
    }

    log(`Fetched ${songs.length} songs.`);

    setLoading(false);
    setSongs(songs);
    setLastSearch(input);
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
            autoCorrect={false}
            returnKeyType="search"
            onChangeText={setSearchQueryInput}
            onSubmitEditing={({ nativeEvent: { text } }) => search(text)}
            value={searchQueryInput}
            placeholder="search by song, album, or artist"
          />
        </View>
        <View>
          {songs !== undefined &&
            (loading ? (
              <View style={{ marginTop: 30 }}>
                <ActivityIndicator />
              </View>
            ) : songs?.length === 0 ? (
              lastSearch && (
                <View style={{ marginTop: 30 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: 'center',
                      color: colors.white,
                      fontStyle: 'italic',
                    }}
                  >
                    Yea, so we tried but couldn't find anything remotely like '
                    {lastSearch}'...
                  </Text>
                </View>
              )
            ) : (
              <SelectionList
                keyExtractor={(song) =>
                  song.playbackStoreId ?? song.spotify?.id
                }
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
            ))}
        </View>
      </View>
    </View>
  );
};
