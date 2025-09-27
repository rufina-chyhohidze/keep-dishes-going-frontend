import React from "react";
import {Link} from "react-router-dom";
import {useRestaurants} from "../hooks/useRestaurants";

const RestaurantListPage: React.FC = () => {
    const {data: restaurants, isLoading, error} = useRestaurants();

    if (isLoading) return <div className="container">Loading...</div>;
    if (error) return <div className="container">Error loading restaurants</div>;

    return (
        <div className="container">
            <h1>Restaurants</h1>
            <ul>
                {restaurants?.map(r => (
                    <li key={r.id} className="card">
                        <Link to={`/restaurants/${r.id}`}>
                            <h2>{r.name}</h2>
                        </Link>
                        <p>{r.cuisine}</p>
                        <p>{r.dishes.length} dishes available</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantListPage;
