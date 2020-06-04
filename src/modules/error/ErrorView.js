import React from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import Image from 'react-native-fast-image';
import { colors } from '../../styles';

export const ErrorView = ({ error, refresh, isRefreshing = false }) => (
  <View style={{ backgroundColor: colors.lightBlack }}>
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: 20,
      }}
    >
      <Image
        source={require('../../../assets/images/tech-difficulties.jpg')}
        style={{
          marginBottom: 15,
          width: 320,
          height: 150,
        }}
      />
      <Text
        style={{
          textAlign: 'center',
          color: colors.white,
          marginBottom: 15,
        }}
      >
        {typeof error === 'object' ? error.problem : error}
      </Text>
      {typeof error === 'object' && (
        <Button
          onPress={error.solution.action}
          title={error.solution.message}
        />
      )}
      {isRefreshing ? (
        <ActivityIndicator />
      ) : (
        refresh && (
          <Button disabled={isRefreshing} onPress={refresh} title="Refresh" />
        )
      )}
    </View>
  </View>
);
