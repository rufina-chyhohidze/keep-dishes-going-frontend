import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Stack,
    Chip,
    Box
} from "@mui/material";

interface DishCardProps {
    dish: any;
    onPublish: (id: string) => void;
    onUnpublish: (id: string) => void;
    onEdit: (id: string) => void;
}

export default function DishCard({ dish, onPublish, onUnpublish, onEdit }: DishCardProps) {
    const isDraft = dish.availability === "DRAFT";
    const isPublished = dish.availability === "PUBLISHED";

    const imageUrl =
        dish.pictureUrl && dish.pictureUrl.trim() !== ""
            ? dish.pictureUrl
            : "/placeholder-image.jpg";

    return (
        <Card sx={{ maxWidth: 400, position: "relative" }}>
            {/* 🏷 Status chip */}
            <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>
                <Chip
                    label={isDraft ? "DRAFT" : "PUBLISHED"}
                    color={isDraft ? "warning" : "success"}
                    size="small"
                />
            </Box>

            <CardMedia
                component="img"
                height="140"
                image={imageUrl}
                alt={dish.name || "Dish image"}
            />

            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {dish.name || "Untitled Dish"}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {dish.description || "No description"}
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    € {(dish.price ?? 0).toFixed(2)}
                </Typography>

                <Stack direction="row" spacing={1}>
                    {isDraft && (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => onPublish(dish.dishId)}
                            >
                                Publish
                            </Button>
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => onEdit(dish.dishId)}
                            >
                                Edit
                            </Button>
                        </>
                    )}

                    {isPublished && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => onUnpublish(dish.dishId)}
                        >
                            Unpublish
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
