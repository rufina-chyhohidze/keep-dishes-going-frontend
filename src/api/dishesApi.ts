import api from "../api";
import type { Dish } from "../model/Dish";

/**
 * Fetch all dishes (including unpublished) for a restaurant (OWNER only)
 */
export async function getAllDishes(restaurantId: string, token: string) {
    const res = await api.get(`/restaurants/${restaurantId}/dishes/all`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as Dish[];
}

/**
 * Fetch only published dishes (CUSTOMER view)
 */
export async function getPublishedDishes(restaurantId: string) {
    const res = await api.get(`/restaurants/${restaurantId}/dishes`);
    return res.data as Dish[];
}

/**
 * Create a new dish
 */
export async function createDish(
    restaurantId: string,
    data: Partial<Dish>,
    token: string
) {
    const res = await api.post(`/restaurants/${restaurantId}/dishes`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as Dish;
}

/**
 * Edit an existing dish
 */
export async function editDish(
    restaurantId: string,
    dishId: string,
    data: Partial<Dish>,
    token: string
) {
    const res = await api.put(`/restaurants/${restaurantId}/dishes/${dishId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as Dish;
}

/**
 * Publish a dish
 */
export async function publishDish(
    restaurantId: string,
    dishId: string,
    token: string
) {
    await api.post(
        `/restaurants/${restaurantId}/dishes/${dishId}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
}

/**
 * Unpublish a dish
 */
export async function unpublishDish(
    restaurantId: string,
    dishId: string,
    token: string
) {
    await api.post(
        `/restaurants/${restaurantId}/dishes/${dishId}/unpublish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
}

/**
 * Delete a dish
 */
export async function deleteDish(
    restaurantId: string,
    dishId: string,
    token: string
) {
    await api.delete(`/restaurants/${restaurantId}/dishes/${dishId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

/**
 * Mark dish as OUT OF STOCK
 */
export async function markDishOutOfStock(
    restaurantId: string,
    dishId: string,
    token: string
) {
    await api.post(
        `/restaurants/${restaurantId}/dishes/${dishId}/out-of-stock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
}

/**
 *  Mark dish as IN STOCK
 */
export async function markDishInStock(
    restaurantId: string,
    dishId: string,
    token: string
) {
    await api.post(
        `/restaurants/${restaurantId}/dishes/${dishId}/in-stock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
