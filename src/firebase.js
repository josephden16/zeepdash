import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/analytics';


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
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();


// authentication functions
export const registerWithEmailAndPassword = (email, password) => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      console.log(user);
      return user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(`Error Code: ${errorCode}, Error Message: ${errorMessage}`);
    });
}

export const signInWithEmailAndPassword = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      //signed in
      var user = userCredential.user;
      console.log(user);
      return user;
    })

    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(`Error Code: ${errorCode}, Error Message: ${errorMessage}`);
      return error.message;
    })
}

// google oauth
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
  auth.signInWithPopup(googleAuthProvider)
    .then(userCredentials => {
      const { user } = userCredentials;
      console.log("sign in successufl");
      console.log(user);
    })
    .catch(error => {
      console.log(error);
    })
}

export const signOut = () => {
  auth.signOut();
}

//todo: remove this before production deploy
// window.firebase = firebase;

export default firebase;
