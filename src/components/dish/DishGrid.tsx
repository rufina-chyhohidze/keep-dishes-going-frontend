import { Grid, Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import type { Dish } from "../../model/dish.ts";

interface DishGridProps {
    dishes: Dish[];
    addItem: (item: any, restaurantId: string) => void;
    restaurantId: string;
}

export default function DishGrid({ dishes, addItem, restaurantId }: DishGridProps) {
    return (
        <Grid container spacing={3} justifyContent="center">
            {dishes.map((dish) => (
                <Grid item key={dish.dishId}>
                    <Card
                        sx={{
                            width: 280,
                            borderRadius: 3,
                            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                            transition: "all 0.25s ease",
                            "&:hover": { transform: "translateY(-6px)" },
                        }}
                    >
                        <CardMedia
                            component="img"
                            height="160"
                            image={dish.pictureUrl || "/placeholder.jpg"}
                            alt={dish.name}
                            sx={{
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                                objectFit: "cover",
                            }}
                        />
                        <CardContent>
                            <Typography variant="h6" fontWeight={700}>
                                {dish.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ minHeight: 40, mb: 1 }}
                            >
                                {dish.description || "No description"}
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight={600}>
                                € {dish.price.toFixed(2)}
                            </Typography>
                        </CardContent>

                        <Box sx={{ p: 2, pt: 0 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<AddShoppingCartIcon />}
                                disabled={dish.stockStatus === "OUT_OF_STOCK"}
                                onClick={() =>
                                    addItem(
                                        {
                                            dishId: dish.dishId,
                                            name: dish.name,
                                            price: dish.price,
                                            quantity: 1,
                                        },
                                        restaurantId
                                    )
                                }
                            >
                                {dish.stockStatus === "OUT_OF_STOCK"
                                    ? "Out of Stock"
                                    : "Add to Basket"}
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
