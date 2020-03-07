import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  Linking,
} from 'react-native';

import { fonts, colors } from '../../styles';
import { Button } from '../../components';

export default function AvailableInFullVersionScreen(props) {
  const handleClick = () => {
    Linking.canOpenURL(rnsUrl).then(supported => {
      if (supported) {
        Linking.openURL(rnsUrl);
      } else {
        console.log(`Don't know how to open URI: ${rnsUrl}`);
      }
    });
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/background.png')}
      style={styles.container}
    >
      <Image
        source={require('../../../assets/images/RNS_nerd.png')}
        style={styles.nerdImage}
      />

      <View style={styles.textContainer}>
        <Text style={styles.availableText}>Not</Text>
        <Text style={styles.availableText}>Available</Text>
        <Text style={styles.availableText}>Yet</Text>
        <Text style={styles.descriptorText}>We're working on it!</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          large
          bordered
          rounded
          style={styles.button}
          caption="Go Back"
          onPress={() => props.navigation.goBack()}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
    justifyContent: 'space-around',
  },
  nerdImage: {
    width: 80,
    height: 80,
  },
  availableText: {
    color: colors.white,
    fontFamily: fonts.primaryRegular,
    fontSize: 40,
    marginVertical: 3,
  },
  descriptorText: {
    marginTop: 50,
    color: colors.white,
    fontFamily: fonts.primaryLight,
    fontSize: 18,
    marginVertical: 3,
  },
  textContainer: {
    alignItems: 'center',
  },
  buttonsContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  button: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
});
