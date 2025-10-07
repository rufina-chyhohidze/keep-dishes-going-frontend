import React from "react";
import {Route, Routes} from "react-router-dom";
import RestaurantListPage from "./pages/RestaurantListPage.tsx";
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage.tsx";
import RoleSelectionPage from "./pages/RoleSelectionPage.tsx";
import OwnerLandingPage from "./pages/OwnerLandingPage.tsx";


const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<RoleSelectionPage/>}/>
            <Route path="/customer" element={<RestaurantListPage/>}/>
            <Route path="/restaurants" element={<RestaurantListPage/>}/>
            <Route path="/restaurants/:id" element={<RestaurantDetailsPage/>}/>
            <Route path="/owner" element={<OwnerLandingPage/>}/>
        </Routes>
    );
};


export default App;
