import AsyncStorage from '@react-native-community/async-storage';
import { useEffect, useState } from 'react';

export const usePersistence = (key) => {
  // value is kept in sync with storage manually
  const [value, setValue] = useState('INITIALIZING');

  useEffect(() => {
    AsyncStorage.getItem(key).then((value) => setValue(JSON.parse(value)));
  }, []);

  return [
    value,
    async (value) => {
      if (typeof value === 'undefined') {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }
      setValue(value);
    },
  ];
};
