import { Box, Typography, Button } from "@mui/material";

interface BasketSummaryProps {
    totalPrice: number;
}

export default function BasketSummary({ totalPrice }: BasketSummaryProps) {
    return (
        <Box
            sx={{
                textAlign: "center",
                mt: 4,
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: "#fff",
                    mb: 2,
                }}
            >
                Total: € {totalPrice.toFixed(2)}
            </Typography>

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
                    boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
                }}
            >
                Place Order
            </Button>
        </Box>
    );
}
