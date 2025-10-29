import { Grid, TextField, Typography, Box } from "@mui/material";
import type {UseFormRegister, FieldErrors} from "react-hook-form";
import type {CustomerFormData} from "../../types/CustomerForm.ts";

interface CustomerInfoFormProps {
    register: UseFormRegister<CustomerFormData>;
    errors: FieldErrors<CustomerFormData>;
}

export default function CustomerInfoForm({ register, errors }: CustomerInfoFormProps) {
    return (
        <Box
            sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                mt: 3,
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Customer Info
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Name"
                        fullWidth
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        fullWidth
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Street"
                        fullWidth
                        {...register("street")}
                        error={!!errors.street}
                        helperText={errors.street?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Number"
                        fullWidth
                        {...register("number")}
                        error={!!errors.number}
                        helperText={errors.number?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Postal Code"
                        fullWidth
                        {...register("postalCode")}
                        error={!!errors.postalCode}
                        helperText={errors.postalCode?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="City"
                        fullWidth
                        {...register("city")}
                        error={!!errors.city}
                        helperText={errors.city?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Country"
                        fullWidth
                        {...register("country")}
                        error={!!errors.country}
                        helperText={errors.country?.message}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
