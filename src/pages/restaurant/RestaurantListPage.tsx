import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { RestaurantList } from "../../components/restaurant/RestaurantList.tsx";

export default function RestaurantListPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                backgroundImage: 'url("/images/background.png")',
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
                    backgroundColor: "rgba(0, 0, 0, 0.55)",
                    zIndex: 1,
                },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 4,
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
                    backdropFilter: "blur(10px)",
                }}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    variant="outlined"
                    color="inherit"
                    sx={{
                        mb: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 2,
                        borderColor: "rgba(255,255,255,0.7)",
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.1)",
                            borderColor: "white",
                        },
                    }}
                >
                    Back
                </Button>

                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        mb: 6,
                        textShadow: "0 4px 10px rgba(0,0,0,0.5)",
                    }}
                >
                    🍽️ Our best restaurants just for you
                </Typography>

                <RestaurantList />
            </Container>
        </Box>
    );
}
