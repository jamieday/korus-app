import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, View } from 'react-native';
import { useShareApi } from './useShareApi';
import { colors } from '../../styles';
import { Song } from '../song/Song';
import { usePlayer } from '../streaming-service/usePlayer';
import { TextInput } from '../../korui/TextInput';

export const ShareSongScreen = ({ navigation, route }) => {
  const { song } = route.params;

  const { share, error: shareError, status: shareStatus } = useShareApi();
  const [error, setError] = useState(shareError);
  useEffect(() => setError(shareError), [shareError]);

  const player = usePlayer();
  const [captionInput, setCaptionInput] = useState('');
  const caption = captionInput.length > 0 ? captionInput : undefined;

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

  const processShare = () => {
    share({ song, caption });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      <View style={{ marginHorizontal: 15 }}>
        <Song height={300} song={song} />
        <View>
          <View style={{ minHeight: 80 }}>
            <TextInput
              error={error}
              onChangeText={(value) => {
                setCaptionInput(value);
                setError(undefined);
              }}
              characterLimit={45}
              value={captionInput}
              placeholder="add a caption (optional)"
            />
          </View>
          <View
            style={{
              height: 50,
              justifyContent: 'center',
            }}
          >
            {shareStatus === 'loading' ? (
              <ActivityIndicator />
            ) : (
              <Button onPress={processShare} title="Share" />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
