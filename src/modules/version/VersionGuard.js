/* eslint-disable import/prefer-default-export */
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';
import VersionNumber from 'react-native-version-number';
import { isSupported } from './isSupported';

export const VersionGuard = ({ children }) => {
  const minSupportedVersion = remoteConfig()
    .getValue('min_supported_version')
    .asString();

  useEffect(() => {
    (async () => {
      await remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis: 300,
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
          Korus has new updates!
        </Text>
        <Text style={{ color: 'white', textAlign: 'center', lineHeight: 25 }}>
          To continue the journey, update to the latest version. :)
        </Text>
      </View>
    );
  }

  return children;
};
