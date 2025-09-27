import React from "react";
import {useParams} from "react-router-dom";
import {useRestaurants} from "../hooks/useRestaurants";
import '../css/RestaurantDetails.css';

const RestaurantDetailsPage: React.FC = () => {
    const {id} = useParams();
    const {data: restaurants} = useRestaurants();
    const restaurant = restaurants?.find(r => r.id === id);

    if (!restaurant) return <div className="container">Restaurant not found</div>;

    return (
        <div className="restaurant-details-page">
            <div className="restaurant-header">
                {restaurant.picture && (
                    <div className="restaurant-photo-box">
                        <img src={restaurant.picture} alt={restaurant.name}/>
                    </div>
                )}
                <h1 className="restaurant-name">{restaurant.name}</h1>
                <p>Cuisine: {restaurant.cuisine}</p>
                <p>Opening hours: {restaurant.openingHours}</p>
            </div>

            <h2>Dishes</h2>
            <div className="dishes-list">
                {restaurant.dishes.map(d => (
                    <div key={d.id} className="dish-card">
                        {d.picture && (
                            <div className="dish-photo-box">
                                <img src={d.picture} alt={d.name}/>
                            </div>
                        )}
                        <h3>{d.name} ({d.status})</h3>
                        <p>{d.description}</p>
                        <p>Price: ${d.price}</p>
                        <p>Tags: {d.tags.join(", ")}</p>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default RestaurantDetailsPage;
