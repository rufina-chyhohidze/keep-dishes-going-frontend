import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useSecurityContext } from "../../context/SecurityContext";

export default function LogoutButton() {
    const { logout } = useSecurityContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Button
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            variant="contained"
            color="error"
            sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                color: "white",
                alignSelf: "flex-end",
                px: 3,
                "&:hover": {
                    backgroundColor: "#b71c1c",
                },
            }}
        >
            Log Out
        </Button>
    );
}
