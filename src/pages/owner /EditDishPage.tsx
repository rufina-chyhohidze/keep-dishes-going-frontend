import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Paper,
    Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../api.ts";
import EditDishForm from "../../components/dish/EditDishForm.tsx";
import { useSecurityContext } from "../../context/SecurityContext.tsx";

export default function EditDishPage() {
    const { dishId } = useParams();
    const { getToken } = useSecurityContext();
    const navigate = useNavigate();

    const [dish, setDish] = useState<any | null>(null);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();

                const restaurantRes = await api.get("/owner/me/restaurant", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRestaurantId(restaurantRes.data.restaurantId);

                const dishesRes = await api.get(
                    `/restaurants/${restaurantRes.data.restaurantId}/dishes/all`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const found = dishesRes.data.find((d: any) => d.dishId === dishId);
                setDish(found);
            } catch (err) {
                console.error("Failed to load dish:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dishId, getToken]);

    if (loading) {
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading dish information...
                </Typography>
            </Container>
        );
    }

    if (!dish) {
        return (
            <Container sx={{ mt: 10, textAlign: "center", color: "#fff" }}>
                <Typography variant="h5">Dish not found</Typography>
                <Button
                    sx={{ mt: 3 }}
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/owner/dishes")}
                >
                    Back to Dishes
                </Button>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                backgroundImage: 'url("/images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
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
                    boxShadow: "0 6px 25px rgba(0,0,0,0.3)",
                }}
            >
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/owner/dishes")}
                    color="primary"
                    variant="outlined"
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 2,
                    }}
                >
                    Back
                </Button>

                {/* Centered Header */}
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        textAlign: "center",
                        mb: 4,
                        color: "text.primary",
                    }}
                >
                     Edit Dish
                </Typography>

                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        backgroundColor: "background.paper",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                    }}
                >
                    <EditDishForm
                        initialValues={dish}
                        onSubmit={async (updatedDish) => {
                            const token = getToken();
                            await api.put(
                                `/restaurants/${restaurantId}/dishes/${dishId}`,
                                updatedDish,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            navigate("/owner/dishes");
                        }}
                    />
                </Paper>
            </Container>
        </Box>
    );
}
