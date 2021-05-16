import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';


const firebaseConfig = {
  apiKey: "AIzaSyDEmE0Kntqe4ohSYtn8h8dYFu4G_37Cop0",
  authDomain: "zeepdash-5dc81.firebaseapp.com",
  projectId: "zeepdash-5dc81",
  storageBucket: "zeepdash-5dc81.appspot.com",
  messagingSenderId: "155466461030",
  appId: "1:155466461030:web:651d9f699dab190e1722a7",
  measurementId: "G-RLZF2CZHFM"
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
