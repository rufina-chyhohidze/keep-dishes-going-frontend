import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

interface BasketItemProps {
    item: {
        dishId: string;
        name: string;
        price: number;
        quantity: number;
    };
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    removeItem: (id: string) => void;
}

export default function BasketItemCard({
                                           item,
                                           increaseQuantity,
                                           decreaseQuantity,
                                           removeItem,
                                       }: BasketItemProps) {
    return (
        <Card
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
                    <IconButton color="primary" onClick={() => decreaseQuantity(item.dishId)} size="small">
                        <RemoveIcon />
                    </IconButton>
                    <Typography
                        variant="body1"
                        sx={{ mx: 1, minWidth: 20, textAlign: "center" }}
                    >
                        {item.quantity}
                    </Typography>
                    <IconButton color="primary" onClick={() => increaseQuantity(item.dishId)} size="small">
                        <AddIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => removeItem(item.dishId)} size="small">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
}
