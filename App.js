import React from 'react';
import { StatusBar, StyleSheet, TouchableWithoutFeedback, View, Text, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import MapView from 'react-native-maps';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

let processModalTimeoutID = 0;
let addressModalTimeoutID = 0;

export default class App extends React.Component {
  state = {
    showProcessModal: false,
    showAddressModal: false,
    addressFound: false,
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
        latitudeDelta: 0.00922 * 1.5,
        longitudeDelta: 0.00421 * 1.5
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

  onSwipeDown(state) {
    console.log('Address modal has been closed.');
    this.setState({ showAddressModal: false });
  }

  onTapProcessModal() {
    console.log('Process has been aborted!');
    this.setState({ showProcessModal: false });
    clearTimeout(processModalTimeoutID);
    clearTimeout(addressModalTimeoutID);
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
                  anchor={{x: 0.65, y: 0.65}}
                  centerOffset={{x: 0.65, y: 0.65}}
                  coordinate={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                  }}
                >
                  <View style={styles.markerOuter}>
                    <View style={styles.markerInner}></View>
                  </View>
                </MapView.Marker>
              </MapView>
            ) : (
              <View style={styles.initMap}>
                <Text>Initialising map...</Text>
              </View>
            )
          }
          <GestureRecognizer onSwipeDown={(state) => this.onSwipeDown(state)}>
            <Modal isVisible={this.state.showAddressModal}>
              <View style={styles.addressModalContent}>
                <Text style={styles.modalTextBold}>GPS Coordinates:</Text>
                <Text style={styles.modalText}>Lat: {this.state.latitude}</Text>
                <Text style={styles.modalText}>Long: {this.state.longitude}</Text>
                <Text />
                <Text style={styles.hint}>Swipe down to dismiss</Text>
              </View>
            </Modal>
          </GestureRecognizer>
          <Modal isVisible={this.state.showProcessModal}>
            <TouchableWithoutFeedback onPress={this.onTapProcessModal.bind(this)}>
              <View style={styles.processModalView}>
                <View style={styles.processModalContent}>
                  <Text style={styles.processModalText}>Please wait looking up address from current GPS...</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
        <View style={styles.lookupButtonView}>
          {renderButton(this, () => this.setState({ showProcessModal: true }))}
        </View>
      </View>
    );
  }
}

const renderButton = (context, onPress) => {
  lookupCurrentAddress(context)

  return (
    <Button
      large
      title="LOOKUP CURRENT ADDRESS"
      color="#222"
      buttonStyle={styles.lookupButton}
      onPress={onPress}
    />
  );
};

const lookupCurrentAddress = (context) => {
  if (context.state.showProcessModal) {
    console.log('Looking up for current address simulation...');

    processModalTimeoutID = setTimeout(() => {
      console.log('Closing process modal...');
      context.setState({ showProcessModal: false });
    }, 2000);

    addressModalTimeoutID = setTimeout(() => {
      console.log('Show address modal...');
      context.setState({ showAddressModal: true });
    }, 2500);
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
  markerOuter: {
    backgroundColor: 'rgba(0, 102, 255, 0.15)',
    borderRadius: 50,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerInner: {
    backgroundColor: 'rgba(0, 102, 255, 0.5)',
    borderRadius: 10,
    height: 10,
    width: 10
  },
  processModalView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  processModalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  processModalText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 24,
    lineHeight: 35,
    textAlign: 'center'
  },
  addressModalContent: {
    backgroundColor: 'white',
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center'
  },
  modalTextBold: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  hint: {
    color: '#bbb',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  lookupButtonView: {
    backgroundColor: '#ddd',
    height: 86,
    paddingBottom: 16,
    paddingTop: 16
  },
  lookupButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#222',
    borderStyle: 'solid',
    borderWidth: 1
  }
});
