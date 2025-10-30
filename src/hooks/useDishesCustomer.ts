import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type {Dish} from "../model/dish.ts";

/**
 * Fetch only published dishes for customers
 */
export function useDishesCustomer(restaurantId: string) {
  return useQuery<Dish[], Error>({
    queryKey: ["dishes", restaurantId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:8080/restaurants/${restaurantId}/dishes`
      );
      return data;
    },
    enabled: !!restaurantId,
  });
}
