/* eslint-disable import/prefer-default-export */
import React from 'react';
import { FlatList, View } from 'react-native';
import { SelectionItem } from './SelectionItem';

export const SelectionList = ({
  style,
  keyExtractor,
  items,
  onItemPressed,
  actionIcon,
  discrete,
  getItemDetail,
  refreshing,
  onRefresh,
}) => (
  <FlatList
    style={style}
    keyExtractor={keyExtractor}
    ListFooterComponent={() =>
      !refreshing && !discrete && <View style={{ marginBottom: 18 }} />
    }
    refreshing={refreshing}
    onRefresh={onRefresh}
    data={items}
    alwaysBounceVertical={!discrete}
    renderItem={({ item }) => {
      const { title, subtitle, imageUrl = undefined } = getItemDetail(item);

      return (
        <SelectionItem
          title={title}
          subtitle={subtitle}
          imageUrl={imageUrl}
          onSelect={() => {
            onItemPressed(item);
          }}
          actionIcon={
            typeof actionIcon === 'function' ? actionIcon(item) : actionIcon
          }
        />
      );
    }}
  />
);
