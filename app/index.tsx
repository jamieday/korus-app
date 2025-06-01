// import SpotifyTest from '@/modules/spotify-ios/src/SpotifyTest';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/discover" />;

  // return <SpotifyTest />; // TODO: Remove this
}
