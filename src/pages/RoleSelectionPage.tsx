import React from "react";
import {Box, Card, CardActionArea, CardContent, Container, Stack, Typography,} from "@mui/material";
import {useNavigate} from "react-router-dom";

const RoleSelectionPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                backgroundImage: 'url("../images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
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
            <Container
                maxWidth="md"
                sx={{position: "relative", zIndex: 2, color: "#fff"}}
            >
                <Stack spacing={4} alignItems="center">
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            textShadow: "0 3px 6px rgba(0,0,0,0.5)",
                        }}
                    >
                        Welcome to Keep Dishes Going 🍽️
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            color: "rgba(255,255,255,0.9)",
                            maxWidth: 600,
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                    >
                        Please choose how you’d like to continue
                    </Typography>

                    <Stack
                        direction={{xs: "column", sm: "row"}}
                        spacing={4}
                        sx={{mt: 3}}
                    >
                        {/* CUSTOMER CARD */}
                        <Card
                            sx={{
                                width: 280,
                                borderRadius: 6,
                                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                                background:
                                    "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,250,240,0.9) 100%)",
                                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                border: "2px solid rgba(255,193,7,0.5)",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: "0 14px 30px rgba(255,193,7,0.4)",
                                },
                            }}
                        >
                            <CardActionArea
                                onClick={() => navigate("/customer")}
                                sx={{
                                    borderRadius: "inherit",
                                    backgroundColor: "transparent",
                                    "&:hover": {backgroundColor: "transparent"},
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: "50%",
                                            mx: "auto",
                                            mb: 2,
                                            backgroundColor: "rgba(255, 213, 79, 0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "2rem",
                                        }}
                                    >
                                        🍴
                                    </Box>
                                    <Typography variant="h5" sx={{fontWeight: 700, color: "#795548"}}>
                                        I’m a Customer
                                    </Typography>
                                    <Typography variant="body2" sx={{mt: 1, color: "text.secondary"}}>
                                        Explore restaurants, view menus, and order your favorite dishes.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>


                        {/* OWNER CARD */}
                        <Card
                            sx={{
                                width: 280,
                                borderRadius: 6,
                                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                                background:
                                    "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,250,240,0.9) 100%)",
                                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                border: "2px solid rgba(255,193,7,0.5)",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: "0 14px 30px rgba(255,193,7,0.4)",
                                },
                            }}
                        >
                            <CardActionArea
                                onClick={() => window.location.href = "http://localhost:5173/owner/redirect"}

                                sx={{
                                    borderRadius: "inherit",
                                    backgroundColor: "transparent",
                                    "&:hover": {backgroundColor: "transparent"},
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: "50%",
                                            mx: "auto",
                                            mb: 2,
                                            backgroundColor: "rgba(255, 213, 79, 0.2)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "2rem",
                                        }}
                                    >
                                        👩‍🍳
                                    </Box>
                                    <Typography variant="h5" sx={{fontWeight: 700, color: "#795548"}}>
                                        I’m an Owner
                                    </Typography>
                                    <Typography variant="body2" sx={{mt: 1, color: "text.secondary"}}>
                                        Manage your restaurant, edit your dishes, and track orders.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default RoleSelectionPage;
