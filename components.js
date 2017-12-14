import React from 'react';
import { View, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import MapView from 'react-native-maps';
import Styles from './styles';

export const initGoogleMapView = (
  <View style={Styles.initMap}>
    <Text>Initialising map...</Text>
  </View>
);

export const GoogleMapView = (context) => {
  return (
    <MapView
      style={{ alignSelf: 'stretch', height: 250 }}
      region={context.state.mapRegion}
      provider={MapView.PROVIDER_GOOGLE}
      onRegionChange={context.onRegionChange.bind(context)}
    >
      <MapView.Marker
        anchor={{x: 0.65, y: 0.65}}
        centerOffset={{x: 0.65, y: 0.65}}
        coordinate={{
          latitude: context.state.latitude,
          longitude: context.state.longitude
        }}
      >
        <View style={Styles.markerOuter}>
          <View style={Styles.markerInner}></View>
        </View>
      </MapView.Marker>
    </MapView>
  );
};

export const ProcessModal = (context) => {
  return (
    <Modal isVisible={context.state.showProcessModal}>
      <TouchableWithoutFeedback onPress={context.onTapProcessModal.bind(context)}>
        <View style={Styles.processModalView}>
          <View style={Styles.processModalContent}>
            <Text style={Styles.processModalText}>Please wait looking up address from current GPS...</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const AddressModal = (context) => {
  const state = context.state;

  return (
    <GestureRecognizer onSwipeDown={() => context.onSwipeDown()}>
      <Modal isVisible={context.state.showAddressModal}>
        <View style={Styles.addressModalContent}>
          <Text style={Styles.modalTextBold}>{context.longAddress}</Text>
          <Text style={Styles.modalText}>Fetched at {context.currentTime}</Text>
          <Text style={Styles.space} />
          <Text style={Styles.modalTextBold}>GPS Coordinates:</Text>
          <Text style={Styles.modalText}>Lat: {_roundLoc(state.latitude)}</Text>
          <Text style={Styles.modalText}>Lng: {_roundLoc(state.longitude)}</Text>
          <Text style={Styles.space} />
          <Text style={Styles.hint}>Swipe down to dismiss</Text>
        </View>
      </Modal>
    </GestureRecognizer>
  );
};

export const HistoryView = (history) => {
  return (
    <ScrollView>
      {
         history.map((item, index) => (
           <View key={item.id} style={Styles.historyViewItem}>
             <Text style={Styles.historyViewItemText}>{item.time} - {item.address}</Text>
           </View>
         ))
       }
    </ScrollView>
  );
};

export const LookupButton = (context) => {
  return (
    <Button
      large
      title="LOOKUP CURRENT ADDRESS"
      color="#222"
      buttonStyle={Styles.lookupButton}
      onPress={context.lookupCurrentAddress.bind(context)}
    />
  );
};

const _roundLoc = (value) => {
  return Number(`${Math.round(`${value}e7`)}e-7`);
};
