import { Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface BackButtonProps {
    onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
    return (
        <Box sx={{ textAlign: "center", mb: 3 }}>
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                color="inherit"
                onClick={onClick}
                sx={{
                    color: "white",
                    borderColor: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "white",
                    },
                }}
            >
                Back to Restaurants
            </Button>
        </Box>
    );
}
