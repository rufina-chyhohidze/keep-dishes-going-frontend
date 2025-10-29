import { useState, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Alert,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput,
    Divider,
    Card,
    CardContent,
    CardMedia,
    Fab,
    Badge,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDishesCustomer } from "../hooks/useDishesCustomer";
import { useBasket } from "../context/BasketContext";
import type { Dish, DishType, FoodTags } from "../model/Dish";

const TAGS: FoodTags[] = ["VEGAN", "VEGETARIAN", "LACTOSE", "GLUTEN_FREE", "NUTS", "SPICY"];
const TYPES: DishType[] = ["STARTER", "MAIN", "DESSERT"];

export default function RestaurantDetailsPage() {
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
                {/* 🔙 Back Button */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        color="inherit"
                        onClick={() => navigate("/customer")}
                        sx={{
                            color: "white",
                            borderColor: "white",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.1)",
                                borderColor: "white",
                            },
                        }}
                    >
                        Back to Restaurants
                    </Button>
                </Box>

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

                {/* 🔍 Filters */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 2,
                        mb: 4,
                        bgcolor: "rgba(255,255,255,0.9)",
                        p: 2,
                        borderRadius: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                >
                    <FormControl sx={{ minWidth: 160, bgcolor: "aliceblue", borderRadius: 1 }}>
                        <InputLabel>Type</InputLabel>
                        <Select value={type} onChange={handleChange(setType)} label="Type">
                            <MenuItem value="">All</MenuItem>
                            {TYPES.map((t) => (
                                <MenuItem key={t} value={t}>
                                    {t}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 160, bgcolor: "aliceblue", borderRadius: 1 }}>
                        <InputLabel>Tags</InputLabel>
                        <Select
                            multiple
                            value={tags}
                            onChange={handleChange(setTags)}
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

                    <FormControl sx={{ minWidth: 160, bgcolor: "aliceblue", borderRadius: 1 }}>
                        <InputLabel>Sort by</InputLabel>
                        <Select value={sort} onChange={handleChange(setSort)} label="Sort by">
                            <MenuItem value="price-asc">Price (Low → High)</MenuItem>
                            <MenuItem value="price-desc">Price (High → Low)</MenuItem>
                            <MenuItem value="name-asc">Name (A–Z)</MenuItem>
                            <MenuItem value="name-desc">Name (Z–A)</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="outlined" color="secondary" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                </Box>

                {/* 🍲 Dishes Grid */}
                <Grid container spacing={3} justifyContent="center">
                    {filteredDishes.map((dish) => (
                        <Grid item key={dish.dishId}>
                            <Card
                                sx={{
                                    width: 280,
                                    borderRadius: 3,
                                    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                                    transition: "all 0.25s ease",
                                    "&:hover": { transform: "translateY(-6px)" },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={dish.pictureUrl || "/placeholder.jpg"}
                                    alt={dish.name}
                                    sx={{
                                        borderTopLeftRadius: 12,
                                        borderTopRightRadius: 12,
                                        objectFit: "cover",
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h6" fontWeight={700}>
                                        {dish.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ minHeight: 40, mb: 1 }}
                                    >
                                        {dish.description || "No description"}
                                    </Typography>
                                    <Typography variant="h6" color="primary" fontWeight={600}>
                                        € {dish.price.toFixed(2)}
                                    </Typography>
                                </CardContent>

                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<AddShoppingCartIcon />}
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

            {/* 🛒 Basket Floating Button */}
            <Box sx={{ position: "fixed", bottom: 30, right: 30, zIndex: 2000 }}>
                <Link to="/basket" style={{ textDecoration: "none" }}>
                    <Badge badgeContent={items.length} color="error">
                        <Fab color="secondary" sx={{ boxShadow: 4 }}>
                            <ShoppingCartIcon sx={{ fontSize: 28 }} />
                        </Fab>
                    </Badge>
                </Link>
            </Box>
        </Box>
    );
}
