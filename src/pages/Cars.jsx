import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Search, Car, Gauge, Zap, Users } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BookingModal from "@/components/BookingModal"
import pointerArrow from "@/assets/svg/pointer-bash.svg"

import { useApp } from "@/context/AppContext"

// --- REUSABLE SLEEK CARD COMPONENT ---
const SleekFleetCard = ({ car, onBook }) => {
    return (
        <div className="flex flex-col bg-white/[0.03] border border-white/10 rounded-sm overflow-hidden h-full hover:border-white/30 transition-colors duration-500 group">
            {/* Image Section */}
            <div className="relative overflow-hidden aspect-[16/10]">
                <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-4 p-5 flex-grow">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                        {car.brand}
                    </span>
                    <h3 className="font-bold text-white text-lg tracking-tight uppercase italic">
                        {car.name}
                    </h3>
                </div>

                {/* Technical Specs (With API Fallbacks) */}
                <div className="flex justify-between items-center py-3 border-y border-white/5">
                    <div className="flex items-center gap-1.5">
                        <Gauge size={14} className="text-white/20" />
                        <span className="text-[11px] text-white/60">
                            {car.specs?.speed || "240"} km/h
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Zap size={14} className="text-white/20" />
                        <span className="text-[11px] text-white/60">
                            {car.specs?.hp || "300"} HP
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-white/20" />
                        <span className="text-[11px] text-white/60">
                            {car.specs?.seats || "5"}
                        </span>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-white/40">Daily</span>
                        <span className="text-white font-black text-base italic">
                            <span className="text-[10px] font-normal mr-1 not-italic opacity-50">AED</span>
                            {car.priceDay.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-white/40">Monthly</span>
                        <span className="text-white/60 font-bold text-base italic">
                            <span className="text-[10px] font-normal mr-1 not-italic opacity-50">AED</span>
                            {car.priceMonth.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => onBook(car)}
                        className="flex-1 bg-white text-black font-black text-[11px] tracking-widest uppercase py-3 hover:bg-neutral-200 transition-colors cursor-pointer border-none"
                    >
                        Book
                    </button>
                    <Link
                        to={`/car/${car.id}`}
                        className="flex-1 border border-white/20 text-white font-black text-[11px] tracking-widest uppercase py-3 flex items-center justify-center hover:bg-white/10 transition-all no-underline"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </div>
    )
}

// --- MAIN PAGE COMPONENT ---
const CarsPage = () => {
    const { cars: fleetCars, carsLoading: loading, carsError: error } = useApp()
    const [bookingCar, setBookingCar] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedBrand, setSelectedBrand] = useState("All")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 15

    const brands = useMemo(() => {
        return ["All", ...new Set(fleetCars.map(car => car.brand))]
    }, [fleetCars])

    // ENHANCED SEARCH LOGIC
    const filteredCars = useMemo(() => {
        const query = searchQuery.toLowerCase().trim()
        
        return fleetCars.filter(car => {
            // 1. Check Brand Filter
            const matchesBrand = selectedBrand === "All" || car.brand === selectedBrand
            if (!matchesBrand) return false

            // 2. Check Search Query
            if (!query) return true

            const brandName = car.brand.toLowerCase()
            const carName = car.name.toLowerCase()
            const combinedName = `${brandName} ${carName}`
            
            // Fragment matching
            return query.split(" ").every(word => combinedName.includes(word))
        })
    }, [searchQuery, selectedBrand, fleetCars])

    const paginatedCars = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredCars.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredCars, currentPage])

    // Reset to first page when search or brand changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedBrand])

    return (
        <div className="min-h-screen bg-black">
            <AnimatePresence>
                {bookingCar && <BookingModal car={bookingCar} onClose={() => setBookingCar(null)} />}
            </AnimatePresence>

            <Navbar />

            <main>
                {/* Header & Search Section */}
                <section className="relative pt-40 pb-16 overflow-hidden">
                    <div className="container-custom relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4 mb-4"
                            >
                                <img src={pointerArrow} alt="" className="w-10 opacity-20 invert" style={{ transform: "scaleX(-1)" }} />
                                <span className="font-heading font-black text-white/30 text-[10px] tracking-[0.4em] uppercase">
                                    Premium Selection
                                </span>
                                <img src={pointerArrow} alt="" className="w-10 opacity-20 invert" />
                            </motion.div>
                            
                            <h1 className="font-heading font-black text-white text-5xl md:text-7xl uppercase tracking-tighter mb-12">
                                THE <span className="text-transparent" style={{ WebkitTextStroke: "1px white" }}>COLLECTION</span>
                            </h1>

                            {/* Brand Pills */}
                            {!loading && !error && (
                                <div className="w-full max-w-5xl mb-12">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {brands.map((brand) => (
                                            <button
                                                key={brand}
                                                onClick={() => {
                                                    setSelectedBrand(brand)
                                                    setSearchQuery("") 
                                                }}
                                                className={`px-6 py-2 rounded-none font-heading font-bold text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer border
                                                    ${selectedBrand === brand 
                                                        ? "bg-white text-black border-white" 
                                                        : "bg-transparent text-white/40 border-white/10 hover:border-white/40 hover:text-white"}`}
                                            >
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Search Input */}
                            <div className="w-full max-w-xl relative group">
                                <Search 
                                    className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${searchQuery ? 'text-white' : 'text-white/20'}`} 
                                    size={16} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="SEARCH BY MODEL OR BRAND..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-neutral-900/40 border border-white/5 rounded-none py-4 pl-14 pr-14 text-white font-heading text-xs tracking-widest focus:outline-none focus:border-white/30 transition-all uppercase placeholder:text-white/10"
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-tighter cursor-pointer"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section className="pb-32">
                    <div className="container-custom">
                        {/* Dynamic Sub-header */}
                        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-4 bg-white" />
                                <h2 className="font-heading font-black text-white text-sm uppercase italic tracking-widest">
                                    {searchQuery ? `Results for "${searchQuery}"` : `${selectedBrand} SERIES`}
                                </h2>
                            </div>
                            <span className="font-heading text-[10px] text-white/30 uppercase tracking-[0.2em]">
                                <span className="text-white font-bold">{filteredCars.length}</span> UNITS AVAILABLE
                            </span>
                        </div>

                        {/* Async Loading States */}
                        {loading && (
                            <div className="py-32 flex justify-center items-center">
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            </div>
                        )}

                        {error && (
                            <div className="py-20 text-center border border-red-500/20 bg-red-500/[0.02]">
                                <h3 className="font-heading text-red-400 text-lg uppercase font-black">Connection Error</h3>
                                <p className="text-white/40 text-[11px] uppercase tracking-wider mt-2">{error}</p>
                            </div>
                        )}

                        {/* Grid Content */}
                        {!loading && !error && (
                            paginatedCars.length > 0 ? (
                                <motion.div 
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {paginatedCars.map((car) => (
                                            <motion.div
                                                layout
                                                key={car.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <SleekFleetCard 
                                                    car={car} 
                                                    onBook={setBookingCar} 
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-32 flex flex-col items-center text-center border border-white/5 bg-white/[0.01]"
                                >
                                    <div className="relative mb-6">
                                        <Car size={48} className="text-white/5" />
                                        <Search size={20} className="text-white/20 absolute -bottom-2 -right-2" />
                                    </div>
                                    <h3 className="font-heading text-white text-xl uppercase italic font-black tracking-tighter">No matches found</h3>
                                    <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] mt-2">Adjust your filters or search terms</p>
                                    <button 
                                        onClick={() => {setSelectedBrand("All"); setSearchQuery("")}}
                                        className="mt-8 px-10 py-4 border border-white/20 text-white font-heading font-black text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-all cursor-pointer"
                                    >
                                        Reset Filters
                                    </button>
                                </motion.div>
                            )
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default CarsPage;