import React, { useEffect } from "react";
import { useBasket } from "../context/BasketContext";
import api from "../api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Divider,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

// Zod schema for validation
const customerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    street: z.string().min(1, "Street is required"),
    number: z.string().min(1, "Number is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const BasketPage: React.FC = () => {
    const {
        items,
        restaurantId,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearBasket,
    } = useBasket();

    const navigate = useNavigate();

    const storedRestaurantId = restaurantId;

    useEffect(() => {
        console.log("🧺 Basket updated:", items);
    }, [items]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
    });

    const totalPrice = (items || []).reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    const placeOrder = async (data: CustomerFormData) => {
        if (!items || items.length === 0) {
            alert("🛒 Basket is empty");
            return;
        }
        if (!storedRestaurantId) {
            alert("Missing restaurant ID");
            return;
        }

        const payload = {
            restaurantId: storedRestaurantId,
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
            // 1️Place order
            const orderResponse = await api.post("/api/orders", payload);
            const orderId = orderResponse.data;

            // 2️Create Stripe payment session
            const paymentResponse = await api.post(`/api/orders/${orderId}/payment`);
            const checkoutUrl = paymentResponse.data;

            // 3️Redirect to Stripe Checkout
            window.location.href = checkoutUrl;
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
                <Typography
                    variant="subtitle1"
                    sx={{
                        mb: 4,
                        textAlign: "center",
                        color: "rgba(255,255,255,0.8)",
                    }}
                >
                    Review your order and enter your details to complete the purchase.
                </Typography>

                {!items || items.length === 0 ? (
                    <Box textAlign="center">
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#fff",
                                textAlign: "center",
                                fontSize: "1.2rem",
                                mt: 4,
                            }}
                        >
                            Your basket is empty.
                        </Typography>
                        {storedRestaurantId && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    mt: 3,
                                    py: 1,
                                    px: 4,
                                    borderRadius: 3,
                                    textTransform: "none",
                                    fontWeight: 600,
                                }}
                                onClick={() =>
                                    navigate(`/restaurants/${storedRestaurantId}`)
                                }
                            >
                                ← Back to Restaurant
                            </Button>
                        )}
                    </Box>
                ) : (
                    <>
                        {items.map((item) => (
                            <Card
                                key={item.dishId}
                                sx={{
                                    mb: 2,
                                    backdropFilter: "blur(8px)",
                                    background: "rgba(255,255,255,0.9)",
                                    borderRadius: 3,
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                                    p: 1,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            € {item.price.toFixed(2)} each
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <IconButton
                                            color="primary"
                                            onClick={() => decreaseQuantity(item.dishId)}
                                            size="small"
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography
                                            variant="body1"
                                            sx={{ mx: 1, minWidth: 20, textAlign: "center" }}
                                        >
                                            {item.quantity}
                                        </Typography>
                                        <IconButton
                                            color="primary"
                                            onClick={() => increaseQuantity(item.dishId)}
                                            size="small"
                                        >
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => removeItem(item.dishId)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}

                        <Divider sx={{ my: 4, bgcolor: "rgba(255,255,255,0.3)" }} />

                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: "#fff",
                                textAlign: "center",
                                mb: 2,
                            }}
                        >
                            💰 Total: € {totalPrice.toFixed(2)}
                        </Typography>

                        <form onSubmit={handleSubmit(placeOrder)}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    background: "rgba(255,255,255,0.95)",
                                    backdropFilter: "blur(8px)",
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                                    mt: 3,
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    🧍 Customer Info
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Name"
                                            fullWidth
                                            {...register("name")}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            {...register("email")}
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Street"
                                            fullWidth
                                            {...register("street")}
                                            error={!!errors.street}
                                            helperText={errors.street?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Number"
                                            fullWidth
                                            {...register("number")}
                                            error={!!errors.number}
                                            helperText={errors.number?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Postal Code"
                                            fullWidth
                                            {...register("postalCode")}
                                            error={!!errors.postalCode}
                                            helperText={errors.postalCode?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="City"
                                            fullWidth
                                            {...register("city")}
                                            error={!!errors.city}
                                            helperText={errors.city?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Country"
                                            fullWidth
                                            {...register("country")}
                                            error={!!errors.country}
                                            helperText={errors.country?.message}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box
                                sx={{
                                    position: "fixed",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    p: 2,
                                    background: "rgba(0,0,0,0.6)",
                                    backdropFilter: "blur(10px)",
                                    boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
                                    display: "flex",
                                    justifyContent: "center",
                                    zIndex: 3,
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        fontSize: "1.2rem",
                                        fontWeight: 600,
                                        py: 1.5,
                                        px: 5,
                                        borderRadius: 3,
                                        textTransform: "none",
                                    }}
                                >
                                    Place Order
                                </Button>
                            </Box>
                        </form>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default BasketPage;
