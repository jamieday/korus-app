import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { AppView as ApppView } from './navigation/AppView';
import remoteConfig from '@react-native-firebase/remote-config';
import VersionNumber from 'react-native-version-number';

const isSupported = (minSupportedVersion) => {
  const currentVersion = VersionNumber.appVersion;
  const current = currentVersion.split('.');
  const min = minSupportedVersion.split('.');
  // 1.0.0 > 0.1.2
  const x = (n) => {
    if (n == min.length || n == current.length) {
      return true;
    }
    if (current[n] < min[n]) {
      return false;
    }
    if (current[n] > min[n]) {
      return true;
    }
    return x(n + 1);
  };
  return x(0);
};

export default function AppView() {
  const minSupportedVersion = remoteConfig().getValue('min_supported_version')
    .value;

  useEffect(() => {
    (async () => {
      await remoteConfig().setConfigSettings({
        isDeveloperModeEnabled: __DEV__,
        minimumFetchInterval: 300,
      });
      await remoteConfig().fetchAndActivate();
    })();
  }, []);

  if (!isSupported(minSupportedVersion)) {
    return (
      <View
        style={{
          height: '90%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 35,
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 22,
            color: 'white',
            textAlign: 'center',
            marginBottom: 15,
          }}
        >
          Chorus has new updates!
        </Text>
        <Text style={{ color: 'white', textAlign: 'center', lineHeight: 25 }}>
          To continue the journey, update to the latest version. :)
        </Text>
      </View>
    );
  }

  return <ApppView />;
}
