import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyAkAqd73_GC41fPiXsv2sHcsFc1ldLbDU0",
    authDomain: "darren-test-project-40961.firebaseapp.com",
    databaseURL: "https://darren-test-project-40961.firebaseio.com",
    storageBucket: "darren-test-project-40961.appspot.com",
  };
firebase.initializeApp(config);

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth