import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import Image from 'react-native-fast-image';
import Slider from '@react-native-community/slider';
import { colors } from '../../styles';
import { usePlayer } from '../streaming-service/usePlayer';
import PlayIcon from '../../../assets/images/icons/play.svg';
import PauseIcon from '../../../assets/images/icons/pause.svg';
import BackIcon from '../../../assets/images/icons/player-previous.svg';
import NextIcon from '../../../assets/images/icons/player-next.svg';
import { SongTitle } from '../profile/SongTitle';

export const PlayerScreen = () => {
  const player = usePlayer();

  const isPlaying = player.state.key === 'playing';

  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <View style={{ margin: 20 }}>
        <View>
          <Image
            style={{
              width: '100%',
              aspectRatio: 1,
              borderRadius: 12,
              marginBottom: 60,
            }}
            source={{ uri: player.state.song.artworkUrl }}
          />
        </View>
        <SongTitle
          songName={player.state.song.songName}
          artistName={player.state.song.artistName}
        />
        <PlaybackProgressBar />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
          }}
        >
          <BackIcon width={25} height={25} fill={colors.gray} />
          <TouchableOpacity
            onPress={() =>
              isPlaying
                ? player.pauseSong()
                : player.playSong(player.state.song)
            }
          >
            {isPlaying ? (
              <PauseIcon width={50} height={50} fill={colors.white} />
            ) : (
              <PlayIcon width={50} height={50} fill={colors.white} />
            )}
          </TouchableOpacity>
          <NextIcon width={25} height={25} fill={colors.gray} />
        </View>
      </View>
    </View>
  );
};

const PlaybackProgressBar = () => {
  const player = usePlayer();
  const { progress = { elapsedMs: 0, totalMs: 1 } } = player.state;
  const onSeek = player.seek;

  const [elapsedMs, setElapsedMs] = useState(progress.elapsedMs);
  const totalMs = useMemo(() => progress.totalMs, [progress.totalMs]);
  const [isTracking, setTracking] = useState(false);
  useEffect(() => {
    if (!isTracking) {
      setElapsedMs(progress.elapsedMs);
    }
  }, [progress.elapsedMs, isTracking]);

  return (
    <View style={{ paddingVertical: 20 }}>
      <Slider
        style={{ width: '100%', height: 4 }}
        value={elapsedMs}
        onValueChange={(value) => setElapsedMs(value)}
        onSlidingStart={() => {
          setTracking(true);
        }}
        onSlidingComplete={(value) => {
          setTracking(false);
          onSeek(value);
        }}
        minimumValue={0}
        maximumValue={totalMs}
        minimumTrackTintColor={colors.white}
        maximumTrackTintColor={colors.gray}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: colors.white }}>
          {formatMsInMinutes(elapsedMs)}
        </Text>
        <Text style={{ color: colors.white }}>
          {formatMsInMinutes(elapsedMs - progress.totalMs)}
        </Text>
      </View>
    </View>
  );
};

const formatMsInMinutes = (ms) => {
  const sign = ms <= -1000 ? '-' : '';
  const msAbs = Math.abs(ms);
  const countMin = Math.floor(msAbs / 1000 / 60);
  const secPart = Math.floor(msAbs / 1000) % 60;
  return `${sign}${countMin}:${secPart < 10 ? `0${secPart}` : secPart}`;
};

const TrackingBall = ({ translateX, isTracking, ...panHandlers }) => {
  const size = 12;

  return (
    <>
      <Animated.View
        style={{
          position: 'absolute',
          left: translateX,
          top: -size / 3,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.white,
          transform: [{ scale: isTracking ? 1.5 : 1 }],
        }}
      />

      <Animated.View
        style={{
          top: -(size * 5) / 2,
          width: size * 5,
          height: size * 5,
          zIndex: 999,
          position: 'absolute',
          left: translateX,
          right: 0,
          bottom: 0,
        }}
        {...panHandlers}
      />
    </>
  );
};
