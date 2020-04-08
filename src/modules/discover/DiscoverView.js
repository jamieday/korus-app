import React from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '../../styles';

import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { Recommendation } from './Recommendation';
import { getUsername } from '../identity/getUsername';

export const API_HOSTNAME = (() => {
  const hostname = process.env['API_HOSTNAME'];
  if (hostname) {
    console.log(
      `[API Client] Using environment-provided hostname: ${hostname}`,
    );
    return hostname;
  }
  console.log(`[API Client] Using default hostname: ${hostname}`);
  return 'chorus.media';
})();

const tracksPerPage = 4;

export default class DiscoverScreen extends React.Component {
  async refreshList(upToPage) {
    console.log('Fetching recommendations...');
    const result = await appleMusicApi.requestUserToken();
    if (result.isError) {
      // TODO deal with error cases of authorization
      return;
    }
    const appleMusicUserToken = result.result;

    const chorusUserToken = await getUsername();
    if (!chorusUserToken) {
      return;
    }

    const response = await fetch(
      `http://${API_HOSTNAME}/api/recommendation/list`,
      {
        headers: {
          // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
          'X-Chorus-User-Token': chorusUserToken,
          // Header duplicated in backend {8eeaa95a-ab4f-45ca-a97a-f4767d8f4872}
          'X-Apple-Music-User-Token': appleMusicUserToken,
        },
      },
    );
    const json = await response.json();
    const songs = json.map(song => ({
      id: song.id,
      brand: 'Test',
      title: song.name,
      isLoved: song.isLoved,
      unsupported: song.unsupported,
      subtitle: song.artist,
      artworkUrl: song.artworkUrl,
      playbackStoreId: song.appleMusic.playbackStoreId,
      badge: 'NEW',
      price: song.recommendedBy.name,
      badgeColor: '#3cd39f',
      image: song.recommendedBy.image,
    }));

    console.log(`Fetched ${songs.length} recommendations.`);

    const appleMusicPermission = await appleMusicApi.requestPermission();
    if (appleMusicPermission !== 'ok') {
      // nope cannot recommend or play music ? what can do ?
      console.error("Wasn't given apple music permission!");
    }
    return songs;
  }

  componentDidMount() {
    (async () => this.props.setData(await this.refreshList()))();
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          onRefresh={() =>
            (async () => {
              try {
                this.props.setRefreshing(true);
                const sleep = sleepMs =>
                  new Promise(resolve => setTimeout(resolve, sleepMs));
                // UX: Keep refreshing in the background if the call takes too long
                await Promise.race([
                  sleep(500),
                  (async () => this.props.setData(await this.refreshList(1)))(),
                ]);
              } finally {
                this.props.setRefreshing(false);
              }
            })()
          }
          refreshing={this.props.isRefreshing}
          onEndReached={() => {
            this.props.setEndReached(true);
            const nextPage = this.props.upToPage + 1;
            this.props.setUpToPage(nextPage);
            // (async () => {
            // const additionalItems = await this.refreshList(nextPage);
            // this.props.setData([...this.props.data, additionalItems]);
            // })();
            this.props.setEndReached(false);
          }}
          onEndReachedThreshold={0.95}
          showsVerticalScrollIndicator={false}
          initialNumToRender={tracksPerPage}
          ListFooterComponent={() =>
            this.props.isEndReached && (
              <ActivityIndicator animating size="large" />
            )
          }
          keyExtractor={item =>
            item.id
              ? `${this.props.tabIndex}-${item.id}`
              : `${item[0] && item[0].id}`
          }
          style={{ backgroundColor: '#004ecbdd', padding: 15 }}
          data={this.props.data}
          renderItem={({ item }) => (
            <Recommendation key={item.id} item={item} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
