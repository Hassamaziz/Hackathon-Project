// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5a8zIUgW0uvMHcpHCoSY2nrYRiV3Aj24",
  authDomain: "hackathon-hassam.firebaseapp.com",
  projectId: "hackathon-hassam",
  storageBucket: "hackathon-hassam.appspot.com",
  messagingSenderId: "790801553301",
  appId: "1:790801553301:web:2f9aca0ff9e7615f9a089c",
  measurementId: "G-TDJ03YBZ2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
 export {auth,analytics,firestore}