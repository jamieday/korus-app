import React from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import SelectedIcon from '../../../assets/images/icons/selected.svg';
import { colors } from '../../styles';
import Image from 'react-native-fast-image';
import { CircleView } from '../layout/CircleView';
import { SelectionIndicator } from './SelectionIndicator';

export const MultiselectList = ({
  style,
  striped,
  keyExtractor,
  items,
  renderItem,
  onSelect,
  onDeselect,
  ListHeaderComponent,
  ListHeaderComponentStyle,
}) => (
  <FlatList
    style={style}
    keyExtractor={keyExtractor}
    data={items}
    alwaysBounceVertical={false}
    ListHeaderComponent={ListHeaderComponent}
    ListHeaderComponentStyle={ListHeaderComponentStyle}
    renderItem={({ index, item }) => {
      return (
        <TouchableOpacity
          onPress={() => (item.selected ? onDeselect(item) : onSelect(item))}
          activeOpacity={0.85}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor:
              !striped || index % 2 === 0 ? 'unset' : colors.lighterBlack,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>{renderItem({ index, item })}</View>
          <SelectionIndicator isSelected={item.selected} />
        </TouchableOpacity>
      );
    }}
  />
);
