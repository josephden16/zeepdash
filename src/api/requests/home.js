import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { firestore } from "../../firebase";

export const fetchRestaurants = async () => {
  const collectionName =
    process.env.NODE_ENV === "production" ? "Restaurants" : "Restaurants_dev";
  const restaurantRef = collection(firestore, collectionName);
  const restaurantQuery = query(
    restaurantRef,
    where("available", "==", true),
    limit(8)
  );

  try {
    const snapshot = await getDocs(restaurantQuery);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchCuisines = async () => {
  const collectionName = "Cuisines";
  const ref = collection(firestore, collectionName);

  try {
    const snapshot = await getDocs(ref);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error) {
    throw error;
  }
};
