import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function getOwnerRestaurant(token: string) {
    const res = await axios.get(`${BASE_URL}/owner/me/restaurant`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function toggleRestaurantOpen(restaurantId: string, token: string) {
    const res = await axios.put(
        `${BASE_URL}/restaurants/${restaurantId}/toggle`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return res.data;
}
