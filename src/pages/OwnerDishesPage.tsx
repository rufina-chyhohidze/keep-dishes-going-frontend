import React, { useEffect, useState } from "react";
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
    Snackbar,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSecurityContext } from "../context/SecurityContext";
import api from "../api";
import { useDishesOwner } from "../hooks/useDishesOwner";
import type { Dish } from "../model/Dish";

export default function OwnerDishesPage() {
    const { isAuthenticated, getToken } = useSecurityContext();
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = "/";
            return;
        }

        const fetchRestaurant = async () => {
            try {
                const res = await api.get("/owner/me/restaurant", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRestaurantId(res.data.restaurantId);
            } catch (err) {
                console.error("Failed to fetch restaurant", err);
            }
        };
        fetchRestaurant();
    }, [isAuthenticated, token]);

    const { dishes, isLoading, isError, error, publishDish, unpublishDish } =
        useDishesOwner(restaurantId, token);

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

    const handlePublish = async (dishId: string) => {
        try {
            await publishDish(dishId);
            setSnackbar({
                open: true,
                message: "Dish published successfully",
                severity: "success",
            });
        } catch {
            setSnackbar({
                open: true,
                message: "Failed to publish dish",
                severity: "error",
            });
        }
    };

    const handleUnpublish = async (dishId: string) => {
        try {
            await unpublishDish(dishId);
            setSnackbar({
                open: true,
                message: "⏸ Dish unpublished",
                severity: "success",
            });
        } catch {
            setSnackbar({
                open: true,
                message: "Failed to unpublish dish",
                severity: "error",
            });
        }
    };

    const handleEdit = (dishId: string) => {
        navigate(`/owner/dishes/${dishId}/edit`);
    };

    const handleCloseSnackbar = () =>
        setSnackbar((prev) => ({ ...prev, open: false }));

    if (isLoading) {
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading dishes...
                </Typography>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <Typography color="error">
                    Failed to load dishes: {error?.message}
                </Typography>
            </Container>
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
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                py: 6,
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
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, color: "#fff" }}>
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
                        onClick={() => navigate("/")}
                    >
                        ⬅ Back to Dashboard
                    </Button>
                </Box>

                {dishes.length === 0 ? (
                    <Typography textAlign="center" color="rgba(255,255,255,0.8)">
                        No dishes found yet.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {dishes.map((dish: Dish) => (
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
                                        <Typography variant="h6" gutterBottom noWrap>
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
                                        {dish.availability === "DRAFT" && (
                                            <Button size="small" onClick={() => handleEdit(dish.dishId)}>
                                                Edit
                                            </Button>
                                        )}
                                        {(dish.availability === "DRAFT" ||
                                            dish.availability === "UNPUBLISHED") && (
                                            <Button
                                                size="small"
                                                color="success"
                                                onClick={() => handlePublish(dish.dishId)}
                                            >
                                                Publish
                                            </Button>
                                        )}
                                        {dish.availability === "PUBLISHED" && (
                                            <Button
                                                size="small"
                                                color="warning"
                                                onClick={() => handleUnpublish(dish.dishId)}
                                            >
                                                ⏸ Unpublish
                                            </Button>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
}
