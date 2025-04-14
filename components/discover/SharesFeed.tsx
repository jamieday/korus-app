import React, { useCallback, useRef } from 'react';
import { Animated, ActivityIndicator, Text, View, Button } from 'react-native';
import { colors } from '../../styles';
import { List } from 'immutable';
import { useRouter } from 'expo-router';
import { useApi } from '../../api/useApi';
import { useProfile } from '../identity/useProfile';

interface SharesFeedProps {
  style?: any;
  scope: {
    type: 'global' | 'by-user' | 'group',
    id?: string,
  };
  onScroll?: (event: any) => void;
  scrollEventThrottle?: number;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function SharesFeed({
  style,
  scope,
  onScroll,
  scrollEventThrottle,
  ListHeaderComponent,
}: SharesFeedProps) {
  const api = useApi();
  const [shares, setShares] = React.useState<List<any>>(List());
  const { profile } = useProfile();
  const [isRefreshing, setRefreshing] = React.useState(true);
  const [isLoadingNextPage, setLoadingNextPage] = React.useState(false);
  const [didReachLastPage, setReachedLastPage] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const router = useRouter();

  const listRef = useRef<any>();
  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0 });
    }
  };

  const refresh = async (silent?: boolean) => {
    try {
      if (!silent) {
        setRefreshing(true);
      }
      setReachedLastPage(false);
      setShares(await listShares());
    } finally {
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    console.debug('Discover screen setting up...');
    refresh();

    return () => {
      console.debug('Discover screen unmounted.');
    };
  }, []);

  React.useEffect(() => {
    const handle = setInterval(() => {
      if (!isRefreshing && shares.size === 0) {
        refresh(true);
      }
    }, 1500);
    return () => clearInterval(handle);
  }, [shares, isRefreshing]);

  const listShares = useCallback(
    async (oldestSharedAt?: string) => {
      console.debug(
        `Fetching${oldestSharedAt ? ` older than ${oldestSharedAt}` : ''}...`,
      );

      const [shares, error] = await api.listShares(scope, oldestSharedAt);

      if (error) {
        setError(error);
        return List();
      }

      console.debug(`Fetched ${shares?.length ?? 0} shares.`);
      return List(shares);
    },
    [scope, api],
  );

  const appendPage = async () => {
    const oldestSharedAt = shares.last()?.sharedAt;
    const additionalItems = await listShares(oldestSharedAt);
    if (!additionalItems) {
      return;
    }
    if (additionalItems.size === 0) {
      setReachedLastPage(true);
      return;
    }
    setShares(shares.concat(additionalItems));
  };

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => (
      <View
        style={{
          padding: 10,
          backgroundColor: colors.darkGray,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: colors.white }}>{item.caption}</Text>
      </View>
    ),
    [],
  );

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.white, marginBottom: 20 }}>{error}</Text>
        <Button title="Try Again" onPress={() => refresh()} />
      </View>
    );
  }

  if (!isRefreshing && shares.size === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.white, fontSize: 24, marginBottom: 20 }}>
          Huh, nothing here yet.
        </Text>
        <Button
          title="Share a song!"
          onPress={() => router.push('/share/select')}
        />
      </View>
    );
  }

  const renderFooter = () => {
    if (isLoadingNextPage) {
      return <ActivityIndicator style={{ marginTop: 15, marginBottom: 40 }} />;
    }
    if (didReachLastPage && shares.size > 8 && scope.type === 'global') {
      return (
        <View style={{ marginBottom: 30 }}>
          <Text style={{ color: colors.white, textAlign: 'center' }}>
            You're all done! You beat Korus 😊.
          </Text>
          <Button
            title="Take me to Instagram."
            onPress={() => {
              alert('That was a joke. haha!');
              scrollToTop();
              setTimeout(() => refresh(), 500);
            }}
          />
        </View>
      );
    }
    return null;
  };

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
      ListFooterComponent={renderFooter}
      keyExtractor={keyExtractor}
      data={shares.toArray()}
      renderItem={renderItem}
    />
  );
}
