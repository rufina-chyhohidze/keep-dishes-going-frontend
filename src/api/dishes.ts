import api from "../api";

export async function fetchDishes(restaurantId: string) {
    const res = await api.get(`/restaurants/${restaurantId}/dishes`);
    return res.data;
}

export async function createDish(restaurantId: string, data: any) {
    const res = await api.post(`/restaurants/${restaurantId}/dishes`, data);
    return res.data;
}


export async function publishDish(restaurantId: string, dishId: string) {
    await api.post(`/restaurants/${restaurantId}/dishes/${dishId}/publish`);
}

export async function unpublishDish(restaurantId: string, dishId: string) {
    await api.post(`/restaurants/${restaurantId}/dishes/${dishId}/unpublish`);
}

export async function editDish(restaurantId: string, dishId: string, data: any) {
    const res = await api.put(`/restaurants/${restaurantId}/dishes/${dishId}`, data);
    return res.data;
}
