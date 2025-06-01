import React from 'react';
import { Button, View, Text } from 'react-native';
import { colors } from '@/styles';
import { useProfile } from '@/components/identity/useProfile';
import { StartupProgress } from '@/components/StartupProgress';
import { useRouter } from 'expo-router';
import { SharesFeed } from '@/components/discover/SharesFeed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorView } from '@/components/error/ErrorView';

export default function DiscoverScreen() {
  const { profile, error, reloadProfile, isLoading } = useProfile();
  const router = useRouter();

  if (isLoading || !profile) {
    return <StartupProgress />;
  }

  if (error) {
    return (
      <ErrorView
        error={error.message}
        refresh={reloadProfile}
        isRefreshing={isLoading}
      />
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: colors.lightBlack }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.lightBlack
        }}
      >
        {profile.totalFollowing !== 0 ? (
          <View
            style={{
              justifyContent: 'center',
              height: '100%',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                color: colors.white,
                marginBottom: 20,
                textAlign: 'center',
                padding: 20
              }}
            >
              Um, this only really works with friends. And as far as we can
              tell, you don&apos;t have any.
            </Text>

            <Button
              onPress={() => {
                router.navigate('/people');
              }}
              title="Find some friends"
            />
          </View>
        ) : (
          <SharesFeed scope={{ type: 'global' }} />
        )}
      </View>
    </SafeAreaView>
  );
}
