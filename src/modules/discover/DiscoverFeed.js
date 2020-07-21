import React from 'react';
import { ActivityIndicator, FlatList, Text, View, Button } from 'react-native';
import { SharedSong } from './SharedSong';
import { colors } from '../../styles';

export const DiscoverFeed = ({
  onRefresh,
  isRefreshing,
  listRef,
  onEndReached,
  isEndReached,
  isVeryEndReached,
  shares,
  onUnshare,
  navigation,
  onFinishedTheGame,
}) => {
  const keyExtractor = (item) => item.id;

  const ITEM_HEIGHT = 350;

  const renderItem = React.useCallback(
    ({ item }) => (
      <SharedSong
        key={keyExtractor(item)}
        height={ITEM_HEIGHT}
        song={item}
        didUnshare={onUnshare}
        navigation={navigation}
      />
    ),
    [ITEM_HEIGHT, navigation],
  );

  return (
    <FlatList
      ref={listRef}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      showsVerticalScrollIndicator={false}
      initialNumToRender={5}
      ListFooterComponent={() =>
        isEndReached ? (
          <ActivityIndicator style={{ marginTop: 15, marginBottom: 40 }} />
        ) : (
          isVeryEndReached && (
            <View style={{ marginBottom: 30 }}>
              <Text style={{ color: colors.white, textAlign: 'center' }}>
                You're all done! You beat KORUS 😊.
              </Text>
              <Button
                title="Take me to Instagram."
                onPress={() => {
                  alert('That was a joke. haha!');
                  onFinishedTheGame();
                }}
              />
            </View>
          )
        )
      }
      keyExtractor={keyExtractor}
      style={{
        backgroundColor: colors.lightBlack,
        padding: 15,
      }}
      data={shares}
      renderItem={renderItem}
    />
  );
};
