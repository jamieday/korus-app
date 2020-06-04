import React from 'react';
import { View } from 'react-native';
import { PlaybackBar } from './PlaybackBar';
import { NavigationTabBar } from './NavigationTabBar';

export const BottomAppBar = ({ descriptors, state, navigation }) => {
  const selectedRoute = state.routes[state.index];

  const focusedOptions = descriptors[selectedRoute.key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View>
      <PlaybackBar />
      <NavigationTabBar
        navigation={navigation}
        state={state}
        descriptors={descriptors}
      />
    </View>
  );
};
