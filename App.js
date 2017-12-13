import React from 'react';
import { StatusBar, StyleSheet, TouchableWithoutFeedback, View, Text, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import MapView from 'react-native-maps';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Axios from 'axios';
import Moment from 'moment';
import Secret from './secret';

let axiosCancelToken;

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
  shortAddress = null;
  longAddress = null;
  currentTime = null;
  addressModalID = 0;

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

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange(region, latitude, longitude) {
    this.setState({
      mapInitialised: true,
      mapRegion: region,
      latitude: latitude || this.state.latitude,
      longitude: longitude || this.state.longitude
    });
  }

  onTapProcessModal() {
    axiosCancelToken();
    this.setState({ showProcessModal: false });
    clearTimeout(this.addressModalID);
    console.log('API request has been cancelled.');
  }

  onSwipeDown() {
    this.setState({ showAddressModal: false });
  }

  lookupCurrentAddress() {
    console.log('Processing Google API request...');
    this.setState({ showProcessModal: true });
    googleAPIRequest(this);
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
          <GestureRecognizer onSwipeDown={() => this.onSwipeDown()}>
            <Modal isVisible={this.state.showAddressModal}>
              <View style={styles.addressModalContent}>
                <Text style={styles.modalTextBold}>{this.longAddress}</Text>
                <Text style={styles.modalText}>Fetched at {this.currentTime}</Text>
                <Text style={styles.space} />
                <Text style={styles.modalTextBold}>GPS Coordinates:</Text>
                <Text style={styles.modalText}>Lat: {roundLoc(this.state.latitude)}</Text>
                <Text style={styles.modalText}>Lng: {roundLoc(this.state.longitude)}</Text>
                <Text style={styles.space} />
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
          <Button
            large
            title="LOOKUP CURRENT ADDRESS"
            color="#222"
            buttonStyle={styles.lookupButton}
            onPress={this.lookupCurrentAddress.bind(this)}
          />
        </View>
      </View>
    );
  }
}
const googleAPIRequest = (context) => {
  const CancelToken = Axios.CancelToken;

  Axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${context.state.latitude},${context.state.longitude}&key=${Secret.API_KEY}`,
      {
        cancelToken: new CancelToken(function executor(cancel) {
          axiosCancelToken = cancel;
        })
      }
    )
    .then(response => {
      console.log('Google API request completed.');

      if (response.data.status !== 'OK') {
        throw new Error(`Geocode error: ${response.data.status}`);
      }

      console.log(response.data.results[0]);

      context.shortAddress;
      context.longAddress = response.data.results[0].formatted_address;
      context.currentTime = Moment().format('h:mma');

      setTimeout(() => {
        context.setState({ showProcessModal: false });
      }, 700);

      context.addressModalID = setTimeout(() => {
        context.setState({ showAddressModal: true });
      }, 1400);
    })
    .catch(error => {
      if (Axios.isCancel(error)) {
        return true;
      }

      console.log('Geocode error:', error);
      context.setState({ showProcessModal: false });
      setTimeout(errorMessage, 500);
    });
}

const errorMessage = () => {
  Alert.alert(
    'Ooops!',
    'Sorry, something went wrong. Please check your internet connection or try in a few minutes. If error still exists, close and restart the applciation.',
    [{text: 'Close'}],
    { cancelable: false }
  )
};

const roundLoc = (value) => {
  return Number(`${Math.round(`${value}e7`)}e-7`);
}

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
    borderRadius: 10,
    paddingTop: 70,
    paddingRight: 35,
    paddingBottom: 70,
    paddingLeft: 35
  },
  modalText: {
    fontSize: 22,
    textAlign: 'center'
  },
  modalTextBold: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  space: {
    height: 40
  },
  hint: {
    color: '#bbb',
    fontSize: 18,
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
