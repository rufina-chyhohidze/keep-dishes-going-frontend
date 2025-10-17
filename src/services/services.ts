import api from "../api.ts";
import type {Restaurant} from "../types/Restaurant";

export async function getAllRestaurants(): Promise<Restaurant[]> {
    const {data} = await api.get<Restaurant[]>("/restaurants");
    return data;
}
