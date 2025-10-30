import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSecurityContext } from "../../context/SecurityContext.tsx";
import api from "../../api.ts";
import { CircularProgress, Container, Typography } from "@mui/material";

function OwnerRedirectPage() {
    const { isAuthenticated, getToken } = useSecurityContext();
    const navigate = useNavigate();

    useEffect(() => {
        async function setupOwner() {
            if (!isAuthenticated()) {
                navigate("/");
                return;
            }

            const token = getToken();
            if (!token) return;

            try {
                await api.post("/owner/signup", {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const res = await api.get("/owner/me/restaurant", {
                    headers: { Authorization: `Bearer ${token}` },
                    validateStatus: () => true,
                });

                if (res.status === 200) {
                    navigate("/owner");
                } else if (res.status === 404) {
                    navigate("/owner/create-restaurant");
                } else {
                    console.error("Unexpected status:", res.status);
                    navigate("/");
                }
            } catch (err) {
                console.error("Error checking owner:", err);
                navigate("/");
            }
        }

        setupOwner();
    }, [isAuthenticated, getToken, navigate]);

    return (
        <Container sx={{ mt: 10, textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
                Preparing your dashboard...
            </Typography>
        </Container>
    );
}

export default OwnerRedirectPage;
