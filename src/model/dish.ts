export type DishAvailability = "PUBLISHED" | "DRAFT" | "UNPUBLISHED";
export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK";
export type FoodTags = "LACTOSE"|"GLUTEN_FREE"|"VEGAN"|"VEGETARIAN"|"NUTS"|"SPICY"
export type DishType = "STARTER" | "MAIN" | "DESSERT"

export interface Dish {
    dishId: string;
    name: string;
    type: DishType;
    foodTags: FoodTags;
    description: string;
    price: number;
    pictureUrl: string;
    availability: DishAvailability;
    stockStatus: StockStatus;
}
