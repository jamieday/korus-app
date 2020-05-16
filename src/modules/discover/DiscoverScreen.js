/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../styles';
import { useApi } from '../api';
import messaging from '@react-native-firebase/messaging';
import { ErrorView } from '../error/ErrorView';
import { List } from 'immutable';
import { DiscoverFeed } from './DiscoverFeed';

export const DiscoverScreen = ({ navigation }) => {
  const api = useApi();
  const [shares, setShares] = React.useState(undefined);
  const [isRefreshing, setRefreshing] = React.useState(true);
  const [isLoadingNextPage, setLoadingNextPage] = React.useState(false);
  const [reachedLastPage, setReachedLastPage] = React.useState(false);
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

  const listShares = async (oldestSharedAt = undefined) => {
    console.debug(
      `Fetching${oldestSharedAt ? ` older than ${oldestSharedAt}` : ''}...`,
    );

    const [sharesR, errorR] = await api.get(
      `/discover/feed?limit=${encodeURIComponent(10)}${
        oldestSharedAt ? `&olderThan=${encodeURIComponent(oldestSharedAt)}` : ''
      }  `,
    );

    if (errorR) {
      setError(errorR);
      return undefined;
    }

    if (error) {
      // Error fixed.
      setError(undefined);
    }

    console.debug(`Fetched ${sharesR.length} shares.`);
    return List(sharesR);
  };

  const appendPage = async () => {
    const oldestSharedAt = shares.last().sharedAt;
    const additionalItems = await listShares(oldestSharedAt);
    if (additionalItems.size === 0) {
      setReachedLastPage(true);
      return;
    }
    setShares(shares.concat(additionalItems));
  };

  const refresh = async () => {
    try {
      setRefreshing(true);
      setReachedLastPage(false);
      setShares(await listShares());
    } finally {
      setRefreshing(false);
    }
  };

  if (error) {
    return (
      <ErrorView error={error} refresh={refresh} isRefreshing={isRefreshing} />
    );
  }

  return (
    <View style={styles.container}>
      {shares && !shares.size ? (
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
        <DiscoverFeed
          listRef={listRef}
          shares={shares?.toArray()}
          onRefresh={refresh}
          isRefreshing={isRefreshing}
          onEndReached={() => {
            (async () => {
              if (reachedLastPage || isLoadingNextPage) {
                return;
              }
              try {
                setLoadingNextPage(true);
                await appendPage();
              } finally {
                setLoadingNextPage(false);
              }
            })();
          }}
          isEndReached={isLoadingNextPage}
          isVeryEndReached={reachedLastPage}
          playingSongId={playingSongId}
          setPlayingSongId={setPlayingSongId}
          onUnshare={refresh}
          onFinishedTheGame={() => {
            scrollToTop();
            setTimeout(refresh, 500);
          }}
          navigation={navigation}
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
