/* eslint-disable import/prefer-default-export */
import React, { useContext } from 'react';
import { StreamingServiceContext } from './StreamingServiceContext';
import * as AppleMusic from './apple-music';
import * as Spotify from './spotify';
import { PlaybackContext } from './PlaybackContext';

export const findService = (key) => {
  switch (key) {
    case AppleMusic.uniqueKey:
      return AppleMusic;
    case Spotify.uniqueKey:
      return Spotify;
    default:
      throw new Error(`unknown streaming service ${key}`);
  }
};

export const useStreamingService = () => {
  const context = useContext(StreamingServiceContext);
  const { playbackState } = useContext(PlaybackContext);
  const service = context ? findService(context.key) : undefined;
  const player = context ? service.usePlayer() : undefined;
  return {
    context,
    service,
    player,
    playbackState,
  };
};
