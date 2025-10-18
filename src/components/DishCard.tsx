import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Chip,
    CardActions,
    Box,
} from "@mui/material";
import type {Dish} from "../model/Dish";

interface DishCardProps {
    dish: Dish;
    onPublish: (id: string) => void;
    onUnpublish: (id: string) => void;
    onEdit: (id: string) => void;
}

export default function DishCard({ dish, onPublish, onUnpublish, onEdit }: DishCardProps) {
    const getChipColor = (state: string) => {
        switch (state) {
            case "PUBLISHED":
                return "success";
            case "DRAFT":
                return "warning";
            case "UNPUBLISHED":
                return "error";
            default:
                return "default";
        }
    };

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
            <Box sx={{ position: "absolute", top: 8, left: 8 }}>
                <Chip label={dish.availability} color={getChipColor(dish.availability)} size="small" />
            </Box>

            <CardMedia
                component="img"
                height="160"
                image={dish.pictureUrl?.trim() || "/placeholder-image.jpg"}
                alt={dish.name}
                sx={{ objectFit: "cover" }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                    {dish.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {dish.description || "No description"}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                    € {dish.price?.toFixed(2)}
                </Typography>
            </CardContent>

            <CardActions>
                {dish.availability === "DRAFT" && (
                    <Button size="small" onClick={() => onEdit(dish.dishId)}>
                        ✏️ Edit
                    </Button>
                )}

                {(dish.availability === "DRAFT" || dish.availability === "UNPUBLISHED") && (
                    <Button size="small" color="success" onClick={() => onPublish(dish.dishId)}>
                        Publish
                    </Button>
                )}

                {dish.availability === "PUBLISHED" && (
                    <Button size="small" color="warning" onClick={() => onUnpublish(dish.dishId)}>
                        ⏸ Unpublish
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}
