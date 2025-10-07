import React from "react";
import {useParams} from "react-router-dom";
import {Alert, Box, Card, CardContent, CardMedia, CircularProgress, Grid, Typography,} from "@mui/material";
import {useDishes} from "../hooks/useDishes";

const RestaurantDetailsPage: React.FC = () => {
    const {id} = useParams(); // restaurantId from URL
    const {data: dishes, isLoading, isError, error} = useDishes(id!);

    if (isLoading)
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundImage: 'url("../images/background.png")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <CircularProgress color="inherit"/>
            </Box>
        );

    if (isError)
        return (
            <Alert severity="error" sx={{mt: 5}}>
                {error.message}
            </Alert>
        );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: 'url("../images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                py: 6,
                px: 3,
            }}
        >
            {/* translucent overlay for readability */}
            <Box
                sx={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderRadius: 4,
                    p: 4,
                    boxShadow: 3,
                }}
            >
                <Typography
                    variant="h4"
                    align="center"
                    sx={{
                        mb: 4,
                        fontWeight: 700,
                        color: "#1a237e",
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                >
                    Our Dishes
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    {dishes?.map((dish) => (
                        <Grid item xs={12} sm={6} md={4} key={dish.dishId}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    transition: "transform 0.2s",
                                    "&:hover": {transform: "scale(1.03)"},
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={dish.pictureUrl || "/placeholder.jpg"}
                                    alt={dish.name}
                                />
                                <CardContent>
                                    <Typography variant="h6" sx={{fontWeight: 600}}>
                                        {dish.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {dish.description}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{mt: 1, fontWeight: 700, color: "#1a237e"}}
                                    >
                                        €{dish.price.toFixed(2)}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "text.secondary",
                                            display: "block",
                                            mt: 0.5,
                                        }}
                                    >
                                        {dish.type} • {dish.foodTags.join(", ")}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default RestaurantDetailsPage;
