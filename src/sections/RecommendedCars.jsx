import { useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { Gauge, Zap, Users, MessageCircle, ChevronRight } from "lucide-react"
import { useApp } from "@/context/AppContext"
import BookingModal from "@/components/BookingModal"

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
}

const RecommendedCard = ({ car, onBook }) => (
    <div className="flex flex-col bg-white/[0.02] border border-white/10 rounded-sm overflow-hidden h-full hover:border-white/40 transition-all duration-500 group">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[16/10]">
            <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>

        <div className="flex flex-col gap-4 p-6 flex-grow">
            {/* Header */}
            <div>
                <span className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase block mb-1">
                    {car.brand}
                </span>
                <h3 className="text-white text-xl font-bold tracking-tight">
                    {car.name}
                </h3>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5">
                <div className="flex flex-col items-center gap-1">
                    <Gauge size={14} className="text-white/30" />
                    <span className="text-[10px] text-white/60 font-medium">{car.specs.speed} km/h</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-white/5">
                    <Zap size={14} className="text-white/30" />
                    <span className="text-[10px] text-white/60 font-medium">{car.specs.hp} HP</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Users size={14} className="text-white/30" />
                    <span className="text-[10px] text-white/60 font-medium">{car.specs.seats} Seats</span>
                </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Per Day</span>
                    <p className="text-white font-black text-lg m-0">
                        <span className="text-[11px] font-normal mr-1">AED</span>
                        {car.priceDay.toLocaleString()}
                    </p>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="flex flex-col text-right">
                    <span className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Per Month</span>
                    <p className="text-white/70 font-bold text-lg m-0">
                        <span className="text-[11px] font-normal mr-1">AED</span>
                        {car.priceMonth.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => onBook(car)}
                    className="flex-1 bg-white text-black font-black text-[11px] tracking-widest uppercase py-3.5 hover:bg-neutral-200 transition-colors cursor-pointer border-none"
                >
                    Book Now
                </button>
                <Link
                    to={`/car/${car.id}`}
                    className="flex-1 border border-white/20 text-white font-black text-[11px] tracking-widest uppercase py-3.5 flex items-center justify-center hover:bg-white/10 transition-all no-underline"
                >
                    Details.
                </Link>
            </div>
        </div>
    </div>
)

const RecommendedCars = () => {
    const { cars: fleetCars } = useApp()
    const [selectedCar, setSelectedCar] = useState(null)

    return (
        <>
            <AnimatePresence>
                {selectedCar && (
                    <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />
                )}
            </AnimatePresence>

            <section id="recommended" className="py-24 bg-black">
                <div className="container-custom">
                    {/* Minimalist Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="flex flex-col gap-4">
                            <span className="text-white/30 text-[12px] font-black tracking-[0.4em] uppercase">
                                Editor's Choice
                            </span>
                            <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                                Recommended <br />
                                <span className="text-white/30 font-light">For You.</span>
                            </h2>
                        </div>
                        
                        <Link 
                            to="/cars" 
                            className="group flex items-center gap-3 text-white text-[12px] font-black tracking-widest uppercase no-underline border-b border-white/20 pb-2 hover:border-white transition-all"
                        >
                            Explore Fleet
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-10%" }}
                        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                    >
                        {fleetCars.slice(0, 4).map((car) => (
                            <motion.div
                                key={car.id}
                                variants={cardVariants}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <RecommendedCard car={car} onBook={setSelectedCar} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    )
}

export default RecommendedCars