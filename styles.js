import { StyleSheet } from 'react-native';

export default Styles = StyleSheet.create({
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
  historyView: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10
  },
  historyViewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginLeft: 20
  },
  historyViewItemText: {
    fontSize: 18
  },
  lookupButtonView: {
    backgroundColor: '#ddd',
    height: 90,
    paddingTop: 18,
    paddingBottom: 18,
    paddingRight: 3,
    paddingLeft: 3
  },
  lookupButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#222',
    borderStyle: 'solid',
    borderWidth: 1
  }
});
