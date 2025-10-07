export interface Dish {
    id: string
    name: string
    type: "starter" | "main" | "dessert";
    tags: string[];
    description: string;
    price: number;
    picture?: string;
    status: "published" | "unpublished" | "out-of-stock";
}
