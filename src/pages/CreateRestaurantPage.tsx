import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SecurityContext from "../context/SecurityContext";
import { API_URL } from "../config";

type FormValues = {
    restaurantName: string;
    streetName: string;
    streetNumber: string;
    postalCode: string;
    city: string;
    country: string;
    contactEmail: string;
    pictureUrl: string;
    typeOfCuisine: string;
    defaultPreparationTime: number;
    openingHours: string;
};

const CreateRestaurantPage: React.FC = () => {
    const { register, handleSubmit } = useForm<FormValues>();
    const navigate = useNavigate();
    const { isAuthenticated, getToken } = useContext(SecurityContext);

    const onSubmit = async (data: FormValues) => {
        if (!isAuthenticated()) {
            alert("You must be logged in to create a restaurant");
            return;
        }

        const token = getToken();
        if (!token) {
            alert("Token missing, please log in again.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/restaurants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    defaultPreparationTime: Number(data.defaultPreparationTime),
                    openingHours: JSON.parse(data.openingHours || "{}"),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const id = await response.json();
            alert(`Restaurant created successfully! ID: ${id}`);
            navigate("/owner");
        } catch (err: any) {
            console.error("Failed to create restaurant", err);
            alert(`Failed to create restaurant: ${err.message}`);
        }
    };

    return (
        <div className="container" style={{ padding: "2rem" }}>
            <h1>Create Restaurant</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px" }}
            >
                <input {...register("restaurantName")} placeholder="Restaurant Name" required />
                <input {...register("streetName")} placeholder="Street Name" required />
                <input {...register("streetNumber")} placeholder="Street Number" required />
                <input {...register("postalCode")} placeholder="Postal Code" required />
                <input {...register("city")} placeholder="City" required />
                <input {...register("country")} placeholder="Country" required />
                <input {...register("contactEmail")} placeholder="Contact Email" type="email" required />
                <input {...register("pictureUrl")} placeholder="Picture URL" required />
                <input {...register("typeOfCuisine")} placeholder="Cuisine Type" required />
                <input {...register("defaultPreparationTime")} placeholder="Default Prep Time (min)" type="number" required />
                <textarea
                    {...register("openingHours")}
                    placeholder='Opening Hours (JSON) e.g. {"monday":"09:00-18:00"}'
                    rows={4}
                />
                <button type="submit" style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
                    Create Restaurant
                </button>
            </form>
        </div>
    );
};

export default CreateRestaurantPage;
