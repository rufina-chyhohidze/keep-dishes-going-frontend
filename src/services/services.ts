import api from "../api/api";
import type {Restaurant} from "../types/Restaurant";

export async function getAllRestaurants(): Promise<Restaurant[]> {
    const {data} = await api.get<Restaurant[]>("/restaurants");
    return data;
}
