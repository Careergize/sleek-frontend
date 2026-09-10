import { useState, useCallback } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"

import { AppProvider } from "@/context/AppContext"

import PageLoader from "@/components/PageLoader"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollToTop from "@/components/ScrollToTop"
import WhatsAppButton from "@/components/WhatsAppButton"

import Hero from "@/sections/Hero"
import Categories from "@/sections/Categories"
import RentalProcess from "@/sections/RentalProcess"
import Blog from "@/sections/Blog"
import FAQ from "@/sections/FAQ"
import Testimonials from "@/sections/Testimonials"
import AboutUs from "@/sections/AboutUs"
import Brands from "@/sections/Brands"
import AffordableCars from "@/sections/AffordableCars"
import RecommendedCars from "@/sections/RecommendedCars"

import CarOfferPage from "@/pages/CarOfferPage"
import Cars from "@/pages/Cars"
import LoginPage from "@/pages/Login"
import AdminDashboard from "@/pages/AdminDashboard"
import FleetManagement from "@/pages/FleetManagement"
import Customers from "@/pages/Customers"
import Analytics from "@/pages/Analytics"
import BookingResult from "@/pages/BookingResult"

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true)

    const handleLoaderComplete = useCallback(() => {
        setIsLoading(false)
    }, [])

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <PageLoader onComplete={handleLoaderComplete} />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Navbar />
                <main>
                    <Hero />
                    <AboutUs />
                    <Brands />
                    <Categories />
                    <AffordableCars />
                    <RecommendedCars />
                    <Testimonials />
                    <RentalProcess />
                    <Blog />
                    <FAQ />
                </main>
                <Footer />

                {/* WhatsApp Button only mounts when loading is finished */}
                {!isLoading && <WhatsAppButton />}
            </motion.div>
        </>
    )
}

const App = () => {
    return (
        <AppProvider>
            {/* Since you are using a custom domain, basename should be "/" */}
            <BrowserRouter basename="/">
                <ScrollToTop />

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cars" element={<Cars />} />
                    <Route path="/car/:id" element={<CarOfferPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/fleet" element={<FleetManagement />} />
                    <Route path="/admin/customers" element={<Customers />} />
                    <Route path="/admin/analytics" element={<Analytics />} />
                    <Route path="/booking/result" element={<BookingResult />} />
                </Routes>
            </BrowserRouter>
        </AppProvider>
    )
}

export default App