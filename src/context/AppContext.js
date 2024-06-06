import { createContext, useState } from "react"

const AppContext = createContext()

const AppContextWrapper = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    const globalObject = {
        user,
        setUser,
        token,
        setToken
    }

    return (
        <AppContext.Provider value={globalObject}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContextWrapper, AppContext }