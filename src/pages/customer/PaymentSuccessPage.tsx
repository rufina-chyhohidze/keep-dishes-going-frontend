import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

export default function PaymentSuccessPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/customer");
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

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
                alignItems: "center",
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
                    textAlign: "center",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 4,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Payment Successful!
                </Typography>
                <Typography variant="body1">
                    Redirecting you back to the customer page...
                </Typography>
            </Container>
        </Box>
    );
}
