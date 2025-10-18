import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Chip, OutlinedInput } from "@mui/material";
import React, { useState } from "react";

interface DishFormProps {
    onSubmit: (dish: any) => void;
}

const DISH_TYPES = ["STARTER", "MAIN", "DESSERT"];
const FOOD_TAGS = [
    "LACTOSE",
    "GLUTEN_FREE",
    "VEGAN",
    "VEGETARIAN",
    "NUTS",
    "SPICY"];

export default function DishForm({ onSubmit }: DishFormProps) {
    const [dish, setDish] = useState({
        name: "",
        type: "MAIN",
        foodTags: ["VEGETARIAN"],
        description: "",
        price: "",
        pictureUrl: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...dish,
            price: dish.price === "" ? 0 : Number(dish.price),
        };

        console.log("📤 Final payload to backend:", payload);
        onSubmit(payload);

        setDish({
            name: "",
            type: "MAIN",
            foodTags: ["VEGETARIAN"],
            description: "",
            price: "",
            pictureUrl: ""
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 400,
                bgcolor: "rgba(255,255,255,0.8)",
                p: 3,
                borderRadius: 2,
                boxShadow: 2
            }}
        >
            <Typography variant="h6" gutterBottom>
                Add a new dish
            </Typography>

            <TextField
                label="Name"
                value={dish.name}
                onChange={(e) => setDish({ ...dish, name: e.target.value })}
                required
            />

            <TextField
                label="Price (€)"
                type="number"
                value={dish.price}
                onChange={(e) => setDish({ ...dish, price: e.target.value })}
                required
            />

            <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                    value={dish.type}
                    onChange={(e) => setDish({ ...dish, type: e.target.value })}
                    input={<OutlinedInput label="Type" />}
                >
                    {DISH_TYPES.map((t) => (
                        <MenuItem key={t} value={t}>
                            {t}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Food Tags</InputLabel>
                <Select
                    multiple
                    value={dish.foodTags}
                    onChange={(e) => setDish({ ...dish, foodTags: e.target.value as string[] })}
                    input={<OutlinedInput label="Food Tags" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                >
                    {FOOD_TAGS.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                            {tag}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Description"
                multiline
                rows={3}
                value={dish.description}
                onChange={(e) => setDish({ ...dish, description: e.target.value })}
            />

            <TextField
                label="Picture URL"
                value={dish.pictureUrl}
                onChange={(e) => setDish({ ...dish, pictureUrl: e.target.value })}
            />

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                ➕ Add Dish
            </Button>
        </Box>
    );
}
