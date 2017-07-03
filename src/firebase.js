import firebase from 'firebase'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyAija9AJWsSFb547M9Mx3vBmeoboUVYf5s',
  authDomain: 'paint-ca3d4.firebaseapp.com',
  databaseURL: 'https://paint-ca3d4.firebaseio.com',
  projectId: 'paint-ca3d4',
  storageBucket: '',
  messagingSenderId: '700019928097'
}

firebase.initializeApp(config)

export default firebase
