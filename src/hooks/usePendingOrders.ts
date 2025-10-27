import { useEffect, useState } from "react";
import api from "../api";

export function usePendingOrders(restaurantId: string | null, token: string | null) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!restaurantId || !token) return;

        const fetchOrders = async () => {
            try {
                const res = await api.get(
                    `/api/orders/${restaurantId}/pending`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setOrders(res.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [restaurantId, token]);

    return { orders, loading, error, setOrders };
}
