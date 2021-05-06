import React, { useEffect, useState, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import { doc, getDoc } from '@firebase/firestore';


export const UserContext = createContext(null);


const UserProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribeFromAuth = onAuthStateChanged(auth, async authenticateUser => {
      if (authenticateUser) {
        const userCollectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
        const restaurantCollectionName = process.env.NODE_ENV === 'production' ? 'Restaurants' : 'Restaurants_dev';
        const userRef = doc(firestore, userCollectionName, authenticateUser.uid);
        const restaurantRef = doc(firestore, restaurantCollectionName, authenticateUser.uid);
        const restaurantSnapshot = await getDoc(restaurantRef);

        // if the user owns a business account then add their data
        if (restaurantSnapshot.exists) {
          const userSnapshot = await getDoc(userRef);
          const userData = userSnapshot.data();
          const restaurantData = restaurantSnapshot.data();
          setUser({
            id: authenticateUser.uid,
            ...userData,
            ...restaurantData
          });
        } else {
          const userSnapshot = await getDoc(userRef);
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
