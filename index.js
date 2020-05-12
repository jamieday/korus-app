/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity,
} from 'react-native-global-props';

setCustomText({ style: { fontFamily: 'Raleway-Regular' } });

AppRegistry.registerComponent(appName, () => App);
