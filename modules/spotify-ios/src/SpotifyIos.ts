import { requireNativeModule } from 'expo-modules-core';

const SpotifyIos = requireNativeModule('SpotifyIos');

export interface SpotifySession {
  accessToken: string;
  refreshToken: string;
  expirationDate: string;
}

export interface SpotifyPlayerState {
  isPaused: boolean;
  playbackPosition: number;
  track: {
    uri: string,
    name: string,
    artist: {
      name: string,
    },
    duration: number,
  };
}

export interface SpotifyConnectionError {
  code: number;
  domain: string;
  description: string;
}

export interface SpotifyConnectionState {
  connected: boolean;
  error: SpotifyConnectionError | null;
}

class SpotifyIosModule {
  async initialize(): Promise<void> {
    return await SpotifyIos.initialize();
  }

  async connect(): Promise<SpotifySession> {
    return await SpotifyIos.connect();
  }

  async disconnect(): Promise<void> {
    return await SpotifyIos.disconnect();
  }

  async playUri(uri: string): Promise<void> {
    return await SpotifyIos.playUri(uri);
  }

  async pause(): Promise<void> {
    return await SpotifyIos.pause();
  }

  async resume(): Promise<void> {
    return await SpotifyIos.resume();
  }

  async seek(positionMs: number): Promise<void> {
    return await SpotifyIos.seek(positionMs);
  }

  async isConnected(): Promise<boolean> {
    return await SpotifyIos.isConnected();
  }

  onPlayerStateChanged(callback: (state: SpotifyPlayerState) => void): void {
    SpotifyIos.addListener('playerStateChanged', callback);
  }

  removePlayerStateListener(
    callback: (state: SpotifyPlayerState) => void,
  ): void {
    SpotifyIos.removeListener('playerStateChanged', callback);
  }

  onConnectionStateChanged(
    callback: (state: SpotifyConnectionState) => void,
  ): void {
    SpotifyIos.addListener('connectionStateChanged', callback);
  }

  removeConnectionStateListener(
    callback: (state: SpotifyConnectionState) => void,
  ): void {
    SpotifyIos.removeListener('connectionStateChanged', callback);
  }
}

export default new SpotifyIosModule();
