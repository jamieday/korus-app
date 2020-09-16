import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { PlaybackBar } from './PlaybackBar';
import { NavigationTabBar } from './NavigationTabBar';
import { colors } from '../../../styles';

export const BottomAppBar = ({ descriptors, state, navigation }) => {
  const selectedRoute = state.routes[state.index];

  const focusedOptions = descriptors[selectedRoute.key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.black }}>
      <PlaybackBar />
      <NavigationTabBar
        navigation={navigation}
        state={state}
        descriptors={descriptors}
      />
    </SafeAreaView>
  );
};
