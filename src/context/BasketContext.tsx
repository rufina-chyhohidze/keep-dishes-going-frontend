import React, { createContext, useContext, useState } from "react";

export interface BasketItem {
    dishId: string;
    name: string;
    price: number;
    quantity: number;
}

interface BasketContextType {
    items: BasketItem[];
    restaurantId: string | null;
    addItem: (item: BasketItem, restaurantId: string) => void;
    increaseQuantity: (dishId: string) => void;
    decreaseQuantity: (dishId: string) => void;
    removeItem: (dishId: string) => void;
    clearBasket: () => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<BasketItem[]>([]);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    const addItem = (item: BasketItem, rId: string) => {
        console.log("🛒 Adding item:", item, "for restaurant:", rId);
        if (!restaurantId || restaurantId === rId) {
            setRestaurantId(rId);
            setItems(prev => {
                const existing = prev.find(i => i.dishId === item.dishId);
                if (existing) {
                    return prev.map(i =>
                        i.dishId === item.dishId ? { ...i, quantity: i.quantity + item.quantity } : i
                    );
                }
                return [...prev, item];
            });
        } else {
            if (confirm("Clear basket from another restaurant?")) {
                setRestaurantId(rId);
                setItems([item]);
            }
        }
    };

    const increaseQuantity = (dishId: string) =>
        setItems(prev =>
            prev.map(i => (i.dishId === dishId ? { ...i, quantity: i.quantity + 1 } : i))
        );

    const decreaseQuantity = (dishId: string) =>
        setItems(prev =>
            prev
                .map(i => (i.dishId === dishId ? { ...i, quantity: i.quantity - 1 } : i))
                .filter(i => i.quantity > 0)
        );

    const removeItem = (dishId: string) =>
        setItems(prev => prev.filter(i => i.dishId !== dishId));

    const clearBasket = () => {
        setItems([]);
        setRestaurantId(null);
    };

    return (
        <BasketContext.Provider
            value={{ items, restaurantId, addItem, increaseQuantity, decreaseQuantity, removeItem, clearBasket }}
        >
            {children}
        </BasketContext.Provider>
    );
};

export const useBasket = () => {
    const ctx = useContext(BasketContext);
    if (!ctx) throw new Error("useBasket must be used inside BasketProvider");
    return ctx;
};
