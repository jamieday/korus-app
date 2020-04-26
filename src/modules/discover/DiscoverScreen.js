import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../styles';
import auth from '@react-native-firebase/auth';
import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { Song } from './Song';
import { getUsername } from '../identity/getUsername';

export const API_HOSTNAME = (() => {
  let hostname = process.env.API_HOSTNAME;
  if (hostname) {
    hostname = '10.76.1.15:3000';
    console.log(`[API Client] Using development hostname: ${hostname}`);
    return hostname;
  }
  hostname = 'chorus.media';
  console.log(`[API Client] Using default hostname: ${hostname}`);
  return hostname;
})();

const tracksPerPage = 4;

export const DiscoverScreen = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [upToPage, setUpToPage] = React.useState(1);
  const [isRefreshing, setRefreshing] = React.useState(false);
  const [isEndReached, setEndReached] = React.useState(false);
  const [playingSongId, setPlayingSongId] = React.useState(undefined);

  const listRef = React.useRef();
  const scrollToTop = () => {
    listRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  React.useEffect(() => {
    console.log('Discover screen setting up...');
    refresh();
    return () => {
      console.log('TODO cancel refresh here.'); // TODO
      console.log('Discover screen unmounted.');
    };
  }, []);

  React.useEffect(() => {
    if (navigation.state.params?.refresh) {
      refresh();
      scrollToTop();
      navigation.setParams({ refresh: false });
    }
  }, [navigation.state.params?.refresh]);

  const refreshList = async upToPage => {
    console.log('Fetching shares...');
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

    const response = await fetch(
      `http://${API_HOSTNAME}/api/recommendation/list`,
      {
        headers: {
          // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
          'X-Chorus-User-Token': chorusUserToken,
          // Header duplicated in backend {8eeaa95a-ab4f-45ca-a97a-f4767d8f4872}
          'X-Apple-Music-User-Token': appleMusicUserToken,
        },
      },
    );
    const json = await response.json();
    const songs = json.map(song => ({
      id: song.id,
      brand: 'Test',
      name: song.name,
      isLoved: song.isLoved,
      unsupported: song.unsupported,
      artist: song.artist,
      artworkUrl: song.artworkUrl,
      playbackStoreId: song.appleMusic.playbackStoreId,
      sharer: song.recommendedBy.name,
    }));

    console.log(`Fetched ${songs.length} shares.`);

    const appleMusicPermission = await appleMusicApi.requestPermission();
    if (appleMusicPermission !== 'ok') {
      // nope cannot recommend or play music ? what can do ?
      console.error("Wasn't given apple music permission!");
    }
    return songs;
  };

  const refresh = async () => {
    try {
      setRefreshing(true);
      const sleep = sleepMs =>
        new Promise(resolve => setTimeout(resolve, sleepMs));
      // UX: Keep refreshing in the background if the call takes too long
      await Promise.race([
        sleep(500),
        (async () => setData(await refreshList(1)))(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      {(() => {
        const username = getUsername();
        const allowedToLogout = ['Alex'];
        if (allowedToLogout.indexOf(username) === -1) {
          return null;
        }
        return (
          <Button
            onPress={() => auth().signOut()}
            title="Alexander, press this button"
          />
        );
      })()}
      <FlatList
        ref={listRef}
        onRefresh={refresh}
        refreshing={isRefreshing}
        onEndReached={() => {
          setEndReached(true);
          const nextPage = upToPage + 1;
          setUpToPage(nextPage);
          // (async () => {
          // const additionalItems = await refreshList(nextPage);
          // setData([...data, additionalItems]);
          // })();
          setEndReached(false);
        }}
        onEndReachedThreshold={0.95}
        showsVerticalScrollIndicator={false}
        initialNumToRender={tracksPerPage}
        ListFooterComponent={() =>
          isEndReached && <ActivityIndicator animating size="large" />
        }
        keyExtractor={item => item.id}
        style={{
          backgroundColor: colors.lightBlack,
          padding: 15,
        }}
        data={data}
        renderItem={({ item }) => (
          <Song
            key={item.id}
            song={item}
            isPlaying={playingSongId === item.id}
            onPlay={() => setPlayingSongId(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
