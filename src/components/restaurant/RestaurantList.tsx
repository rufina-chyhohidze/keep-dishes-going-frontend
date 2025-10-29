import {
    Alert,
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRestaurants } from "../../hooks/useRestaurants.ts";

export function RestaurantList() {
    const { data: restaurants, isLoading, isError, error } = useRestaurants();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{ mt: 10 }}>
                {error.message}
            </Alert>
        );
    }

    return (
        <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"
        >
            {restaurants?.map((r) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={r.restaurantId}
                    display="flex"
                >
                    <Card
                        sx={{
                            width: "100%",
                            borderRadius: 3,
                            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                            transition: "transform 0.25s ease, box-shadow 0.25s ease",
                            "&:hover": {
                                transform: "translateY(-6px)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                            },
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <CardActionArea
                            onClick={() => navigate(`/restaurants/${r.restaurantId}`)}
                            disableRipple
                            sx={{
                                borderRadius: "inherit",
                                backgroundColor: "transparent",
                                "&:hover": { backgroundColor: "transparent" },
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={r.pictureUrl || "/placeholder.jpg"}
                                alt={r.name}
                                sx={{
                                    objectFit: "cover",
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                }}
                            />
                            <CardContent
                                sx={{
                                    textAlign: "center",
                                    py: 3,
                                    px: 2.5,
                                    flexGrow: 1,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#212121",
                                        mb: 0.5,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {r.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "rgba(0,0,0,0.6)",
                                        mb: 0.5,
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    {r.cuisineType} cuisine
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "rgba(0,0,0,0.6)",
                                        fontSize: "0.9rem",
                                        mb: 1,
                                    }}
                                >
                                    {r.contactEmail}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        fontWeight: 600,
                                        color: "#1565c0",
                                        mt: 1,
                                    }}
                                >
                                    ⏱ Avg. prep time: {r.defaultPreparationTime} min
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
