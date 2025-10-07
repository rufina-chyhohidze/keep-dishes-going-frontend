import {useQuery} from "@tanstack/react-query";
import axios from "axios";

export interface Dish {
    dishId: string;
    name: string;
    type: string;
    description: string;
    price: number;
    pictureUrl: string;
    availability: string;
    stockStatus: string;
    foodTags: string[];
}

export const useDishes = (restaurantId: string) => {
    return useQuery<Dish[], Error>({
        queryKey: ["dishes", restaurantId],
        queryFn: async () => {
            const {data} = await axios.get(
                `http://localhost:8080/restaurants/${restaurantId}/dishes`
            );
            return data;
        },
        enabled: !!restaurantId, // avoids running before we have an ID
    });
};
