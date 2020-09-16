import {
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Slider } from 'react-native-elements';
import { colors } from '../../../styles';
import { usePlayer } from '../../streaming-service/usePlayer';

import PauseIcon from '../../../../assets/images/icons/pause.svg';
import PlayIcon from '../../../../assets/images/icons/play.svg';

export const PlaybackBar = () => {
  return <MiniPlayer onOpen={() => {}} />;
};

const MiniPlayer = ({ onOpen }) => {
  const player = usePlayer();

  if (player.state.key === 'ready') {
    return null;
  }

  if (!player.canPlay(player.state.song)) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: colors.black,
        height: 50,
        borderTopColor: colors.gray,
        borderTopWidth: 1,
      }}
    >
      <PlaybackProgressBarMini />
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={onOpen}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Image */}
              {/*  source={{ uri: player.state.song.artworkUrl }} */}
              {/*  style={{ height: 50, width: 50 }} */}
              {/* /> */}
              <View style={{ paddingLeft: 10 }}>
                <Text
                  style={{
                    color: colors.lightGray,
                    fontSize: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  {player.state.song.artist}
                </Text>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  {player.state.song.name}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View>
          <TouchableOpacity
            style={{ paddingHorizontal: 15, zIndex: 6 }}
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={() => {
              if (player.state.key === 'playing') {
                player.pauseSong();
              } else {
                player.playSong(player.state.song);
              }
            }}
          >
            <Text style={{ color: 'white' }}>
              {player.state.key === 'playing' ? (
                <PauseIcon width={18} height={18} fill={colors.white} />
              ) : (
                <PlayIcon width={18} height={18} fill={colors.white} />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const PlaybackProgressBarMini = () => {
  const player = usePlayer();

  const [base, setBase] = useState();

  const [elapsedMsOffset, setElapsedMsOffset] = useState(0);

  const [isTracking, setTracking] = useState(false);

  const elapsedMs = base ? base.elapsedMs + elapsedMsOffset : 0;

  if (!player.supportsTracking) {
    return null;
  }

  useEffect(() => {
    if (
      !isTracking &&
      player.state.progress &&
      player.state.key === 'playing'
    ) {
      const { lastElapsedMs, totalMs, lastUpdateMs } = player.state.progress;
      const currentMs = new Date().getTime();
      const deltaMs = currentMs - lastUpdateMs;
      const newElapsedMs = lastElapsedMs + deltaMs;
      setBase({
        elapsedMs: newElapsedMs,
        totalMs,
        lastUpdateMs,
      });
      // flush offset
      setElapsedMsOffset(0);
    }
  }, [player.state.progress, isTracking]);

  useEffect(() => {
    const tickMs = 100;
    const timeout = setInterval(() => {
      if (!base || player.state.key !== 'playing' || isTracking) {
        return;
      }
      const currentMs = new Date().getTime();
      const deltaMs = currentMs - base.lastUpdateMs;
      setElapsedMsOffset(deltaMs);
    }, tickMs);
    return () => clearTimeout(timeout);
  }, [base, player.state.key, isTracking]);

  const onSlidingStart = () => {
    setTracking(true);
  };

  const onSlidingComplete = () => {
    setTracking(false);
    player.seek(elapsedMs);
  };

  const thumbSize = isTracking ? 12 : 6;

  return (
    <Slider
      style={{
        position: 'absolute',
        top: -20,
        bottom: 0,
        left: 0,
        right: 0,
      }}
      trackStyle={{
        height: 2,
      }}
      thumbStyle={{
        width: thumbSize,
        height: thumbSize,
      }}
      thumbTouchSize={{
        width: 80,
        height: 80,
      }}
      minimumValue={0}
      minimumTrackTintColor={colors.white}
      maximumValue={base?.totalMs ?? 1}
      maximumTrackTintColor={colors.gray}
      onSlidingStart={onSlidingStart}
      onSlidingComplete={onSlidingComplete}
      value={elapsedMs}
      onValueChange={(value) =>
        setElapsedMsOffset(value - base?.elapsedMs ?? 0)
      }
      thumbTintColor={colors.white}
    />
  );
};
