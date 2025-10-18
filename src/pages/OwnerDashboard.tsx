import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Paper,
    Snackbar,
    Alert,
    Button,
} from "@mui/material";
import DishForm from "../components/DishForm";
import api from "../api";
import { useSecurityContext } from "../context/SecurityContext";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
    const { isAuthenticated, getToken } = useSecurityContext();
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = "/";
            return;
        }

        const fetchRestaurant = async () => {
            try {
                const token = getToken();
                if (!token) {
                    window.location.href = "/";
                    return;
                }

                const res = await api.get("/owner/me/restaurant", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRestaurantId(res.data.restaurantId);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    window.location.href = "/owner/create-restaurant";
                } else if (err.response?.status === 401) {
                    window.location.href = "/";
                } else {
                    console.error("Failed to fetch restaurant", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [isAuthenticated, getToken]);

    const handleCreate = async (newDish: any) => {
        if (!restaurantId) return;
        try {
            await api.post(`/restaurants/${restaurantId}/dishes`, newDish, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            setSnackbar({
                open: true,
                message: "Dish created successfully!",
                severity: "success",
            });
        } catch (err) {
            console.error(" Failed to create dish", err);
            setSnackbar({
                open: true,
                message: "Failed to create dish. Please try again.",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading your dashboard...
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
                alignItems: "center",
                p: 4,
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 4,
                }}
            >
                <Box textAlign="center">
                    <Typography
                        variant="h3"
                        component="h1"
                        fontWeight="bold"
                        gutterBottom
                    >
                        🍽 Owner Dashboard
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Add new dishes to your restaurant menu below
                    </Typography>
                </Box>

                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        backgroundColor: "background.paper",
                    }}
                >
                    <DishForm onSubmit={handleCreate} />
                </Paper>

                <Box textAlign="center">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/owner/dishes")}
                    >
                        🍴 View All Dishes
                    </Button>
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
