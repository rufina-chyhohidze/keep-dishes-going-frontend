export type DishAvailability = "PUBLISHED" | "DRAFT" | "UNPUBLISHED";

export interface Dish {
    dishId: string;
    name: string;
    type: string;
    description: string;
    price: number;
    pictureUrl: string;
    availability: DishAvailability;
    stockStatus: string;
    foodTags: string[];
}
