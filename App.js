import React from 'react';
import { StatusBar, StyleSheet, View, Alert } from 'react-native';
import { Button } from 'react-native-elements';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.contentContainer}>
        </View>
        <View style={styles.lookupButton}>
          <Button
            large
            title="LOOKUP CURRENT ADDRESS"
            backgroundColor="#428bca"
            onPress={lookupCurrentAddress}
          />
        </View>
      </View>
    );
  }
}

const lookupCurrentAddress = () => {
  lookingUpAddressMessage();
}

const lookingUpAddressMessage = () => {
  errorMessage();
}

const errorMessage = () => {
  Alert.alert(
    'Ooops!',
    'Sorry, something went wrong. Please try in a few minutes or restart the application.',
    [{text: 'Close'}],
    { cancelable: false }
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    flex: 1,
  },
  lookupButton: {
    height: 70
  }
});
