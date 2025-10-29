import { z } from "zod";

export const customerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    street: z.string().min(1, "Street is required"),
    number: z.string().min(1, "Number is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
