import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../../styles';

export const GroupsScreen = ({}) => {
  // React.useEffect(() => {
  // (async () => this.props.setData(await this.refreshList()))();
  // }, []);

  return (
    <View style={styles.container}>
      <Text>Coming soon ;)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
