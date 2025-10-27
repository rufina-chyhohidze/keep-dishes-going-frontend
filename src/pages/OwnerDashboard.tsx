import { useState, useEffect } from "react";
import {
    CircularProgress,
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Collapse,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSecurityContext } from "../context/SecurityContext";
import { useOwnerRestaurant } from "../hooks/useOwnerRestaurant";
import RestaurantCard from "../components/RestaurantCard";
import DishForm from "../components/DishForm";
import { useDishesOwner } from "../hooks/useDishesOwner";
import { usePendingOrders } from "../hooks/usePendingOrders";
import api from "../api";
import { getTimeRemaining, formatTime } from "../utils/time";

export default function OwnerDashboard() {
    const { isAuthenticated, getToken } = useSecurityContext();
    const navigate = useNavigate();
    const token = getToken();
    const { restaurant, loading, handleToggleOpen } = useOwnerRestaurant(token);
    const [showAddForm, setShowAddForm] = useState(false);
    const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    const { createDish } = useDishesOwner(restaurant?.restaurantId ?? null, token);
    const { orders, loading: loadingOrders, error, setOrders } = usePendingOrders(
        restaurant?.restaurantId ?? null,
        token
    );

    const handleCreateDish = async (newDish: any) => {
        try {
            await createDish(newDish);
            setSnackbar({
                open: true,
                message: "Dish created successfully!",
                severity: "success",
            });
            setShowAddForm(false);
        } catch (err) {
            console.error("Failed to create dish", err);
            setSnackbar({
                open: true,
                message: "Failed to create dish. Please try again.",
                severity: "error",
            });
        }
    };

    const handleAcceptOrder = async (orderId: string) => {
        try {
            await api.post(`/api/orders/${orderId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
            setSnackbar({
                open: true,
                message: "Order accepted",
                severity: "success",
            });
        } catch (err) {
            console.error("Failed to accept order", err);
            setSnackbar({
                open: true,
                message: "Failed to accept order",
                severity: "error",
            });
        }
    };

    const handleRejectOrder = async (orderId: string) => {
        try {
            await api.post(
                `/api/orders/${orderId}/reject`,
                { reason: "Restaurant unavailable" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
            setSnackbar({
                open: true,
                message: "Order rejected",
                severity: "success",
            });
        } catch (err) {
            console.error("Failed to reject order", err);
            setSnackbar({
                open: true,
                message: "Failed to reject order",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () =>
        setSnackbar((prev) => ({ ...prev, open: false }));

    // Countdown timer effect
    useEffect(() => {
        if (!orders || orders.length === 0) return;

        const interval = setInterval(() => {
            setTimeLeft(() => {
                const updated: Record<string, number> = {};
                orders.forEach((order) => {
                    updated[order.orderId] = getTimeRemaining(order.createdAt);
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [orders]);

    // Auto remove expired orders
    useEffect(() => {
        orders.forEach((order) => {
            if (timeLeft[order.orderId] === 0) {
                setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
            }
        });
    }, [timeLeft]);

    if (!isAuthenticated()) {
        window.location.href = "/";
        return null;
    }

    if (loading || loadingOrders) {
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading your restaurant and orders...
                </Typography>
            </Container>
        );
    }

    if (!restaurant) {
        window.location.href = "/owner/create-restaurant";
        return null;
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
            <Container
                maxWidth="sm"
                sx={{
                    position: "relative",
                    zIndex: 2,
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                {/* Restaurant Card */}
                <RestaurantCard
                    restaurant={restaurant}
                    onAddDish={() => setShowAddForm(true)}
                    onViewDishes={() => navigate("/owner/dishes")}
                    onToggleOpen={handleToggleOpen}
                />

                {/* Add Dish Form */}
                <Collapse in={showAddForm}>
                    <Paper
                        elevation={4}
                        sx={{
                            mt: 2,
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: "background.paper",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            ➕ Add New Dish
                        </Typography>
                        <DishForm onSubmit={handleCreateDish} />
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => setShowAddForm(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Paper>
                </Collapse>

                {/* Pending Orders */}
                <Box mt={3}>
                    <Typography variant="h6" gutterBottom>
                        Pending Orders ({orders.length})
                    </Typography>

                    {orders.length === 0 ? (
                        <Typography>No pending orders right now.</Typography>
                    ) : (
                        orders.map((order) => {
                            const remaining = timeLeft[order.orderId] ?? getTimeRemaining(order.createdAt);
                            const isExpiring = remaining < 60000;

                            return (
                                <Card key={order.orderId} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Order #{order.orderId}
                                        </Typography>
                                        <Typography>
                                            Customer: {order.customerInfo.name}
                                        </Typography>
                                        <Typography>
                                            Email: {order.customerInfo.email}
                                        </Typography>
                                        <Typography>
                                            Items: {order.orderLines?.length ?? 0} | Total: €
                                            {(order.totalPrice ?? 0).toFixed(2)}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontWeight: isExpiring ? "bold" : "normal",
                                                color: isExpiring ? "error.main" : "text.primary",
                                                animation: isExpiring ? "pulse 1s infinite" : "none",
                                            }}
                                        >
                                            ⏳ Time left: {formatTime(remaining)}
                                        </Typography>

                                        <Stack direction="row" spacing={2} mt={2}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleAcceptOrder(order.orderId)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleRejectOrder(order.orderId)}
                                            >
                                                Reject
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </Box>

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
