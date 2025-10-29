import { useState, useEffect } from "react";
import {
    CircularProgress,
    Container,
    Typography,
    Box,
    Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSecurityContext } from "../context/SecurityContext";
import { useOwnerRestaurant } from "../hooks/useOwnerRestaurant";
import { useDishesOwner } from "../hooks/useDishesOwner";
import { usePendingOrders } from "../hooks/usePendingOrders";
import { getTimeRemaining } from "../utils/time";
import api from "../api";

import RestaurantSection from "../components/owner/RestaurantSection";
import PendingOrdersSection from "../components/owner/PendingOrdersSection";
import DashboardSnackbar from "../components/owner/DashboardSnackbar";
import LogoutButton from "../components/common/LogoutButton";

export default function OwnerDashboard() {
    const { isAuthenticated, getToken } = useSecurityContext();
    const navigate = useNavigate();
    const token = getToken();
    const { restaurant, loading, handleToggleOpen } = useOwnerRestaurant(token);
    const { createDish } = useDishesOwner(restaurant?.restaurantId ?? null, token);
    const { orders, loading: loadingOrders, setOrders } = usePendingOrders(
        restaurant?.restaurantId ?? null,
        token
    );

    const [showAddForm, setShowAddForm] = useState(false);
    const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    useEffect(() => {
        if (!orders.length) return;
        const interval = setInterval(() => {
            setTimeLeft(() => {
                const updated: Record<string, number> = {};
                orders.forEach((o) => (updated[o.orderId] = getTimeRemaining(o.createdAt)));
                return updated;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [orders]);

    useEffect(() => {
        orders.forEach((o) => {
            if (timeLeft[o.orderId] === 0) {
                setOrders((prev) => prev.filter((p) => p.orderId !== o.orderId));
            }
        });
    }, [timeLeft]);

    const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

    const handleCreateDish = async (newDish: any) => {
        try {
            await createDish(newDish);
            setSnackbar({ open: true, message: "Dish created!", severity: "success" });
            setShowAddForm(false);
        } catch {
            setSnackbar({ open: true, message: "Failed to create dish", severity: "error" });
        }
    };

    const handleOrderAction = async (orderId: string, action: "accept" | "reject") => {
        try {
            const url =
                action === "accept"
                    ? `/api/orders/${orderId}/accept`
                    : `/api/orders/${orderId}/reject`;
            await api.post(
                url,
                action === "reject" ? { reason: "Restaurant unavailable" } : {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
            setSnackbar({
                open: true,
                message: `Order ${action}ed successfully!`,
                severity: "success",
            });
        } catch {
            setSnackbar({ open: true, message: `Failed to ${action} order`, severity: "error" });
        }
    };

    if (!isAuthenticated()) {
        navigate("/");
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
        navigate("/owner/create-restaurant");
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
                    backgroundColor: "rgba(255,255,255,0.9)",
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                >
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/")}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            color: "black",
                            borderColor: "rgba(0,0,0,0.3)",
                            "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.05)",
                                borderColor: "black",
                            },
                        }}
                    >
                        Back
                    </Button>

                    <LogoutButton />
                </Box>

                <RestaurantSection
                    restaurant={restaurant}
                    showAddForm={showAddForm}
                    onAddDishClick={() => setShowAddForm(true)}
                    onCancelAdd={() => setShowAddForm(false)}
                    onCreateDish={handleCreateDish}
                    onViewDishes={() => navigate("/owner/dishes")}
                    onToggleOpen={handleToggleOpen}
                />

                <PendingOrdersSection
                    orders={orders}
                    timeLeft={timeLeft}
                    onAccept={(id) => handleOrderAction(id, "accept")}
                    onReject={(id) => handleOrderAction(id, "reject")}
                />

                <DashboardSnackbar
                    open={snackbar.open}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    onClose={handleCloseSnackbar}
                />
            </Container>
        </Box>
    );
}
