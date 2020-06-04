import React from 'react';
import { Button, View, Text } from 'react-native';
import { useShareApi } from './useShareApi';
import { colors } from '../../styles';
import { StartupProgress } from '../StartupProgress';
import { ErrorView } from '../error/ErrorView';
import { Song } from '../song/Song';
import { usePlayer } from '../streaming-service/usePlayer';

export const ShareSongScreen = ({ navigation, route }) => {
  const { song } = route.params;

  const { share, error: shareError, status: shareStatus } = useShareApi();
  const player = usePlayer();

  React.useEffect(
    () =>
      navigation.addListener('focus', () => {
        player.playSong(song);
      }),
    [navigation],
  );

  React.useEffect(
    () =>
      navigation.addListener('blur', () => {
        if (shareStatus === 'ready') {
          player.pauseSong();
        }
      }),
    [navigation],
  );

  if (shareStatus === 'loading') {
    return <StartupProgress />;
  }

  if (shareError) {
    return <ErrorView error={shareError} />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      <Song height={400} song={song} />
      <View
        style={{
          marginHorizontal: 30,
        }}
      >
        <Button
          onPress={() => {
            share(song);
          }}
          title="Share"
        />
        <Text
          style={{ color: colors.gray, textAlign: 'center', marginTop: 15 }}
        >
          You might have noticed there's not much going on here. Don't worry -
          you'll see changes coming soon.
        </Text>
      </View>
    </View>
  );
};
