import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
} from "@mui/material";
import type {Dish} from "../../model/Dish.ts";

interface DishCardProps {
    dish: Dish
    isOwner: boolean;
    onAddToBasket?: (dishId: string) => void;
    onToggleStock?: (dishId: string, newStatus: "IN_STOCK" | "OUT_OF_STOCK") => void;
}

export const DishCard: React.FC<DishCardProps> = ({
                                                      dish,
                                                      isOwner,
                                                      onAddToBasket,
                                                      onToggleStock,
                                                  }) => {
    const isOutOfStock = dish.stockStatus === "OUT_OF_STOCK";

    const handleToggleStock = () => {
        const newStatus = isOutOfStock ? "IN_STOCK" : "OUT_OF_STOCK";
        onToggleStock?.(dish.dishId, newStatus);
    };

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: 300,
                borderRadius: 3,
                backdropFilter: "blur(8px)",
                background: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                },
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={dish.pictureUrl || "/placeholder.jpg"}
                alt={dish.name}
                sx={{
                    objectFit: "cover",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}
                >
                    {dish.name}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "text.secondary",
                        mb: 1.5,
                        minHeight: 40,
                    }}
                >
                    {dish.description || "No description available"}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: "primary.main",
                        mb: 2,
                    }}
                >
                    € {dish.price.toFixed(2)}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Chip
                        label={isOutOfStock ? "Out of Stock" : "In Stock"}
                        color={isOutOfStock ? "error" : "success"}
                        size="small"
                    />
                </Box>

                {!isOwner && (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isOutOfStock}
                        onClick={() => onAddToBasket?.(dish.dishId)}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                        }}
                    >
                        {isOutOfStock ? "Unavailable" : "Add to Basket"}
                    </Button>
                )}

                {isOwner && (
                    <Button
                        variant="outlined"
                        color={isOutOfStock ? "success" : "error"}
                        fullWidth
                        onClick={handleToggleStock}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                        }}
                    >
                        {isOutOfStock ? "Mark as In Stock" : "Mark as Out of Stock"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
