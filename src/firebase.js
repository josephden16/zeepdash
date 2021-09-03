import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';


const firebaseConfig = {
  apiKey: "AIzaSyDFTPvfLe81TKbSHfL_HkopFa9qrMEocFI",
  authDomain: "food-delivery-app-a941f.firebaseapp.com",
  projectId: "food-delivery-app-a941f",
  storageBucket: "food-delivery-app-a941f.appspot.com",
  messagingSenderId: "132897372614",
  appId: "1:132897372614:web:1aa84075cff6424fd9dac7",
  measurementId: "G-G8FCYE4PZW"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// check if firebase analytics is supported in the current app context
let isAnalyticsSupported = isSupported();
if (isAnalyticsSupported === true) {
  getAnalytics(firebaseApp);
}
// eslint-disable-next-line
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
