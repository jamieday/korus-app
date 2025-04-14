import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePersistence = <T>(
  key: string,
  defaultValue?: T,
): [T | undefined, (value: T | undefined) => Promise<void>] => {
  const [value, setValue] = useState<T | undefined>(defaultValue);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue !== null) {
          setValue(JSON.parse(storedValue));
        } else {
          setValue(defaultValue);
        }
      } catch (error) {
        console.error('Error loading from AsyncStorage:', error);
        setValue(defaultValue);
      }
    };

    loadValue();
  }, [key, defaultValue]);

  const persistValue = async (newValue: T | undefined) => {
    try {
      if (newValue === undefined) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(newValue));
      }
      setValue(newValue);
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  };

  return [value, persistValue];
};
