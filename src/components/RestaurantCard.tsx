import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from "@mui/material";

type RestaurantCardProps = {
    restaurant: any;
    onAddDish: () => void;
    onViewDishes: () => void;
    onToggleOpen: () => void;
};

export default function RestaurantCard({
                                           restaurant,
                                           onAddDish,
                                           onViewDishes,
                                           onToggleOpen,
                                       }: RestaurantCardProps) {
    return (
        <Card
            sx={{
                maxWidth: 600,
                mx: "auto",
                borderRadius: 3,
                boxShadow: 4,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardMedia
                component="img"
                height="250"
                image={restaurant.pictureUrl || "/placeholder-restaurant.jpg"}
                alt={restaurant.name}
                sx={{ objectFit: "cover" }}
            />

            <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {restaurant.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {restaurant.cuisineType} • {restaurant.contactEmail}
                </Typography>

                <Box mt={2}>
                    <Chip
                        label={restaurant.open ? "OPEN" : "CLOSED"}
                        color={restaurant.open ? "success" : "error"}
                        size="small"
                    />
                </Box>

                <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
                    <Button variant="contained" color="primary" onClick={onAddDish}>
                         Add Dish
                    </Button>
                    <Button variant="outlined" color="primary" onClick={onViewDishes}>
                         View Dishes
                    </Button>
                    <Button
                        variant="contained"
                        color={restaurant.open ? "error" : "success"}
                        onClick={onToggleOpen}
                    >
                        {restaurant.open ? "Close" : "Open"}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
