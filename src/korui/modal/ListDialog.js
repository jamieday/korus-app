import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles';
import CloseIcon from '../../../assets/images/icons/close.svg';
import { CircleView } from '../layout/CircleView';

// todo use react-native-modal instead
export const ListDialog = ({ items, renderItem, visible: _ }) => {
  const [visible, setVisible] = useState(true);
  return (
    <Modal animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <SafeAreaView
          style={{
            backgroundColor: colors.darkerGray,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: '100%',
            maxHeight: 300,
          }}
        >
          <View style={{ padding: 20 }}>
            <ScrollView>{items.map(renderItem)}</ScrollView>
            <View style={{ position: 'absolute', top: 20, right: 20 }}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <CircleView fill={colors.gray} size={30}>
                  <CloseIcon
                    fill={colors.lighterBlack}
                    width={10}
                    height={10}
                  />
                </CircleView>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};
