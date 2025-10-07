import React from "react";
import {Box, Container, Typography} from "@mui/material";
import {RestaurantList} from "../components/RestaurantList";

const RestaurantListPage: React.FC = () => {
    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                backgroundImage: 'url("../images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1,
                },
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    position: "relative",
                    zIndex: 2,
                    py: 8,
                    color: "#fff",
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        mb: 5,
                        textShadow: "0 3px 6px rgba(0,0,0,0.6)",
                    }}
                >
                    Discover Fine Restaurants 🍽️
                </Typography>

                <RestaurantList/>
            </Container>
        </Box>
    );
};

export default RestaurantListPage;
