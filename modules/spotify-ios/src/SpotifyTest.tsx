import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  initialize,
  login,
  logout,
  isLoggedIn,
  play,
  pause,
  resume,
  getPlayerState,
  SpotifyConfig
} from 'expo-spotify';

export default function SpotifyTest() {
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [playerState, setPlayerState] = useState<{
    isPlaying: boolean,
    position: number,
    duration: number,
    trackUri: string | null
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Spotify
    const config: SpotifyConfig = {
      clientId: 'YOUR_CLIENT_ID',
      redirectUrl: 'YOUR_APP_SCHEME://spotify-auth',
      tokenSwapUrl: 'YOUR_TOKEN_SWAP_URL',
      tokenRefreshUrl: 'YOUR_TOKEN_REFRESH_URL',
      scopes: [
        'user-read-private',
        'user-read-email',
        'user-modify-playback-state'
      ]
    };

    initialize(config).catch((err: Error) => {
      console.error('Failed to initialize Spotify:', err);
      setError(err.message);
    });

    // Check initial login state
    checkLoginState();

    // Set up interval to check player state
    const interval = setInterval(async () => {
      try {
        const state = await getPlayerState();
        setPlayerState(state);
      } catch (err) {
        console.error('Failed to get player state:', err);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const checkLoginState = async () => {
    try {
      const loggedIn = await isLoggedIn();
      setIsLoggedInState(loggedIn);
    } catch (err) {
      console.error('Failed to check login state:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleLogin = async () => {
    try {
      await login();
      await checkLoginState();
    } catch (err) {
      console.error('Failed to login:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      await checkLoginState();
    } catch (err) {
      console.error('Failed to logout:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handlePlay = async () => {
    try {
      await play('spotify:track:20I6sIOMTCkB6w7ryavxtO'); // Example track
    } catch (err) {
      console.error('Failed to play:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handlePause = async () => {
    try {
      await pause();
    } catch (err) {
      console.error('Failed to pause:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleResume = async () => {
    try {
      await resume();
    } catch (err) {
      console.error('Failed to resume:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spotify Test</Text>

      {error && <Text style={styles.error}>Error: {error}</Text>}

      <Text style={styles.status}>
        Status: {isLoggedInState ? 'Logged In' : 'Logged Out'}
      </Text>

      {playerState && (
        <View style={styles.playerInfo}>
          <Text>Track URI: {playerState.trackUri}</Text>
          <Text>Position: {Math.floor(playerState.position / 1000)}s</Text>
          <Text>Duration: {Math.floor(playerState.duration / 1000)}s</Text>
          <Text>Playing: {playerState.isPlaying ? 'Yes' : 'No'}</Text>
        </View>
      )}

      <View style={styles.buttons}>
        <Button
          title={isLoggedInState ? 'Logout' : 'Login'}
          onPress={isLoggedInState ? handleLogout : handleLogin}
        />

        {isLoggedInState && (
          <>
            <Button title="Play Test Track" onPress={handlePlay} />
            <Button
              title={playerState?.isPlaying ? 'Pause' : 'Resume'}
              onPress={playerState?.isPlaying ? handlePause : handleResume}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  status: {
    fontSize: 18,
    marginBottom: 20
  },
  error: {
    color: 'red',
    marginBottom: 20
  },
  playerInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5
  },
  buttons: {
    gap: 10
  }
});
