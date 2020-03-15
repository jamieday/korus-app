import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import { fonts, colors } from '../../styles';
import { Button } from '../../components';
import { Text } from '../../components/StyledText';

import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';

export default function HomeScreen({ isExtended, setIsExtended, navigation }) {
  // const rnsUrl = 'https://reactnativestarter.com';
  // const handleClick = () => {
  //   Linking.canOpenURL(rnsUrl).then(supported => {
  //     if (supported) {
  //       Linking.openURL(rnsUrl);
  //     } else {
  //       console.log(`Don't know how to open URI: ${rnsUrl}`);
  //     }
  //   });
  // };

  const defaultText = "... Andrew's Music";
  const [mainText, setMainText] = React.useState(defaultText);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.section}>
          <Text size={20} white>
            Home
          </Text>
        </View>
        <View style={styles.section}>
          <Text color="#19e7f7" size={15}>
            The only way to discover quality music
          </Text>
          <Text size={30} bold white style={styles.title}>
            {mainText}
          </Text>
        </View>
        <View style={[styles.section, { marginTop: 50 }]}>
          <Text color="#19e7f7" size={18}>
            Pick your poison
          </Text>
          <Button
            style={[{ height: 50, margin: 20 }]}
            primary
            rounded
            caption="Recommend"
            onPress={() => {
              (async () => {
                console.log('Speak to me now.');
                const song = await appleMusicApi.selectSong();
                console.log('Song below:');
                console.log(JSON.stringify(song));
                await fetch('http://chorus.media/', {
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    'song-name': song.title,
                    'artist-name': song.artist,
                  }),
                  method: 'POST',
                });
                setMainText(`You recommended ${song.title}.`);

                setTimeout(() => setMainText(defaultText), 5000);
              })();
            }}
          />

          <Button
            style={{ height: 50 }}
            primary
            rounded
            caption="Discover"
            onPress={() =>
              navigation.navigate({
                routeName: 'Discover',
              })
            }
          />
        </View>
        <View style={[styles.section, styles.sectionLarge]}>
          <Text color="#19e7f700" hCenter size={15} style={styles.description}>
            {' '}
            This is a temporary page that will be removed at some point! :)
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bgImage: {
    flex: 1,
    marginHorizontal: -20,
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLarge: {
    flex: 2,
    justifyContent: 'space-around',
  },
  sectionHeader: {
    marginBottom: 8,
  },
  priceContainer: {
    alignItems: 'center',
  },
  description: {
    padding: 15,
    lineHeight: 25,
  },
  titleDescription: {
    color: '#19e7f7',
    textAlign: 'center',
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
  },
  title: {
    marginTop: 30,
  },
  price: {
    marginBottom: 5,
  },
  priceLink: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
});
