import { type PropsWithChildren, useEffect, useState } from 'react'
import SecurityContext from './SecurityContext'
import { addAccessTokenToAuthHeader, removeAccessTokenFromAuthHeader } from '../services/auth'
import { isExpired } from 'react-jwt'
import Keycloak from 'keycloak-js'
import type { User } from "../model/user"


const keycloak = new Keycloak({
    url: import.meta.env.VITE_KC_URL,
    realm: import.meta.env.VITE_KC_REALM,
    clientId: import.meta.env.VITE_KC_CLIENT_ID,
})

export default function SecurityContextProvider({ children }: PropsWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<User | undefined>(undefined)
    const [isInitialised, setIsInitialised] = useState(false)

    useEffect(() => {
        keycloak.init({ onLoad: 'check-sso' })
    }, [])

    // 👇 Keycloak event handlers
    keycloak.onReady = () => {
        setIsInitialised(true)
    }

    keycloak.onAuthSuccess = () => {
        if (keycloak.token) {
            addAccessTokenToAuthHeader(keycloak.token)
            updateUserFromToken()
        }
    }

    keycloak.onAuthLogout = () => {
        removeAccessTokenFromAuthHeader()
        setLoggedInUser(undefined)
    }

    keycloak.onAuthError = () => {
        removeAccessTokenFromAuthHeader()
        setLoggedInUser(undefined)
    }

    keycloak.onTokenExpired = () => {
        keycloak.updateToken(-1).then(() => {
            if (keycloak.token) {
                addAccessTokenToAuthHeader(keycloak.token)
                updateUserFromToken()
            }
        })
    }

    function login() {
        keycloak.login()
    }

    function logout() {
        keycloak.logout({ redirectUri: window.location.origin })
    }

    function isAuthenticated() {
        if (keycloak.token) {
            return !isExpired(keycloak.token)
        }
        return false
    }

    function getToken() {
        return keycloak.token
    }

    function updateUserFromToken() {
        if (!keycloak.idTokenParsed || !keycloak.tokenParsed) return

        const name = keycloak.idTokenParsed.given_name
        const roles = keycloak.tokenParsed.realm_access?.roles ?? []

        setLoggedInUser({ name, roles })
    }

    return (
        <SecurityContext.Provider
            value={{
                isInitialised,
                isAuthenticated,
                loggedInUser,
                login,
                logout,
                getToken,
            }}
        >
            {isInitialised ? (
                children
            ) : (
                <div
                    style={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.5rem",
                    }}
                >
                    Loading authentication...
                </div>
            )}
        </SecurityContext.Provider>
    )
}
