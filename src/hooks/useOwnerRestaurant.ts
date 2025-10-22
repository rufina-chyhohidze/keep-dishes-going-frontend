import { useState, useEffect, useCallback } from "react";
import { getOwnerRestaurant, toggleRestaurantOpen } from "../api/restaurantApi";

export function useOwnerRestaurant(token: string | null) {
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchRestaurant = useCallback(() => {
        if (!token) return;
        setLoading(true);
        getOwnerRestaurant(token)
            .then(setRestaurant)
            .catch((err) => console.error("Failed to load restaurant", err))
            .finally(() => setLoading(false));
    }, [token]);

    useEffect(() => {
        fetchRestaurant();
    }, [fetchRestaurant]);

    async function handleToggleOpen() {
        if (!token || !restaurant) return;

        setRestaurant((prev: any) => ({
            ...prev,
            open: !prev.open,
        }));

        try {
            await toggleRestaurantOpen(restaurant.restaurantId, token);
        } catch (err) {
            console.error("Failed to toggle open", err);
            setRestaurant((prev: any) => ({
                ...prev,
                open: !prev.open,
            }));
        }
    }

    return { restaurant, loading, handleToggleOpen, refetch: fetchRestaurant };
}
