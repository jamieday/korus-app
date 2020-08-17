import React, { useCallback, useRef } from 'react';
import {
  Animated,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Button,
} from 'react-native';
import { SharedSong } from './SharedSong';
import { colors } from '../../styles';
import messaging from '@react-native-firebase/messaging';
import { List } from 'immutable';
import { ErrorView } from '../error/ErrorView';
import { useApi } from '../api';

export const SharesFeed = ({
  style,
  scope,
  navigation,
  route,
  onScroll,
  scrollEventThrottle,
  ListHeaderComponent,
}) => {
  const api = useApi();
  const [shares, setShares] = React.useState(List());
  const [isRefreshing, setRefreshing] = React.useState(true);
  const [isLoadingNextPage, setLoadingNextPage] = React.useState(false);
  const [didReachLastPage, setReachedLastPage] = React.useState(false);
  const [error, setError] = React.useState(undefined);

  const listRef = useRef();
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0 });
    }
  };

  const refresh = async () => {
    try {
      setRefreshing(true);
      setReachedLastPage(false);
      setShares(await listShares(undefined));
    } finally {
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    console.debug('Discover screen setting up...');
    refresh();

    messaging().onNotificationOpenedApp((_remoteMessage) => {
      refresh();
    });

    return () => {
      console.debug('TODO cancel refresh here.'); // TODO
      console.debug('Discover screen unmounted.');
    };
  }, []);

  React.useEffect(() => {
    if (route.params?.refresh) {
      refresh();
      scrollToTop();
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

  const listShares = useCallback(
    async (oldestSharedAt = undefined) => {
      console.debug(
        `Fetching${oldestSharedAt ? ` older than ${oldestSharedAt}` : ''}...`,
      );

      const [sharesR, errorR] = await api.listShares(scope, oldestSharedAt, 10);

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
    },
    [scope],
  );

  const appendPage = async () => {
    const oldestSharedAt = shares.last().sharedAt;
    const additionalItems = await listShares(oldestSharedAt);
    if (!additionalItems) {
      return;
    }
    if (additionalItems.size === 0) {
      setReachedLastPage(true);
      return;
    }
    setShares((shares ?? []).concat(additionalItems));
  };

  const keyExtractor = useCallback((item) => item.id, []);

  const ITEM_HEIGHT = 350;

  const renderItem = React.useCallback(
    ({ item }) => (
      <SharedSong
        key={keyExtractor(item)}
        height={ITEM_HEIGHT}
        song={item}
        didUnshare={refresh}
        navigation={navigation}
      />
    ),
    [ITEM_HEIGHT, navigation],
  );

  if (error) {
    return (
      <ErrorView error={error} refresh={refresh} isRefreshing={isRefreshing} />
    );
  }

  if (!isRefreshing && shares.size === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.white, fontSize: 24, marginBottom: 20 }}>
          Huh, nothing here yet.
        </Text>
        <Button
          color={colors.turquoise}
          title={'Get things started'}
          onPress={() => navigation.navigate('Select a song')}
        />
      </View>
    );
  }

  return (
    <Animated.FlatList
      contentContainerStyle={[
        style,
        {
          backgroundColor: colors.lightBlack,
          padding: 15,
        },
      ]}
      ref={listRef}
      onRefresh={refresh}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      refreshing={isRefreshing}
      onEndReached={() => {
        (async () => {
          if (didReachLastPage || isLoadingNextPage) {
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
      onEndReachedThreshold={0.4}
      showsVerticalScrollIndicator={false}
      initialNumToRender={5}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={() =>
        isLoadingNextPage ? (
          <ActivityIndicator style={{ marginTop: 15, marginBottom: 40 }} />
        ) : (
          didReachLastPage &&
          scope.type === 'global' && (
            <View style={{ marginBottom: 30 }}>
              <Text style={{ color: colors.white, textAlign: 'center' }}>
                You're all done! You beat KORUS 😊.
              </Text>
              <Button
                title="Take me to Instagram."
                onPress={() => {
                  alert('That was a joke. haha!');
                  scrollToTop();
                  setTimeout(refresh, 500);
                }}
              />
            </View>
          )
        )
      }
      keyExtractor={keyExtractor}
      data={shares.toArray()}
      renderItem={renderItem}
    />
  );
};
