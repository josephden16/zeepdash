import React, { useEffect, useState, createContext } from 'react';
import { auth, firestore } from '../../firebase';


export const UserContext = createContext(null);


const UserProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribeFromAuth = auth.onAuthStateChanged(async authenticateUser => {
      if (authenticateUser) {
        const userRef = firestore.collection("Users").doc(authenticateUser.uid);
        const restaurantRef = firestore.collection("Restaurants").doc(authenticateUser.uid);
        const restaurantSnapshot = await restaurantRef.get();
        
        // if the user owns a business account then add their data
        if (restaurantSnapshot.exists) {
          const userSnapshot = await userRef.get()
          const userData = userSnapshot.data();
          const restaurantData = restaurantSnapshot.data();
          setUser({
            id: authenticateUser.uid,
            ...userData,
            ...restaurantData
          });
        } else {
          const userSnapshot = await userRef.get()
          const userData = userSnapshot.data();
          setUser({
            id: authenticateUser.uid,
            ...userData
          });
        }
      }
      else {
        setUser(null);
      }
    })

    return () => {
      unsubscribeFromAuth();
    }
  }, [props]);

  return (
    <UserContext.Provider value={user}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserProvider;
