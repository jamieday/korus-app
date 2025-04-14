import React, { useContext } from 'react';
import { PlaybackContext } from './PlaybackContext';
import * as AppleMusic from './apple-music';
import * as AppleMusicPlayer from './apple-music/player';
import * as Spotify from './spotify';
import * as SpotifyPlayer from './spotify/player';
import { useStreamingService } from './StreamingServiceContext';
import { PlayerHook, PlaybackState } from './types';

const findPlayer = (key: string) => {
  switch (key) {
    case AppleMusic.uniqueKey:
      return AppleMusicPlayer;
    case Spotify.uniqueKey:
      return SpotifyPlayer;
    default:
      throw new Error(`unknown streaming service player ${key}`);
  }
};

export const usePlayer = (): PlayerHook => {
  const { context } = useStreamingService();
  const playbackState = usePlaybackState();
  const player = context ? findPlayer(context.key).usePlayer() : undefined;

  return {
    seek: player?.seek || (() => {}),
    canPlay: player?.canPlay || (() => false),
    playSong: player?.playSong || (() => {}),
    pauseSong: player?.pauseSong || (() => {}),
    state: playbackState,
    supportsTracking: player?.supportsTracking || false,
  };
};

const usePlaybackState = (): PlaybackState => {
  const { playbackState } = useContext(PlaybackContext);
  return playbackState;
};
