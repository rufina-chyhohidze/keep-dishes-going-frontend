import React, { useEffect } from "react";
import { useBasket } from "../context/BasketContext";
import api from "../api.ts";
import { useForm } from "react-hook-form";
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

interface CustomerFormData {
    name: string;
    email: string;
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
}

const BasketPage: React.FC = () => {
    const {
        items,
        restaurantId,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearBasket,
    } = useBasket();

    useEffect(() => {
        console.log("🧺 Basket updated:", items);
    }, [items]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CustomerFormData>({
        mode: "onSubmit", // ensures validation on submit
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
                provider: "PAYPAL",
                status: "PENDING",
            },
        };

        try {
            await api.post("/api/orders", payload);
            alert("✅ Order placed successfully!");
            clearBasket();
        } catch (err) {
            console.error("Failed to place order", err);
            alert("Failed to place order");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: 'url("../images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 3,
            }}
        >
            <Box sx={{ maxWidth: 800, width: "100%" }}>
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

                        {/* FORM START */}
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
                                            {...register("name", { required: "Name is required" })}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Invalid email address",
                                                },
                                            })}
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Street"
                                            fullWidth
                                            {...register("street", { required: "Street is required" })}
                                            error={!!errors.street}
                                            helperText={errors.street?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Number"
                                            fullWidth
                                            {...register("number", { required: "Number is required" })}
                                            error={!!errors.number}
                                            helperText={errors.number?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Postal Code"
                                            fullWidth
                                            {...register("postalCode", { required: "Postal code is required" })}
                                            error={!!errors.postalCode}
                                            helperText={errors.postalCode?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="City"
                                            fullWidth
                                            {...register("city", { required: "City is required" })}
                                            error={!!errors.city}
                                            helperText={errors.city?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Country"
                                            fullWidth
                                            {...register("country", { required: "Country is required" })}
                                            error={!!errors.country}
                                            helperText={errors.country?.message}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Fixed bottom button INSIDE the form ✅ */}
                            <Box
                                sx={{
                                    position: "fixed",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    p: 2,
                                    background: "rgba(255,255,255,0.95)",
                                    backdropFilter: "blur(10px)",
                                    boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
                                    display: "flex",
                                    justifyContent: "center",
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
                                    🛍 Place Order
                                </Button>
                            </Box>
                        </form>
                        {/* FORM END */}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default BasketPage;
