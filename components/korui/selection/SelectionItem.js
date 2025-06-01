import { View, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { Image } from '../image/Image';
import { colors } from '../../styles';

export const SelectionItem = ({
  actionIcon,
  imageUrl,
  onSelect,
  subtitle,
  title,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onSelect();
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
      }}
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
      {actionIcon}
    </TouchableOpacity>
  );
};
