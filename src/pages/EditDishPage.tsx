import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import DishForm from "../components/DishForm";
import { useSecurityContext } from "../context/SecurityContext";

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
                const restaurant = await api.get("/owner/me/restaurant", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRestaurantId(restaurant.data.restaurantId);

                const res = await api.get(
                    `/restaurants/${restaurant.data.restaurantId}/dishes/all`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const found = res.data.find((d: any) => d.dishId === dishId);
                setDish(found);
            } catch (err) {
                console.error("Failed to load dish", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dishId, getToken]);

    if (loading) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
    if (!dish) return <div style={{ textAlign: "center", marginTop: "2rem" }}> Dish not found</div>;

    return (
        <DishForm
            onSubmit={async (updatedDish) => {
                const token = getToken();
                await api.put(
                    `/restaurants/${restaurantId}/dishes/${dishId}`,
                    updatedDish,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                navigate("/owner/dishes");
            }}
            initialValues={dish}
        />
    );
}
