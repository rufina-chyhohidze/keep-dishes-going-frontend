import { Box, Fab, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

interface FloatingBasketButtonProps {
    count: number;
}

export default function FloatingBasketButton({ count }: FloatingBasketButtonProps) {
    return (
        <Box sx={{ position: "fixed", bottom: 30, right: 30, zIndex: 2000 }}>
            <Link to="/basket" style={{ textDecoration: "none" }}>
                <Badge badgeContent={count} color="error">
                    <Fab color="secondary" sx={{ boxShadow: 4 }}>
                        <ShoppingCartIcon sx={{ fontSize: 28 }} />
                    </Fab>
                </Badge>
            </Link>
        </Box>
    );
}
