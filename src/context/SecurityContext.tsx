import { createContext } from 'react'
import type { User } from "../model/user"

export type SecurityContextType = {
    isInitialised: boolean
    isAuthenticated: () => boolean
    loggedInUser: User | undefined
    login: () => void
    logout: () => void
    getToken: () => string | undefined
}

export default createContext<SecurityContextType>({
    isInitialised: false,
    isAuthenticated: () => false,
    loggedInUser: undefined,
    login: () => {},
    logout: () => {},
    getToken: () => undefined,
})
