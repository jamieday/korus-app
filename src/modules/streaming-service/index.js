/* eslint-disable import/prefer-default-export */
import React from 'react';
import { StreamingServiceContext } from './StreamingServiceContext';
import * as AppleMusic from './apple-music';
import * as Spotify from './spotify';

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
  const context = React.useContext(StreamingServiceContext);
  const service = findService(context.key);
  const player = service.usePlayer();
  return {
    context,
    service,
    player,
  };
};
