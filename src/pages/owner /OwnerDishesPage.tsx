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
    Snackbar,
    Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSecurityContext } from "../../context/SecurityContext.tsx";
import api from "../../api.ts";
import { useDishesOwner } from "../../hooks/useDishesOwner.ts";
import type { Dish } from "../../model/Dish.ts";

export default function OwnerDishesPage() {
    const { isAuthenticated, getToken } = useSecurityContext();
    const navigate = useNavigate();
    const token = getToken();

    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

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

    const {
        dishes,
        isLoading,
        isError,
        error,
        publishDish,
        unpublishDish,
        markInStock,
        markOutOfStock,
    } = useDishesOwner(restaurantId, token);

    const getChipColor = (state: string) =>
        state === "PUBLISHED"
            ? "success"
            : state === "DRAFT"
                ? "warning"
                : state === "UNPUBLISHED"
                    ? "error"
                    : "default";

    const handleAction = async (action: () => Promise<void>, success: string, fail: string) => {
        try {
            await action();
            setSnackbar({ open: true, message: success, severity: "success" });
        } catch {
            setSnackbar({ open: true, message: fail, severity: "error" });
        }
    };

    if (isLoading)
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading dishes...
                </Typography>
            </Container>
        );

    if (isError)
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <Typography color="error">
                    Failed to load dishes: {error?.message}
                </Typography>
            </Container>
        );

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                backgroundImage: 'url("/images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
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
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, color: "#fff" }}>
                <Box display="flex" justifyContent="flex-start" mb={2}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/owner")}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            px: 2,
                            borderColor: "rgba(255,255,255,0.7)",
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.1)",
                                borderColor: "white",
                            },
                        }}
                    >
                        Back to Dashboard
                    </Button>
                </Box>

                <Box display="flex" justifyContent="center" mb={4}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                            textAlign: "center",
                            textShadow: "0 4px 10px rgba(0,0,0,0.5)",
                        }}
                    >
                        Manage Your Dishes
                    </Typography>
                </Box>

                {dishes.length === 0 ? (
                    <Typography textAlign="center" color="rgba(255,255,255,0.8)">
                        No dishes found yet.
                    </Typography>
                ) : (
                    <Grid container spacing={3} justifyContent="center">
                        {dishes.map((dish: Dish) => (
                            <Grid item key={dish.dishId} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        position: "relative",
                                        borderRadius: 3,
                                        boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
                                        },
                                    }}
                                >
                                    <Box sx={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 1 }}>
                                        <Chip
                                            label={dish.availability}
                                            color={getChipColor(dish.availability)}
                                            size="small"
                                        />
                                        <Chip
                                            label={
                                                dish.stockStatus === "IN_STOCK"
                                                    ? "In Stock"
                                                    : "Out of Stock"
                                            }
                                            color={
                                                dish.stockStatus === "IN_STOCK" ? "success" : "error"
                                            }
                                            size="small"
                                        />
                                    </Box>

                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={dish.pictureUrl || "/placeholder-image.jpg"}
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

                                    <CardActions
                                        sx={{
                                            justifyContent: "space-between",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {dish.availability === "DRAFT" && (
                                            <Button size="small" onClick={() => navigate(`/owner/dishes/${dish.dishId}/edit`)}>
                                                 Edit
                                            </Button>
                                        )}
                                        {dish.availability !== "PUBLISHED" ? (
                                            <Button
                                                size="small"
                                                color="success"
                                                onClick={() =>
                                                    handleAction(
                                                        () => publishDish(dish.dishId),
                                                        "Dish published",
                                                        "Failed to publish"
                                                    )
                                                }
                                            >
                                                 Publish
                                            </Button>
                                        ) : (
                                            <Button
                                                size="small"
                                                color="warning"
                                                onClick={() =>
                                                    handleAction(
                                                        () => unpublishDish(dish.dishId),
                                                        "Dish unpublished",
                                                        "Failed to unpublish"
                                                    )
                                                }
                                            >
                                                ⏸ Unpublish
                                            </Button>
                                        )}
                                        <Button
                                            size="small"
                                            color={
                                                dish.stockStatus === "IN_STOCK" ? "error" : "success"
                                            }
                                            onClick={() =>
                                                handleAction(
                                                    () =>
                                                        dish.stockStatus === "IN_STOCK"
                                                            ? markOutOfStock(dish.dishId)
                                                            : markInStock(dish.dishId),
                                                    dish.stockStatus === "IN_STOCK"
                                                        ? "Marked Out of Stock"
                                                        : "Marked In Stock",
                                                    "Failed to update stock"
                                                )
                                            }
                                        >
                                            {dish.stockStatus === "IN_STOCK"
                                                ? "Mark Out of Stock"
                                                : "Mark In Stock"}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        severity={snackbar.severity}
                        variant="filled"
                        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
}
