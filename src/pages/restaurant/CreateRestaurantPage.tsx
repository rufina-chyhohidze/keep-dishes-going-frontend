import { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SecurityContext from "../../context/SecurityContext.tsx";
import { API_URL } from "../../config.tsx";
import { restaurantFormSchema, type RestaurantFormData } from "../../types/RestaurantForm.ts";

function CreateRestaurantPage() {
    const { isAuthenticated, getToken } = useContext(SecurityContext);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RestaurantFormData>({
        resolver: zodResolver(restaurantFormSchema),
        defaultValues: {
            defaultPreparationTime: 15,
            openingHours: '{"monday":"09:00-18:00"}',
        },
    });

    const onSubmit = async (data: RestaurantFormData) => {
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

            if (!response.ok) throw new Error(await response.text());

            await response.json();
            alert("Restaurant created successfully!");
            reset();
            navigate("/owner");
        } catch (err: any) {
            console.error("Failed to create restaurant", err);
            alert(`Failed to create restaurant: ${err.message}`);
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100vh",
                backgroundImage: 'url("../images/background.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.55)",
                    zIndex: 1,
                },
            }}
        >
            <Container
                maxWidth="sm"
                sx={{
                    position: "relative",
                    zIndex: 2,
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 6,
                }}
            >
                <Typography
                    variant="h4"
                    align="center"
                    sx={{
                        mb: 3,
                        fontWeight: 700,
                        color: "#5D4037",
                        textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                >
                     Register Your Restaurant
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <TextField
                            label="Restaurant Name"
                            {...register("restaurantName")}
                            error={!!errors.restaurantName}
                            helperText={errors.restaurantName?.message}
                            fullWidth
                        />

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Street Name"
                                {...register("streetName")}
                                error={!!errors.streetName}
                                helperText={errors.streetName?.message}
                                fullWidth
                            />
                            <TextField
                                label="Street Number"
                                {...register("streetNumber")}
                                error={!!errors.streetNumber}
                                helperText={errors.streetNumber?.message}
                                sx={{ width: "30%" }}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Postal Code"
                                {...register("postalCode")}
                                error={!!errors.postalCode}
                                helperText={errors.postalCode?.message}
                            />
                            <TextField
                                label="City"
                                {...register("city")}
                                error={!!errors.city}
                                helperText={errors.city?.message}
                            />
                        </Stack>

                        <TextField
                            label="Country"
                            {...register("country")}
                            error={!!errors.country}
                            helperText={errors.country?.message}
                            fullWidth
                        />

                        <TextField
                            label="Contact Email"
                            {...register("contactEmail")}
                            type="email"
                            error={!!errors.contactEmail}
                            helperText={errors.contactEmail?.message}
                            fullWidth
                        />

                        <TextField
                            label="Picture URL"
                            {...register("pictureUrl")}
                            error={!!errors.pictureUrl}
                            helperText={errors.pictureUrl?.message}
                            fullWidth
                        />

                        <TextField
                            label="Cuisine Type"
                            {...register("typeOfCuisine")}
                            error={!!errors.typeOfCuisine}
                            helperText={errors.typeOfCuisine?.message}
                            fullWidth
                        />

                        <TextField
                            label="Default Preparation Time (minutes)"
                            {...register("defaultPreparationTime", { valueAsNumber: true })}
                            type="number"
                            error={!!errors.defaultPreparationTime}
                            helperText={errors.defaultPreparationTime?.message}
                            fullWidth
                        />

                        <TextField
                            label='Opening Hours (JSON) e.g. {"monday":"09:00-18:00"}'
                            {...register("openingHours")}
                            multiline
                            rows={3}
                            error={!!errors.openingHours}
                            helperText={errors.openingHours?.message}
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                mt: 2,
                                fontWeight: "bold",
                                py: 1.2,
                                backgroundColor: "#FFB300",
                                "&:hover": { backgroundColor: "#FFA000" },
                            }}
                        >
                            Create Restaurant
                        </Button>
                    </Stack>
                </form>
            </Container>
        </Box>
    );
}

export default CreateRestaurantPage;
