import { z } from "zod";

export const restaurantFormSchema = z.object({
    restaurantName: z.string().min(1, "Restaurant name is required"),
    streetName: z.string().min(1, "Street name is required"),
    streetNumber: z.string().min(1, "Street number is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    contactEmail: z.string().email("Invalid email address"),
    pictureUrl: z.string().url("Must be a valid image URL"),
    typeOfCuisine: z.string().min(1, "Cuisine type is required"),
    defaultPreparationTime: z
        .union([
            z.string().regex(/^\d+$/, "Preparation time must be a number").transform(Number),
            z.number(),
        ])
        .refine((n) => n > 0, "Preparation time must be at least 1 minute"),
    openingHours: z
        .string()
        .refine(
            (val) => {
                try {
                    JSON.parse(val);
                    return true;
                } catch {
                    return false;
                }
            },
            { message: "Must be valid JSON (e.g. {\"monday\":\"09:00-18:00\"})" }
        ),
});

export type RestaurantFormData = z.infer<typeof restaurantFormSchema>;
