import {
    TextField,
    Button,
    Box,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
    OutlinedInput,
} from "@mui/material";
import React, { useState, useEffect } from "react";

const DISH_TYPES = ["STARTER", "MAIN", "DESSERT"];
const FOOD_TAGS = ["LACTOSE", "GLUTEN_FREE", "VEGAN", "VEGETARIAN", "NUTS", "SPICY"];

interface EditDishFormProps {
    initialValues: any;
    onSubmit: (dish: any) => void;
}

export default function EditDishForm({ initialValues, onSubmit }: EditDishFormProps) {
    const [dish, setDish] = useState({
        name: "",
        type: "MAIN",
        foodTags: [] as string[],
        description: "",
        price: "",
        pictureUrl: "",
    });

    useEffect(() => {
        if (initialValues) {
            setDish({
                name: initialValues.name || "",
                type: initialValues.type || "MAIN",
                foodTags: initialValues.foodTags || [],
                description: initialValues.description || "",
                price: initialValues.price?.toString() || "",
                pictureUrl: initialValues.pictureUrl || "",
            });
        }
    }, [initialValues]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...dish,
            price: dish.price === "" ? 0 : Number(dish.price),
        };
        console.log(" Updated dish payload:", payload);
        onSubmit(payload);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 500,
                bgcolor: "rgba(255,255,255,0.85)",
                p: 3,
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
        >
            <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 1, textAlign: "center", color: "text.primary" }}
            >
                ✏ Edit Dish Details
            </Typography>

            <TextField
                label="Dish Name"
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
                    onChange={(e) =>
                        setDish({ ...dish, foodTags: e.target.value as string[] })
                    }
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

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    mt: 2,
                    py: 1.2,
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 2,
                    textTransform: "none",
                }}
            >
                 Save Changes
            </Button>
        </Box>
    );
}
