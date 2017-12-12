import React from 'react';
import { StatusBar, StyleSheet, View, Text, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import MapView from 'react-native-maps';

export default class App extends React.Component {
  state = {
    showModal: false,
    mapInitialised: false,
    mapRegion: null,
    latitude: null,
    longitude: null
  };

  componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00922*1.5,
        longitudeDelta: 0.00421*1.5
      }

      this.onRegionChange(region, region.latitude, region.longitude);
    });
  }

  onRegionChange(region, latitude, longitude) {
    this.setState({
      mapInitialised: true,
      mapRegion: region,
      latitude: latitude || this.state.latitude,
      longitude: longitude || this.state.longitude
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true}/>
        <View style={styles.contentContainer}>
          {this.state.mapInitialised ? (
              <MapView
                style={{ alignSelf: 'stretch', height: 250 }}
                region={this.state.mapRegion}
                provider={MapView.PROVIDER_GOOGLE}
                onRegionChange={this.onRegionChange.bind(this)}
              >
                <MapView.Marker
                  coordinate={{
                    latitude: (this.state.latitude + 0.00050),
                    longitude: (this.state.longitude + 0.00050),
                  }}
                />
              </MapView>
            ) : (
              <View style={styles.initMap}>
                <Text>Initialising map...</Text>
              </View>
            )
          }
          <Modal isVisible={this.state.showModal}>
            <View style={styles.modalContent}>
              <Text>Looking up address from current GPS...</Text>
            </View>
          </Modal>
        </View>
        <View style={styles.lookupButton}>
          {renderButton(this, () => this.setState({ showModal: true }))}
        </View>
      </View>
    );
  }
}

const renderButton = (context, onPress) => {
  lookupCurrentAddress(context);

  return (
    <Button
      large
      title="LOOKUP CURRENT ADDRESS"
      backgroundColor="#428bca"
      onPress={onPress}
    />
  );
};

const lookupCurrentAddress = (context) => {
  if (context.state.showModal) {
    console.log('Process looking up for current address using GPS...');
    setTimeout(() => {
      console.log('Closing modal...');
      context.setState({ showModal: false });
    }, 5000);
  }
};

const errorMessage = () => {
  Alert.alert(
    'Ooops!',
    'Sorry, something went wrong. Please try in a few minutes or restart the application.',
    [{text: 'Close'}],
    { cancelable: false }
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    flex: 1,
  },
  initMap: {
    height: 250,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  lookupButton: {
    height: 70
  }
});
