import { createContext, useContext } from "react";
import type { User } from "../model/user";

export type SecurityContextType = {
    isInitialised: boolean;
    isAuthenticated: () => boolean;
    loggedInUser: User | undefined;
    login: () => void;
    logout: () => void;
    getToken: () => string | undefined;
};

const SecurityContext = createContext<SecurityContextType>({
    isInitialised: false,
    isAuthenticated: () => false,
    loggedInUser: undefined,
    login: () => {},
    logout: () => {},
    getToken: () => undefined,
});

export default SecurityContext;

export function useSecurityContext() {
    return useContext(SecurityContext);
}
