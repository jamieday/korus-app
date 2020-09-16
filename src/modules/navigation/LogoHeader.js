import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles';
import KorusLogo from '../../../assets/images/logo.svg';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

const topMargin = getStatusBarHeight();

export const LogoHeader = () => (
  <View
    style={{
      paddingTop: topMargin,
      backgroundColor: colors.black,
    }}
  >
    <View style={{ height: 47, width: '100%', alignItems: 'center' }}>
      <View style={{ margin: 10 }}>
        <KorusLogo width={119} height={27} fill={colors.white} />
      </View>
    </View>
  </View>
);
