import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Divider, CircularProgress, Alert } from "@mui/material";
import { useDishesCustomer } from "../../hooks/useDishesCustomer";
import { useBasket } from "../../context/BasketContext";
import type { Dish, DishType, FoodTags } from "../../model/dish.ts";

import BackButton from "../../components/restaurant/BackButton";
import DishFilters from "../../components/dish/DishFilters";
import DishGrid from "../../components/dish/DishGrid";
import FloatingBasketButton from "../../components/restaurant/FloatingBasketButton";

const TAGS: FoodTags[] = ["VEGAN", "VEGETARIAN", "LACTOSE", "GLUTEN_FREE", "NUTS", "SPICY"];
const TYPES: DishType[] = ["STARTER", "MAIN", "DESSERT"];

export default function RestaurantDishesPage() {
    const { id } = useParams<{ id: string }>();
    const restaurantId = id ?? "";
    const navigate = useNavigate();
    const { data: dishes, isLoading, isError, error } = useDishesCustomer(restaurantId);
    const { addItem, items } = useBasket();

    const [type, setType] = useState<DishType | "">("");
    const [tags, setTags] = useState<FoodTags[]>([]);
    const [sort, setSort] = useState<string>("price-asc");

    const handleChange = useCallback((setter: any) => (e: any) => setter(e.target.value), []);

    const clearFilters = () => {
        setType("");
        setTags([]);
        setSort("price-asc");
    };

    const filteredDishes = useMemo(() => {
        if (!dishes) return [];
        let result = [...dishes];

        if (type) result = result.filter((d) => d.type === type);
        if (tags.length) result = result.filter((d) => tags.every((t) => d.foodTags.includes(t)));

        const sorters: Record<string, (a: Dish, b: Dish) => number> = {
            "price-asc": (a, b) => a.price - b.price,
            "price-desc": (a, b) => b.price - a.price,
            "name-asc": (a, b) => a.name.localeCompare(b.name),
            "name-desc": (a, b) => b.name.localeCompare(a.name),
        };

        return result.sort(sorters[sort]);
    }, [dishes, type, tags, sort]);

    if (isLoading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );

    if (isError)
        return (
            <Alert severity="error" sx={{ mt: 10 }}>
                {error?.message || "Failed to load dishes"}
            </Alert>
        );

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                backgroundImage: 'url("../images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                py: 6,
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.55)",
                    zIndex: 1,
                },
            }}
        >
            <Box sx={{ position: "relative", zIndex: 2, maxWidth: 1100, mx: "auto", px: 2 }}>
                <BackButton onClick={() => navigate("/customer")} />

                <Typography variant="h3" fontWeight={700} textAlign="center" color="#fff">
                    Our Menu
                </Typography>
                <Typography
                    variant="subtitle1"
                    textAlign="center"
                    color="rgba(255,255,255,0.8)"
                    mb={3}
                >
                    Pick your favorite dishes and add them to your basket.
                </Typography>

                <Divider sx={{ mb: 4, bgcolor: "rgba(255,255,255,0.3)" }} />

                <DishFilters
                    type={type}
                    tags={tags}
                    sort={sort}
                    onTypeChange={handleChange(setType)}
                    onTagsChange={handleChange(setTags)}
                    onSortChange={handleChange(setSort)}
                    clearFilters={clearFilters}
                    TAGS={TAGS}
                    TYPES={TYPES}
                />

                <DishGrid dishes={filteredDishes} addItem={addItem} restaurantId={restaurantId} />
            </Box>

            <FloatingBasketButton count={items.length} />
        </Box>
    );
}
