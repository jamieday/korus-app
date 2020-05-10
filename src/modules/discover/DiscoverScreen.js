/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../styles';
import { Song } from './Song';
import { useApi } from '../api';
import messaging from '@react-native-firebase/messaging';
import { ErrorView } from '../error/ErrorView';

const tracksPerPage = 4;

export const DiscoverScreen = ({ navigation }) => {
  const api = useApi();
  const [data, setData] = React.useState(undefined);
  const [upToPage, setUpToPage] = React.useState(1);
  const [isRefreshing, setRefreshing] = React.useState(true);
  const [isEndReached, setEndReached] = React.useState(false);
  const [playingSongId, setPlayingSongId] = React.useState(undefined);
  const [didPressRefresh, setDidPressRefresh] = React.useState(false);
  const [error, setError] = React.useState(undefined);

  const listRef = React.useRef();
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0 });
    }
  };

  React.useEffect(() => {
    console.debug('Discover screen setting up...');
    refresh();

    if (!__DEV__) {
      messaging().onNotificationOpenedApp((_remoteMessage) => {
        refresh();
      });
    }

    return () => {
      console.debug('TODO cancel refresh here.'); // TODO
      console.debug('Discover screen unmounted.');
    };
  }, []);

  React.useEffect(() => {
    if (navigation.state.params?.refresh) {
      refresh();
      scrollToTop();
      navigation.setParams({ refresh: false });
    }
  }, [navigation.state.params?.refresh]);

  const refreshList = async (_upToPage) => {
    console.debug('Fetching feed...');

    const [songs, error] = await api.get('/discover/feed');

    if (error) {
      setError(error);
      return undefined;
    }
    setError(undefined);

    console.debug(`Fetched ${songs.length} shares.`);
    return songs;
  };

  const refresh = async () => {
    try {
      setRefreshing(true);
      const sleep = (sleepMs) =>
        new Promise((resolve) => setTimeout(resolve, sleepMs));
      // UX: Keep refreshing in the background if the call takes too long
      await Promise.race([
        sleep(500),
        (async () => setData(await refreshList(1)))(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  if (error) {
    return (
      <ErrorView error={error} refresh={refresh} isRefreshing={isRefreshing} />
    );
  }

  const keyExtractor = (item) => item.shareId;

  return (
    <View style={styles.container}>
      {data && !data.length ? (
        <View
          style={{
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: colors.white,
              marginBottom: 20,
              textAlign: 'center',
              padding: 20,
            }}
          >
            Um, this only really works with friends. And as far as we can tell,
            you don&apos;t have any.
          </Text>
          {isRefreshing ? (
            <ActivityIndicator />
          ) : (
            <Button
              onPress={() => {
                if (!didPressRefresh) {
                  refresh();
                  setDidPressRefresh(true);
                } else {
                  navigation.navigate('People');
                  setDidPressRefresh(false);
                }
              }}
              title={
                didPressRefresh ? '(hint: Go find some friends...)' : 'Refresh'
              }
            />
          )}
        </View>
      ) : (
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
          keyExtractor={keyExtractor}
          style={{
            backgroundColor: colors.lightBlack,
            padding: 15,
          }}
          data={data}
          renderItem={({ item }) => (
            <Song
              key={keyExtractor(item)}
              song={item}
              isPlaying={playingSongId === item.id}
              onPlay={() => setPlayingSongId(item.id)}
              onPause={() => setPlayingSongId(undefined)}
              didUnshare={() => refresh()}
              navigation={navigation}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
