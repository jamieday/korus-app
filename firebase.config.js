import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// Initialize Firebase
const firebaseConfig = {
  clientId:
    '492441652532-2md1oougamla1itmbfe2118876s1gnd2.apps.googleusercontent.com',
  reversedClientId:
    'com.googleusercontent.apps.492441652532-2md1oougamla1itmbfe2118876s1gnd2',
  apiKey: 'AIzaSyAcBTWKawnELivBvKqT4d6S5g6pBVjOvv8',
  authDomain: 'discover-together.firebaseapp.com',
  databaseURL: 'https://discover-together.firebaseio.com',
  projectId: 'discover-together',
  storageBucket: 'discover-together.appspot.com',
  appId: '1:492441652532:ios:463ef9a419ae4b7b0d6961',
  googleAppId: '1:492441652532:ios:463ef9a419ae4b7b0d6961',
  isAdsEnabled: false,
  isAnalyticsEnabled: false,
  isAppInviteEnabled: true,
  isGcmEnabled: true,
  isSigninEnabled: true,
  gcmSenderId: '492441652532',
  plistVersion: '1',
  bundleId: 'app.korus'
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };
