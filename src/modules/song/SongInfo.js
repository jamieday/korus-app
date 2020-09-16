import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from '../../korui/image/Image';
import { colors } from '../../styles';
import { usePlayer } from '../streaming-service/usePlayer';
import { isSongPlaying } from '../liked/LikedScreen';

export const SongInfo = ({ style, song }) => {
  const player = usePlayer();
  const isPlaying = isSongPlaying(song, player.state);
  return (
    <TouchableOpacity
      disabled={!player.canPlay(song)}
      onPress={() => (isPlaying ? player.pauseSong() : player.playSong(song))}
      activeOpacity={0.5}
      style={[
        style,
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
      ]}
    >
      <Image
        style={{
          width: 50,
          aspectRatio: 1,
          marginRight: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={{ uri: song.artworkUrl }}
        borderRadius={10}
      />
      <View style={{ flexShrink: 1 }}>
        <Text
          style={{
            color: colors.darkLightGray,
            fontSize: 8,
            textTransform: 'uppercase',
          }}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        >
          {song.artist}
        </Text>
        <Text
          style={{ color: colors.white, fontSize: 14 }}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
        >
          {song.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
