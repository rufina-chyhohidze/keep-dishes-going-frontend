import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Chip,
    Button,
    Box,
} from "@mui/material";
import api from "../api";
import { useSecurityContext } from "../context/SecurityContext";
import { useNavigate } from "react-router-dom";

export default function OwnerDishesPage() {
    const { isAuthenticated, getToken } = useSecurityContext();
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [dishes, setDishes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = "/";
            return;
        }

        const fetchRestaurant = async () => {
            try {
                const token = getToken();
                const res = await api.get("/owner/me/restaurant", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRestaurantId(res.data.restaurantId);
            } catch (err) {
                console.error("Failed to fetch restaurant", err);
            }
        };

        fetchRestaurant();
    }, [isAuthenticated, getToken]);

    useEffect(() => {
        if (restaurantId) {
            fetchDishes();
        }
    }, [restaurantId]);

    const fetchDishes = async () => {
        try {
            const token = getToken();
            const res = await api.get(`/restaurants/${restaurantId}/dishes/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDishes(res.data);
        } catch (err) {
            console.error("Failed to fetch dishes", err);
        } finally {
            setLoading(false);
        }
    };

    const getChipColor = (state: string) => {
        switch (state) {
            case "PUBLISHED":
                return "success";
            case "DRAFT":
                return "warning";
            case "UNPUBLISHED":
                return "error";
            default:
                return "default";
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading dishes...
                </Typography>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: 'url("../images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                py: 6,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                >
                    <Typography variant="h4" fontWeight="bold">
                        🍴 All Dishes
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate("/owner/dashboard")}
                    >
                        ⬅ Back to Dashboard
                    </Button>
                </Box>

                {dishes.length === 0 ? (
                    <Typography textAlign="center" color="text.secondary">
                        No dishes found yet.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {dishes.map((dish) => (
                            <Grid item key={dish.dishId} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        position: "relative",
                                        boxShadow: 3,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Box sx={{ position: "absolute", top: 8, left: 8 }}>
                                        <Chip
                                            label={dish.availability}
                                            color={getChipColor(dish.availability)}
                                            size="small"
                                        />
                                    </Box>

                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={
                                            dish.pictureUrl?.trim()
                                                ? dish.pictureUrl
                                                : "/placeholder-image.jpg"
                                        }
                                        alt={dish.name}
                                        sx={{ objectFit: "cover" }}
                                    />

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            noWrap
                                        >
                                            {dish.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {dish.description || "No description"}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            sx={{ mt: 1 }}
                                        >
                                            € {dish.price?.toFixed(2)}
                                        </Typography>
                                    </CardContent>

                                    <CardActions>
                                        <Button
                                            size="small"
                                            onClick={() => alert(`Edit ${dish.name} coming soon`)}
                                        >
                                            ✏️ Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => alert(`Delete ${dish.name} coming soon`)}
                                        >
                                            🗑 Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
