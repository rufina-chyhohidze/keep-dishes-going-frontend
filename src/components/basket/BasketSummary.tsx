import { Box, Typography, Button } from "@mui/material";

interface BasketSummaryProps {
    totalPrice: number;
}

export default function BasketSummary({ totalPrice }: BasketSummaryProps) {
    return (
        <>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: "#fff",
                    textAlign: "center",
                    mb: 2,
                }}
            >
                 Total: € {totalPrice.toFixed(2)}
            </Typography>

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
        </>
    );
}
