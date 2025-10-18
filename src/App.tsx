import React from "react";
import { Route, Routes } from "react-router-dom";
import RestaurantListPage from "./pages/RestaurantListPage";
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";

import BasketPage from "./pages/BasketPage";
import CreateRestaurantPage from "./pages/CreateRestaurantPage";
import { RouteGuard } from "./components/RouteGuard";
import SecurityContextProvider from "./context/SecurityContextProvider";
import OwnerDashboard from "./pages/OwnerDashboard.tsx";
import OwnerDishesPage from "./pages/OwnerDishesPage.tsx";
import EditDishPage from "./pages/EditDishPage.tsx";

const App: React.FC = () => {
    return (
        <SecurityContextProvider>
            <Routes>
                <Route path="/" element={<RoleSelectionPage />} />
                <Route path="/customer" element={<RestaurantListPage />} />
                <Route path="/restaurants" element={<RestaurantListPage />} />
                <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
                <Route path="/basket" element={<BasketPage />} />

                {/* Owner routes */}
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
                <Route path="/owner/dishes/:dishId/edit"
                       element={<RouteGuard>
                           <EditDishPage />
                       </RouteGuard>}
                />
            </Routes>
        </SecurityContextProvider>
    );
};

export default App;
