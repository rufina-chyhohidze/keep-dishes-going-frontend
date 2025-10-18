export type DishAvailability = "PUBLISHED" | "DRAFT" | "UNPUBLISHED";
export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK";

export interface Dish {
    dishId: string;
    name: string;
    type: string;
    description: string;
    price: number;
    pictureUrl: string;
    availability: DishAvailability;
    stockStatus: StockStatus;
}
