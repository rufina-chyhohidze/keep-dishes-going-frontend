import { Box, Typography } from "@mui/material";
import OrderCard from "./OrderCard";
import { getTimeRemaining } from "../../utils/time.ts";

interface PendingOrdersSectionProps {
    orders: any[];
    timeLeft: Record<string, number>;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
}

export default function PendingOrdersSection({
                                                 orders,
                                                 timeLeft,
                                                 onAccept,
                                                 onReject,
                                             }: PendingOrdersSectionProps) {
    return (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>
                Pending Orders ({orders.length})
            </Typography>

            {orders.length === 0 ? (
                <Typography>No pending orders right now.</Typography>
            ) : (
                orders.map((order) => {
                    const remaining =
                        timeLeft[order.orderId] ?? getTimeRemaining(order.createdAt);
                    return (
                        <OrderCard
                            key={order.orderId}
                            order={order}
                            remaining={remaining}
                            onAccept={onAccept}
                            onReject={onReject}
                        />
                    );
                })
            )}
        </Box>
    );
}
