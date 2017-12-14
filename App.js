import React from 'react';
import { StatusBar, View, Alert } from 'react-native';
import Axios from 'axios';
import Moment from 'moment';
import * as Components from './components';
import Styles from './styles';
import Secret from './secret';
import RNStorage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

Storage = new RNStorage({
  size: 20,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24 // 1 day
});

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
  history = [];

  componentDidMount() {
    Storage.getAllDataForKey('history').then(history => {
      this.history = history.reverse();
    });

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
      <View style={Styles.container}>
        <StatusBar hidden={true}/>
        <View style={Styles.contentContainer}>
          {this.state.mapInitialised ? Components.GoogleMapView(this) : Components.initGoogleMapView}
          {Components.ProcessModal(this)}
          {Components.AddressModal(this)}
        </View>
        <View style={Styles.historyView}>
          {Components.HistoryView(this.history)}
        </View>
        <View style={Styles.lookupButtonView}>
          {Components.LookupButton(this)}
        </View>
      </View>
    );
  }
};

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

      setTimeout(() => {
        context.setState({ showProcessModal: false });
      }, 700);

      context.addressModalID = setTimeout(() => {
        saveCurrentAddress(context, response.data.results[0]);
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
};

const saveCurrentAddress = (context, data) => {
  const address = data.address_components;

  let history = context.history;
  let newId = history.length > 0 ? (history[0].id + 1) : 1;

  context.currentTime = Moment().format('h:mma');
  context.longAddress = data.formatted_address;
  context.shortAddress = `${address[0].short_name} ${address[1].short_name}`;

  const newHistory = {
    id: newId,
    time: context.currentTime,
    address: `${context.shortAddress}`
  };

  Storage.save({
    key: 'history',
    id: newId,
    data: newHistory
  });

  history.unshift(newHistory);

  context.setState({ showAddressModal: true });
};

const errorMessage = () => {
  Alert.alert(
    'Ooops!',
    'Sorry, something went wrong. Please check your internet connection or try in a few minutes. If error still exists, close and restart the applciation.',
    [{text: 'Close'}],
    { cancelable: false }
  )
};
