import { Route, Routes } from "react-router-dom";
import RestaurantListPage from "./pages/restaurant/RestaurantListPage.tsx";
import RestaurantDishesPage from "./pages/restaurant/RestaurantDishesPage.tsx";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import BasketPage from "./pages/customer/BasketPage.tsx";
import CreateRestaurantPage from "./pages/restaurant/CreateRestaurantPage.tsx";
import { RouteGuard } from "./components/RouteGuard";
import SecurityContextProvider from "./context/SecurityContextProvider";
import OwnerDashboard from "./pages/owner /OwnerDashboard.tsx";
import OwnerDishesPage from "./pages/owner /OwnerDishesPage.tsx";
import EditDishPage from "./pages/owner /EditDishPage.tsx";
import PaymentSuccessPage from "./pages/customer/PaymentSuccessPage.tsx";
import OwnerRedirectPage from "./pages/owner /OwnerRedirectPage.tsx";

export default function App() {
    return (
        <SecurityContextProvider>
            <Routes>
                <Route path="/" element={<RoleSelectionPage />} />
                <Route path="/customer" element={<RestaurantListPage />} />
                <Route path="/restaurants" element={<RestaurantListPage />} />
                <Route path="/restaurants/:id" element={<RestaurantDishesPage />} />
                <Route path="/basket" element={<BasketPage />} />
                <Route path="/payment/success" element={<PaymentSuccessPage />} />

                <Route
                    path="/owner/create-restaurant"
                    element={
                        <RouteGuard>
                            <CreateRestaurantPage />
                        </RouteGuard>
                    }
                />
                <Route
                    path="/owner"
                    element={
                        <RouteGuard>
                            <OwnerDashboard />
                        </RouteGuard>
                    }
                />
                <Route
                    path="/owner/dishes"
                    element={
                        <RouteGuard>
                            <OwnerDishesPage />
                        </RouteGuard>
                    }
                />
                <Route
                    path="/owner/dishes/:dishId/edit"
                    element={
                        <RouteGuard>
                            <EditDishPage />
                        </RouteGuard>
                    }
                />
                <Route
                    path="/owner/redirect"
                    element={
                        <RouteGuard>
                            <OwnerRedirectPage />
                        </RouteGuard>
                    }
                />
            </Routes>
        </SecurityContextProvider>
    );
}
