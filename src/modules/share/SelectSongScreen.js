import React, { useState } from 'react';
import analytics from '@react-native-firebase/analytics';
import { ActivityIndicator, View } from 'react-native';
import { SectionHeader } from '../../korui/SectionHeader';
import { useApi } from '../api';
import { log } from '../utils/log';
import { colors } from '../../styles';
import { TextInput } from '../../korui/TextInput';
import { SelectionList } from '../../korui/selection/SelectionList';
import NextIcon from '../../../assets/images/icons/next.svg';
import { TopSongs } from './TopSongs';
import { MyPlaylists } from './MyPlaylists';

export const SelectSongScreen = ({ navigation }) => {
  const api = useApi();
  const [isNavigating, setIsNavigating] = useState(false);

  React.useEffect(
    () =>
      navigation.addListener('focus', () => {
        setIsNavigating(false);
      }),
    [navigation],
  );

  const selectSong = async (song) => {
    if (isNavigating) {
      return;
    }
    setIsNavigating(true);
    navigation.navigate('Share a song', { song });
  };

  const [searchQueryInput, setSearchQueryInput] = React.useState('');
  const [isSearchLoading, setSearchLoading] = React.useState(false);
  const [searchError, setSearchError] = React.useState(undefined);

  const [searchResults, setSearchResults] = React.useState(undefined);

  const search = async (input) => {
    if (!input.trim()) {
      setSearchResults(undefined);
      return;
    }

    log(`Searching for ${input}...`);

    setSearchLoading(true);
    analytics().logEvent('search_song', { query: input });
    const [songs, apiError] = await api.get(
      `/song/search?query=${encodeURIComponent(input)}`,
    );

    if (apiError) {
      setSearchError(apiError);
      setSearchLoading(false);
      return;
    }

    log(`Fetched ${songs.length} songs.`);

    setSearchLoading(false);
    setSearchResults(songs);
    if (songs.length === 0) {
      setSearchError(`We looked everywhere but couldn't find ${input}`);
    } else {
      setSearchError(undefined);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      <View
        style={{
          marginHorizontal: 30,
        }}
      >
        <View>
          <View style={{ marginVertical: 20 }}>
            <TextInput
              error={searchError}
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
            {isSearchLoading ? (
              <View style={{ marginTop: 30 }}>
                <ActivityIndicator />
              </View>
            ) : searchResults && searchResults.length > 0 ? (
              <SelectionList
                keyExtractor={(song) =>
                  song.appleMusic?.playbackStoreId ?? song.spotify?.id
                }
                items={searchResults}
                onItemPressed={(song) => {
                  selectSong(song);
                }}
                getItemDetail={(song) => ({
                  title: song.name,
                  subtitle: song.artist,
                  imageUrl: song.artworkUrl,
                })}
                actionIcon={
                  <NextIcon width={20} height={20} fill={colors.white} />
                }
              />
            ) : (
              <View>
                <View>
                  <SectionHeader>Your Top Songs</SectionHeader>
                  <TopSongs
                    onSelectSong={(song) => {
                      selectSong(song);
                    }}
                  />
                </View>
                <View style={{ marginVertical: 5 }} />
                <View>
                  <SectionHeader>
                    Your Playlists, Albums, Songs, etc
                  </SectionHeader>
                  <MyPlaylists />
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
