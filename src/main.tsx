import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BasketProvider } from "./context/BasketContext";
import App from "./App";

const queryClient = new QueryClient();

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#1976d2" },
        secondary: { main: "#f50057" },
    },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <BasketProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <App />
                    </ThemeProvider>
                </BasketProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
