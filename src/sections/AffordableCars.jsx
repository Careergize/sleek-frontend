import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { Gauge, Zap, Users, MessageCircle, ChevronRight } from "lucide-react"
import { useApp } from "@/context/AppContext"
import BookingModal from "@/components/BookingModal"

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
}

const AffordableCard = ({ car, onBook }) => (
    <div className="flex flex-col bg-white/[0.03] border border-white/10 rounded-sm overflow-hidden h-full hover:border-white/30 transition-colors duration-500 group">
        {/* Image Section */}
        <div className="relative overflow-hidden aspect-[16/10]">
            <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </div>

        <div className="flex flex-col gap-4 p-5 flex-grow">
            {/* Title & Brand */}
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                    {car.brand}
                </span>
                <h3 className="font-bold text-white text-lg tracking-tight">
                    {car.name}
                </h3>
            </div>

            {/* Specs - Minimalist style */}
            <div className="flex justify-between items-center py-3 border-y border-white/5">
                <div className="flex items-center gap-1.5">
                    <Gauge size={14} className="text-white/20" />
                    <span className="text-[11px] text-white/60">{car.specs.speed} km/h</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Zap size={14} className="text-white/20" />
                    <span className="text-[11px] text-white/60">{car.specs.hp} HP</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-white/20" />
                    <span className="text-[11px] text-white/60">{car.specs.seats}</span>
                </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">Daily</span>
                    <span className="text-white font-black text-base">
                        <span className="text-[10px] font-normal mr-1">AED</span>
                        {car.priceDay.toLocaleString()}
                    </span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">Monthly</span>
                    <span className="text-white/60 font-bold text-base">
                        <span className="text-[10px] font-normal mr-1">AED</span>
                        {car.priceMonth.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => onBook(car)}
                    className="flex-1 bg-white text-black font-black text-[11px] tracking-widest uppercase py-3 hover:bg-neutral-200 transition-colors cursor-pointer"
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

const AffordableCars = () => {
    const { cars: fleetCars } = useApp()
    const [selectedCar, setSelectedCar] = useState(null)

    // Limit to exactly 4 cars (1 row on desktop) for a cleaner look
    const displayCars = useMemo(() => {
        return fleetCars.filter(car => car.priceDay < 500).slice(0, 4)
    }, [fleetCars])

    return (
        <>
            <AnimatePresence>
                {selectedCar && (
                    <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />
                )}
            </AnimatePresence>

            <section id="affordable" className="py-24 bg-black">
                <div className="container-custom">
                    {/* Section Header - Clean & Minimal */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div className="max-w-2xl">
                            <span className="block text-white/30 text-[12px] font-black tracking-[0.4em] uppercase mb-4">
                                Affordable Luxury
                            </span>
                            <h2 className="text-white text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                                Accessible <span className="text-white/40 font-light">Performance.</span>
                            </h2>
                        </div>
                        <Link to="/cars" className="group flex items-center gap-2 text-white text-[12px] font-black tracking-widest uppercase no-underline border-b border-white/20 pb-1 hover:border-white transition-all">
                            View All Fleet
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Grid */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                    >
                        {displayCars.map((car) => (
                            <motion.div key={car.id} variants={cardVariants} transition={{ duration: 0.8 }}>
                                <AffordableCard car={car} onBook={setSelectedCar} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    )
}

export default AffordableCars