import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import type {Restaurant} from "../types/Dish";

export const useRestaurants = () => {
    return useQuery<Restaurant[], Error>({
        queryKey: ["restaurants"],
        queryFn: async () => {
            const {data} = await axios.get("/data/restaurants.json");
            return data;
        },
    });
};
