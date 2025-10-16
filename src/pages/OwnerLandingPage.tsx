import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, CircularProgress } from "@mui/material";
import SecurityContext from "../context/SecurityContext";
import { API_URL } from "../config";
import type { Restaurant } from "../types/Restaurant";

const OwnerLandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, getToken } = useContext(SecurityContext);
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/");
            return;
        }

        const token = getToken();
        if (!token) {
            console.warn("No token available");
            navigate("/");
            return;
        }

        fetch(`${API_URL}/owner/me/restaurant`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.status === 404) return null;
                if (!res.ok) throw new Error("Failed to fetch restaurant");
                return res.json();
            })
            .then((data) => {
                setRestaurant(data);
                setLoading(false);
                if (!data) navigate("/owner/create-restaurant");
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                navigate("/owner/create-restaurant");
            });
    }, [isAuthenticated, navigate, getToken]);

    if (loading) {
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Checking your restaurant...
                </Typography>
            </Container>
        );
    }

    if (!restaurant) return null;

    return (
        <Container sx={{ mt: 10 }}>
            <Typography variant="h4">
                Welcome back to your dashboard 🍽️
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
                Managing: {restaurant.name}
            </Typography>
        </Container>
    );
};

export default OwnerLandingPage;
