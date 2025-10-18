import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllDishes,
    createDish,
    editDish,
    publishDish,
    unpublishDish,
    deleteDish,
} from "../api/dishesApi";
import type { Dish } from "../model/Dish";

export function useDishesOwner(restaurantId: string | null, token: string | null) {
    const queryClient = useQueryClient();

    // 📥 Fetch all dishes (including unpublished)
    const dishesQuery = useQuery<Dish[], Error>({
        queryKey: ["ownerDishes", restaurantId],
        queryFn: () => getAllDishes(restaurantId!, token!),
        enabled: !!restaurantId && !!token,
    });

    // ➕ Create a dish
    const createDishMutation = useMutation({
        mutationFn: (data: Partial<Dish>) => createDish(restaurantId!, data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

    // 📝 Edit dish
    const editDishMutation = useMutation({
        mutationFn: ({ dishId, data }: { dishId: string; data: Partial<Dish> }) =>
            editDish(restaurantId!, dishId, data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

    // 🚀 Publish
    const publishDishMutation = useMutation({
        mutationFn: (dishId: string) => publishDish(restaurantId!, dishId, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

    // ⏸ Unpublish
    const unpublishDishMutation = useMutation({
        mutationFn: (dishId: string) => unpublishDish(restaurantId!, dishId, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

    // 🗑 Delete
    const deleteDishMutation = useMutation({
        mutationFn: (dishId: string) => deleteDish(restaurantId!, dishId, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

    return {
        dishes: dishesQuery.data ?? [],
        isLoading: dishesQuery.isLoading,
        isError: dishesQuery.isError,
        error: dishesQuery.error,

        createDish: createDishMutation.mutateAsync,
        editDish: editDishMutation.mutateAsync,
        publishDish: publishDishMutation.mutateAsync,
        unpublishDish: unpublishDishMutation.mutateAsync,
        deleteDish: deleteDishMutation.mutateAsync,
    };
}
