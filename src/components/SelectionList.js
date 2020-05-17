import React from 'react';
import { FlatList, View, TouchableOpacity, Text, Image } from 'react-native';
import { colors } from '../styles';

export const SelectionList = ({
  keyExtractor,
  items,
  onItemPressed,
  actionIcon,
  getItemDetail,
  refreshing,
  onRefresh,
}) => (
  <FlatList
    keyExtractor={keyExtractor}
    style={{
      padding: 15,
    }}
    ListFooterComponent={() => <View style={{ marginBottom: 18 }} />}
    refreshing={refreshing}
    onRefresh={onRefresh}
    data={items}
    renderItem={({ item }) => {
      const { title, subtitle, imageUrl = undefined } = getItemDetail(item);

      return (
        <TouchableOpacity
          onPress={() => onItemPressed(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 18,
          }}
          key={keyExtractor(item)}
        >
          {imageUrl && (
            <Image
              style={{
                width: 50,
                height: 50,
                marginRight: 10,
                borderRadius: 10,
              }}
              source={{ uri: imageUrl }}
            />
          )}
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={{ color: colors.white }} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={{ color: colors.gray }} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
          {typeof actionIcon === 'function' ? actionIcon(item) : actionIcon}
        </TouchableOpacity>
      );
    }}
  />
);
