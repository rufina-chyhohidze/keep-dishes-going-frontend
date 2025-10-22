import { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSecurityContext } from "../context/SecurityContext";
import { useOwnerRestaurant } from "../hooks/useOwnerRestaurant";
import RestaurantCard from "../components/RestaurantCard";
import DishForm from "../components/DishForm";
import { useDishesOwner } from "../hooks/useDishesOwner";

export default function OwnerDashboard() {
    const { isAuthenticated, getToken } = useSecurityContext();
    const navigate = useNavigate();
    const token = getToken();
    const { restaurant, loading, handleToggleOpen } = useOwnerRestaurant(token);
    const [showAddForm, setShowAddForm] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    const { createDish } = useDishesOwner(restaurant?.restaurantId ?? null, token);

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

    const handleCloseSnackbar = () =>
        setSnackbar((prev) => ({ ...prev, open: false }));

    if (!isAuthenticated()) {
        window.location.href = "/";
        return null;
    }

    if (loading) {
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading your restaurant...
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
                <RestaurantCard
                    restaurant={restaurant}
                    onAddDish={() => setShowAddForm(true)}
                    onViewDishes={() => navigate("/owner/dishes")}
                    onToggleOpen={handleToggleOpen}
                />

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
