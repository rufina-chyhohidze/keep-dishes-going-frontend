import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBasket } from "../context/BasketContext";
import { Box, Typography, CircularProgress } from "@mui/material";

const PaymentSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const navigate = useNavigate();
    const { clearBasket } = useBasket();

    useEffect(() => {
        clearBasket();

        const timer = setTimeout(() => {
            navigate("/customer");
        }, 2000);

        return () => clearTimeout(timer);
    }, [clearBasket, navigate]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(to bottom right, #00c6ff, #0072ff)",
                color: "#fff",
                textAlign: "center",
                p: 3,
            }}
        >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                Payment Successful!
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Thank you for your order!
            </Typography>
            {orderId && (
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                    Order ID: {orderId}
                </Typography>
            )}
            <Typography variant="body1" sx={{ mt: 2 }}>
                Redirecting you to your dashboard...
            </Typography>
            <CircularProgress sx={{ mt: 3, color: "#fff" }} />
        </Box>
    );
};

export default PaymentSuccessPage;
