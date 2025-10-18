import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllDishes,
    createDish,
    editDish,
    publishDish,
    unpublishDish,
    deleteDish,
    markDishInStock,
    markDishOutOfStock,
} from "../api/dishesApi";
import type { Dish } from "../model/Dish";

export function useDishesOwner(restaurantId: string | null, token: string | null) {
    const queryClient = useQueryClient();

    const dishesQuery = useQuery<Dish[], Error>({
        queryKey: ["ownerDishes", restaurantId],
        queryFn: () => getAllDishes(restaurantId!, token!),
        enabled: !!restaurantId && !!token,
    });

    const createDishMutation = useMutation({
        mutationFn: (data: Partial<Dish>) => createDish(restaurantId!, data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

    const editDishMutation = useMutation({
        mutationFn: ({ dishId, data }: { dishId: string; data: Partial<Dish> }) =>
            editDish(restaurantId!, dishId, data, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

    const publishDishMutation = useMutation({
        mutationFn: (dishId: string) => publishDish(restaurantId!, dishId, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

    const unpublishDishMutation = useMutation({
        mutationFn: (dishId: string) => unpublishDish(restaurantId!, dishId, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

    const markInStockMutation = useMutation({
        mutationFn: (dishId: string) => markDishInStock(restaurantId!, dishId, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

    const markOutOfStockMutation = useMutation({
        mutationFn: (dishId: string) => markDishOutOfStock(restaurantId!, dishId, token!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownerDishes", restaurantId] });
        },
    });

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

        markInStock: markInStockMutation.mutateAsync,
        markOutOfStock: markOutOfStockMutation.mutateAsync,
    };
}
