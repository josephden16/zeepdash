import { useQuery } from "react-query";
import { fetchCuisines, fetchRestaurants } from "../requests/home";

export const useCuisines = () => {
  const query = useQuery("cuisines", fetchCuisines);
  return query;
};

export const useRestaurants = () => {
  const query = useQuery("restaurants", fetchRestaurants);
  return query;
};
