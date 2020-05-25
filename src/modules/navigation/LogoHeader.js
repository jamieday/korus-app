import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { colors } from '../../styles';
import KorusLogo from '../../../assets/images/logo.svg';

export const LogoHeader = () => (
  <SafeAreaView
    style={{
      backgroundColor: colors.black,
    }}
  >
    <View style={{ height: 47, width: '100%', alignItems: 'center' }}>
      <View style={{ margin: 10 }}>
        <KorusLogo width={119} height={27} fill={colors.white} />
      </View>
    </View>
  </SafeAreaView>
);
