// src/hooks/useRestaurants.ts
import {useQuery} from "@tanstack/react-query";
import type {Restaurant} from "../types/Restaurant";
import {getAllRestaurants} from "../services/services";

export const useRestaurants = () =>
    useQuery<Restaurant[], Error>({
        queryKey: ["restaurants"],
        queryFn: getAllRestaurants,
    });

