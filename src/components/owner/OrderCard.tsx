import { Card, CardContent, Typography, Stack, Button } from "@mui/material";
import { formatTime } from "../../utils/time";

interface OrderCardProps {
    order: any;
    remaining: number;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
}

export default function OrderCard({ order, remaining, onAccept, onReject }: OrderCardProps) {
    const isExpiring = remaining < 60000;

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                    Order #{order.orderId}
                </Typography>
                <Typography>Customer: {order.customerInfo.name}</Typography>
                <Typography>Email: {order.customerInfo.email}</Typography>
                <Typography>
                    Items: {order.orderLines?.length ?? 0} | Total: €
                    {(order.totalPrice ?? 0).toFixed(2)}
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        fontWeight: isExpiring ? "bold" : "normal",
                        color: isExpiring ? "error.main" : "text.primary",
                        animation: isExpiring ? "pulse 1s infinite" : "none",
                    }}
                >
                    ⏳ Time left: {formatTime(remaining)}
                </Typography>

                <Stack direction="row" spacing={2} mt={2}>
                    <Button variant="contained" color="success" onClick={() => onAccept(order.orderId)}>
                        Accept
                    </Button>
                    <Button variant="contained" color="error" onClick={() => onReject(order.orderId)}>
                        Reject
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
