/* eslint-disable import/prefer-default-export */
import React, { useContext } from 'react';
import { PlaybackContext } from './PlaybackContext';
import * as AppleMusic from './apple-music';
import * as AppleMusicPlayer from './apple-music/player';
import * as Spotify from './spotify';
import * as SpotifyPlayer from './spotify/player';
import { useStreamingService } from './StreamingServiceContext';

const findPlayer = (key) => {
  switch (key) {
    case AppleMusic.uniqueKey:
      return AppleMusicPlayer;
    case Spotify.uniqueKey:
      return SpotifyPlayer;
    default:
      throw new Error(`unknown streaming service player ${key}`);
  }
};

export const usePlayer = () => {
  const { context } = useStreamingService();
  const playbackState = usePlaybackState();
  const player = context ? findPlayer(context.key).usePlayer() : undefined;

  return {
    seek: player.seek,
    canPlay: player.canPlay,
    playSong: player.playSong,
    pauseSong: player.pauseSong,
    state: playbackState,
    supportsTracking: player.supportsTracking,
  };
};

const usePlaybackState = () => {
  const { playbackState } = useContext(PlaybackContext);
  return playbackState;
};
