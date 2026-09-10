import { createContext, useContext, useEffect, useState } from "react"
import { fetchCars } from "@/data/carsApi"

const AppContext = createContext(null)

const AppProvider = ({ children }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState("all")
    const [cars, setCars] = useState([])
    const [carsLoading, setCarsLoading] = useState(true)
    const [carsError, setCarsError] = useState(null)

    const toggleMenu = () => setIsMenuOpen(prev => !prev)

    const closeMenu = () => setIsMenuOpen(false)

    useEffect(() => {
        let isMounted = true

        const loadCars = async () => {
            try {
                const fetchedCars = await fetchCars()
                if (isMounted) setCars(fetchedCars)
            } catch (error) {
                if (isMounted) setCarsError(error.message)
            } finally {
                if (isMounted) setCarsLoading(false)
            }
        }

        loadCars()

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <AppContext.Provider value={{
            isMenuOpen,
            toggleMenu,
            closeMenu,
            selectedFilter,
            setSelectedFilter,
            cars,
            carsLoading,
            carsError,
        }}>
            {children}
        </AppContext.Provider>
    )

}

const useApp = () => {

    const context = useContext(AppContext)

    if (!context) {
        throw new Error("useApp must be used within AppProvider")
    }

    return context

}

export { AppProvider, useApp }
