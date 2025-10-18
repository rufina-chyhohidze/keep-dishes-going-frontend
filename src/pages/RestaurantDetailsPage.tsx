import React from "react";
import { useParams, Link } from "react-router-dom";
import { useDishesCustomer } from "../hooks/useDishesCustomer";
import { useBasket } from "../context/BasketContext";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Grid,
    Divider,
    Badge,
    Fab,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const RestaurantDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const restaurantId = id ?? "";
    const { data: dishes, isLoading, isError, error } = useDishesCustomer(restaurantId);
    const { addItem, items } = useBasket();

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{ mt: 10 }}>
                {error?.message || "Failed to load dishes"}
            </Alert>
        );
    }

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                backgroundImage: 'url("../images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
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
            <Box sx={{ maxWidth: 1100, width: "100%", position: "relative", zIndex: 2 }}>
                <Typography
                    variant="h3"
                    sx={{ mb: 1, fontWeight: 700, textAlign: "center", color: "#fff" }}
                >
                    🍽️ Our Menu
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        mb: 3,
                        textAlign: "center",
                        color: "rgba(255,255,255,0.8)",
                    }}
                >
                    Pick your favorite dishes and add them to your basket.
                </Typography>

                <Divider sx={{ mb: 4, bgcolor: "rgba(255,255,255,0.3)" }} />

                <Grid container spacing={3} justifyContent="center">
                    {dishes?.map((dish) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={dish.dishId}
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
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
                                        }}
                                    >
                                        € {dish.price.toFixed(2)}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddShoppingCartIcon />}
                                        sx={{
                                            py: 1,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            borderRadius: 2,
                                        }}
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
                                        Add to Basket
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box
                sx={{
                    position: "fixed",
                    bottom: 30,
                    right: 30,
                    zIndex: 2000,
                }}
            >
                <Link to="/basket" style={{ textDecoration: "none" }}>
                    <Badge
                        badgeContent={items.length}
                        color="error"
                        overlap="rectangular"
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        sx={{
                            "& .MuiBadge-badge": {
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                transform: "translate(25%, -25%)",
                            },
                        }}
                    >
                        <Fab
                            color="secondary"
                            sx={{
                                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                                "&:hover": {
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                                },
                            }}
                        >
                            <ShoppingCartIcon sx={{ fontSize: 28 }} />
                        </Fab>
                    </Badge>
                </Link>
            </Box>
        </Box>
    );
};

export default RestaurantDetailsPage;
