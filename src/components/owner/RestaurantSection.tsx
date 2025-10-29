import { Collapse, Paper, Box, Button, Typography } from "@mui/material";
import RestaurantCard from "../restaurant/RestaurantCard.tsx";
import DishForm from "../dish/DishForm.tsx";

interface RestaurantSectionProps {
    restaurant: any;
    showAddForm: boolean;
    onAddDishClick: () => void;
    onCancelAdd: () => void;
    onCreateDish: (dish: any) => void;
    onViewDishes: () => void;
    onToggleOpen: () => void;
}

export default function RestaurantSection({
    restaurant,
    showAddForm,
    onAddDishClick,
    onCancelAdd,
    onCreateDish,
    onViewDishes,
    onToggleOpen,
}: RestaurantSectionProps) {
    return (
        <>
            <RestaurantCard
                restaurant={restaurant}
                onAddDish={onAddDishClick}
                onViewDishes={onViewDishes}
                onToggleOpen={onToggleOpen}
            />

            <Collapse in={showAddForm}>
                <Paper
                    elevation={4}
                    sx={{
                        mt: 2,
                        p: 3,
                        borderRadius: 3,
                        backgroundColor: "background.paper",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        ➕ Add New Dish
                    </Typography>
                    <DishForm onSubmit={onCreateDish} />
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="outlined" color="secondary" onClick={onCancelAdd}>
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            </Collapse>
        </>
    );
}
