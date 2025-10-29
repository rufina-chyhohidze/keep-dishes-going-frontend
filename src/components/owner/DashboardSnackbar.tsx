import { Snackbar, Alert } from "@mui/material";

interface DashboardSnackbarProps {
    open: boolean;
    message: string;
    severity: "success" | "error";
    onClose: () => void;
}

export default function DashboardSnackbar({
                                              open,
                                              message,
                                              severity,
                                              onClose,
                                          }: DashboardSnackbarProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
}
