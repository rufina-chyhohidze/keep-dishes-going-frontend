import React, { useMemo, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useDishesCustomer } from "../hooks/useDishesCustomer";
import { useBasket } from "../context/BasketContext";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Grid,
    Divider,
    Badge,
    Fab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import type {Dish, DishType, FoodTags} from "../model/Dish";


const TAGS: FoodTags[] = ["VEGAN", "VEGETARIAN", "LACTOSE", "GLUTEN_FREE", "NUTS", "SPICY"];
const TYPES: DishType[] = ["STARTER", "MAIN", "DESSERT"];

const RestaurantDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const restaurantId = id ?? "";

    const { data: dishes, isLoading, isError, error } = useDishesCustomer(restaurantId);
    const { addItem, items } = useBasket();

    const [selectedType, setSelectedType] = useState<DishType | "">("");
    const [selectedTags, setSelectedTags] = useState<FoodTags[]>([]);
    const [sortOption, setSortOption] = useState<string>("price-asc");

    const handleTypeChange = useCallback(
        (e: React.ChangeEvent<{ value: unknown }>) => setSelectedType(e.target.value as DishType | ""),
        []
    );
    const handleTagChange = useCallback(
        (e: React.ChangeEvent<{ value: unknown }>) => setSelectedTags(e.target.value as FoodTags[]),
        []
    );
    const handleSortChange = useCallback(
        (e: React.ChangeEvent<{ value: unknown }>) => setSortOption(e.target.value as string),
        []
    );
    const handleClearFilters = useCallback(() => {
        setSelectedType("");
        setSelectedTags([]);
        setSortOption("price-asc");
    }, []);

    //(memoized)
    const filteredDishes = useMemo<Dish[]>(() => {
        if (!dishes) return [];

        let result = [...dishes];

        if (selectedType) {
            result = result.filter((d) => d.type === selectedType);
        }

        if (selectedTags.length > 0) {
            result = result.filter((d) =>
                selectedTags.every((tag) => d.foodTags.includes(tag))
            );

        }

        switch (sortOption) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        return result;
    }, [dishes, selectedType, selectedTags, sortOption]);

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{ mt: 10 }}>
                {error?.message || "Failed to load dishes"}
            </Alert>
        );
    }

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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.55)",
                    zIndex: 1,
                },
            }}
        >
            <Box sx={{ maxWidth: 1100, width: "100%", position: "relative", zIndex: 2 }}>
                <Typography
                    variant="h3"
                    sx={{ mb: 1, fontWeight: 700, textAlign: "center", color: "#fff" }}
                >
                    🍽️ Our Menu
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        mb: 3,
                        textAlign: "center",
                        color: "rgba(255,255,255,0.8)",
                    }}
                >
                    Pick your favorite dishes and add them to your basket.
                </Typography>

                <Divider sx={{ mb: 4, bgcolor: "rgba(255,255,255,0.3)" }} />

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 2,
                        mb: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        padding: 2,
                        borderRadius: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                >
                    <FormControl sx={{ minWidth: 160,
                        backgroundColor: "aliceblue",
                        borderRadius: 1 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={selectedType}
                            onChange={handleTypeChange}
                            label="Type"
                        >
                            <MenuItem value="">All</MenuItem>
                            {TYPES.map((t) => (
                                <MenuItem key={t} value={t}>
                                    {t}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 100,
                        backgroundColor: "aliceblue",
                        borderRadius: 1}}>
                        <InputLabel>Tags</InputLabel>
                        <Select
                            multiple
                            value={selectedTags}
                            onChange={handleTagChange}
                            input={<OutlinedInput label="Tags" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {(selected as string[]).map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {TAGS.map((tag) => (
                                <MenuItem key={tag} value={tag}>
                                    {tag}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 180,
                        backgroundColor: "aliceblue",
                        borderRadius: 1}}>
                        <InputLabel>Sort by</InputLabel>
                        <Select
                            value={sortOption}
                            onChange={handleSortChange}
                            label="Sort by"
                        >
                            <MenuItem value="price-asc">Price (Low → High)</MenuItem>
                            <MenuItem value="price-desc">Price (High → Low)</MenuItem>
                            <MenuItem value="name-asc">Name (A–Z)</MenuItem>
                            <MenuItem value="name-desc">Name (Z–A)</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                </Box>

                {/* 🍽️ Dish Grid */}
                <Grid container spacing={3} justifyContent="center">
                    {filteredDishes.map((dish) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={dish.dishId}
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <Card
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                    width: 300,
                                    borderRadius: 3,
                                    backdropFilter: "blur(8px)",
                                    background: "rgba(255, 255, 255, 0.9)",
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                    "&:hover": {
                                        transform: "translateY(-6px)",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={dish.pictureUrl || "/placeholder.jpg"}
                                    alt={dish.name}
                                    sx={{
                                        objectFit: "cover",
                                        borderTopLeftRadius: "12px",
                                        borderTopRightRadius: "12px",
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}
                                    >
                                        {dish.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "text.secondary",
                                            mb: 1.5,
                                            minHeight: 40,
                                        }}
                                    >
                                        {dish.description || "No description available"}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: "primary.main",
                                        }}
                                    >
                                        € {dish.price.toFixed(2)}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddShoppingCartIcon />}
                                        sx={{
                                            py: 1,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            borderRadius: 2,
                                        }}
                                        disabled={dish.stockStatus === "OUT_OF_STOCK"}
                                        onClick={() =>
                                            addItem(
                                                {
                                                    dishId: dish.dishId,
                                                    name: dish.name,
                                                    price: dish.price,
                                                    quantity: 1,
                                                },
                                                restaurantId
                                            )
                                        }
                                    >
                                        {dish.stockStatus === "OUT_OF_STOCK"
                                            ? "Out of Stock"
                                            : "Add to Basket"}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box
                sx={{
                    position: "fixed",
                    bottom: 30,
                    right: 30,
                    zIndex: 2000,
                }}
            >
                <Link to="/basket" style={{ textDecoration: "none" }}>
                    <Badge
                        badgeContent={items.length}
                        color="error"
                        overlap="rectangular"
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        sx={{
                            "& .MuiBadge-badge": {
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                transform: "translate(25%, -25%)",
                            },
                        }}
                    >
                        <Fab
                            color="secondary"
                            sx={{
                                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                                "&:hover": {
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                                },
                            }}
                        >
                            <ShoppingCartIcon sx={{ fontSize: 28 }} />
                        </Fab>
                    </Badge>
                </Link>
            </Box>
        </Box>
    );
};

export default RestaurantDetailsPage;
