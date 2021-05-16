import React from 'react';

import analytics from '@react-native-firebase/analytics';
import { NavigationContainer } from '@react-navigation/native';

// Gets the current screen from navigation state
const getActiveRouteName = (state) => {
  if (!state) {
    return 'None';
  }

  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

export const NavigationProvider = ({ children }) => {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  React.useEffect(() => {
    const state = navigationRef.current.getRootState();

    // Save the initial route name
    routeNameRef.current = getActiveRouteName(state);
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state) => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = getActiveRouteName(state);

        if (previousRouteName !== currentRouteName) {
          analytics().logScreenView({screen_name:currentRouteName, screen_class:currentRouteName});
        }

        // Save the current route name for later comparision
        routeNameRef.current = currentRouteName;
      }}
    >
      {children}
    </NavigationContainer>
  );
};
