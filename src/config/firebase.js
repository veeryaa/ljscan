import firebase from 'firebase/app';

// const firebaseConfig = {
//   apiKey: "AIzaSyCEVEw64QzUunaoBUAAySjcIXb9boy6Rvs",
//   authDomain: "yuk-scan.firebaseapp.com",
//   databaseURL: "https://yuk-scan.firebaseio.com",
//   projectId: "yuk-scan",
//   storageBucket: "yuk-scan.appspot.com",
//   messagingSenderId: "339812799299",
//   appId: "1:339812799299:web:6cd0eb0e7a948e60e755f6",
//   measurementId: "G-M39SWL8GCV"
// };

var firebaseConfig = {
  apiKey: "AIzaSyDutrPEN-aooCRHz15vfQ6e2l7KCNte5s8",
  authDomain: "ljscan-70fe0.firebaseapp.com",
  databaseURL: "https://ljscan-70fe0.firebaseio.com",
  projectId: "ljscan-70fe0",
  storageBucket: "ljscan-70fe0.appspot.com",
  messagingSenderId: "686546000308",
  appId: "1:686546000308:web:a1092731d85499db83fae1"
};

const initialize = firebase.initializeApp(firebaseConfig);
export default initialize;
