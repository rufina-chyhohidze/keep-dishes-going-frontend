import {type PropsWithChildren, useContext, useEffect} from 'react'
import SecurityContext from '../context/SecurityContext'

export function RouteGuard({children}: PropsWithChildren) {
    const {isInitialised, isAuthenticated, login} = useContext(SecurityContext)

    useEffect(() => {
        if (isInitialised && !isAuthenticated()) {
            login()
        }
    }, [isInitialised, isAuthenticated, login])

    if (!isAuthenticated()) {
        return <div style={{fontSize: '1.5rem', textAlign: 'center', marginTop: '2rem'}}>Authenticating...</div>
    }

    return children
}
