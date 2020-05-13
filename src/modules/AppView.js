import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { AppView as ApppView } from './navigation/AppView';
import remoteConfig from '@react-native-firebase/remote-config';
import { isSupported } from './version/isSupported';
import VersionNumber from 'react-native-version-number';

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

  if (
    minSupportedVersion &&
    !isSupported(minSupportedVersion, VersionNumber.appVersion)
  ) {
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
