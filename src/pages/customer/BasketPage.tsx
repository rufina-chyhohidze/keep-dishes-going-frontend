import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "../../context/BasketContext.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography, Button, Divider } from "@mui/material";
import api from "../../api.ts";
import BasketItemCard from "../../components/basket/BasketItemCard.tsx";
import BasketSummary from "../../components/basket/BasketSummary.tsx";
import CustomerInfoForm from "../../components/basket/CustomerInfoForm.tsx";
import { customerSchema, type CustomerFormData } from "../../types/CustomerForm.ts";

export default function BasketPage() {
    const { items, restaurantId, increaseQuantity, decreaseQuantity, removeItem } = useBasket();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("🧺 Basket updated:", items);
    }, [items]);

    const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
    });

    const totalPrice = (items || []).reduce((sum, i) => sum + i.price * i.quantity, 0);

    const placeOrder = async (data: CustomerFormData) => {
        if (!items?.length) {
            alert(" Basket is empty");
            return;
        }
        if (!restaurantId) {
            alert("Missing restaurant ID");
            return;
        }

        const payload = {
            restaurantId,
            ...data,
            orderLines: items.map((i) => ({
                dishId: i.dishId,
                quantity: i.quantity,
                priceAtCheckout: i.price,
            })),
            payment: {
                paymentId: crypto.randomUUID(),
                provider: "STRIPE",
                status: "PENDING",
            },
        };

        try {
            const orderResponse = await api.post("/api/orders", payload);
            const orderId = orderResponse.data;
            const paymentResponse = await api.post(`/api/orders/${orderId}/payment`);
            window.location.href = paymentResponse.data;
        } catch (err) {
            console.error("Failed to place order", err);
            alert("Failed to place order");
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                backgroundImage: 'url("../images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 3,
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
            <Box sx={{ maxWidth: 800, width: "100%", position: "relative", zIndex: 2 }}>
                <Typography
                    variant="h3"
                    sx={{
                        mb: 1,
                        fontWeight: 700,
                        textAlign: "center",
                        color: "#fff",
                    }}
                >
                    🧺 Your Basket
                </Typography>

                {!items?.length ? (
                    <Box textAlign="center" mt={4}>
                        <Typography sx={{ color: "#fff", fontSize: "1.2rem" }}>
                            Your basket is empty.
                        </Typography>
                        {restaurantId && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, py: 1, px: 4, borderRadius: 3 }}
                                onClick={() => navigate(`/restaurants/${restaurantId}`)}
                            >
                                ← Back to Restaurant
                            </Button>
                        )}
                    </Box>
                ) : (
                    <form onSubmit={handleSubmit(placeOrder)}>
                        {items.map((item) => (
                            <BasketItemCard
                                key={item.dishId}
                                item={item}
                                increaseQuantity={increaseQuantity}
                                decreaseQuantity={decreaseQuantity}
                                removeItem={removeItem}
                            />
                        ))}

                        <Divider sx={{ my: 4, bgcolor: "rgba(255,255,255,0.3)" }} />

                        <BasketSummary totalPrice={totalPrice} />
                        <CustomerInfoForm register={register} errors={errors} />
                    </form>
                )}
            </Box>
        </Box>
    );
}
