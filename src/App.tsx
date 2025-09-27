// src/App.tsx
import React from "react";
import {Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RestaurantListPage from "./pages/RestaurantListPage.tsx";
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage.tsx";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/restaurants" element={<RestaurantListPage/>}/>
            <Route path="/restaurants/:id" element={<RestaurantDetailsPage/>}/>
        </Routes>
    );
};

export default App;
