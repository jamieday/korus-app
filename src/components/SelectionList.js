import React from 'react';
import { FlatList, View, TouchableOpacity, Text } from 'react-native';
import { colors } from '../styles';

export const SelectionList = ({
  keyExtractor,
  items,
  onItemPressed,
  actionIcon,
  getItemDetail,
}) => (
  <FlatList
    keyExtractor={keyExtractor}
    style={{
      padding: 15,
    }}
    data={items}
    renderItem={({ item }) => {
      const { title, subtitle } = getItemDetail(item);

      return (
        <TouchableOpacity
          onPress={() => onItemPressed(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
          key={keyExtractor(item)}
        >
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
