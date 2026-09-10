import { useState } from "react"
import { motion } from "motion/react"
import { Star, Users, Fuel, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SectionHeader from "@/components/SectionHeader"
import { useApp } from "@/context/AppContext"

const filters = [
    { id: "all", label: "All Cars" },
    { id: "luxury", label: "Luxury" },
    { id: "sport", label: "Sport" },
    { id: "suv", label: "SUV" },
]

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
}

const CarCard = ({ car, index }) => {

    return (
        <motion.div
            variants={cardVariants}
            transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="group bg-brand-card border border-brand-border hover:border-brand-gold/30 transition-all duration-300 hover:shadow-gold rounded-sm overflow-hidden"
        >
            <div className="relative overflow-hidden bg-brand-darker" style={{ height: "200px" }}>
                <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                    <Badge variant="default" className="text-[10px]">
                        From AED {car.priceDay.toLocaleString()}/day
                    </Badge>
                </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-heading-sm text-brand-white leading-tight">
                        {car.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                        <Star size={13} className="text-brand-gold fill-brand-gold" />
                        <span className="font-body text-caption text-brand-gray">
                            {car.overview?.gearbox || "Auto"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-brand-border">
                    <div className="flex flex-col items-center gap-1">
                        <Users size={15} className="text-brand-gold" />
                        <span className="font-body text-caption text-brand-gray">{car.specs.seats} seats</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Settings size={15} className="text-brand-gold" />
                        <span className="font-body text-caption text-brand-gray">{car.overview?.fuelType || "Petrol"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Fuel size={15} className="text-brand-gold" />
                        <span className="font-body text-caption text-brand-gray">{car.specs.fuel}</span>
                    </div>
                </div>

                <Button size="sm" className="w-full">
                    Book This Car
                </Button>
            </div>
        </motion.div>
    )

}


const TopFleet = () => {
    const { cars: fleetCars } = useApp()
    const [activeFilter, setActiveFilter] = useState("all")

    const filteredCars = activeFilter === "all"
        ? fleetCars
        : fleetCars.filter(car => car.category === activeFilter)

    return (
        <section id="fleet" className="section-padding bg-brand-darker">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
                    <SectionHeader
                        label="Top Fleet Showcase"
                        title="Our Most"
                        highlight="Popular Picks"
                        subtitle="Handpicked vehicles loved by our clients. Every car is thoroughly inspected and ready to go."
                    />

                    <div className="flex flex-wrap gap-2">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`font-heading font-semibold text-body-sm tracking-wider uppercase px-5 py-2 transition-all duration-200 cursor-pointer border ${
                                    activeFilter === filter.id
                                        ? "bg-brand-gold text-brand-dark border-brand-gold"
                                        : "bg-transparent text-brand-gray border-brand-border hover:border-brand-gold hover:text-brand-gold"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    key={activeFilter}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                >
                    {filteredCars.map((car, index) => (
                        <CarCard key={car.id} car={car} index={index} />
                    ))}
                </motion.div>

                <div className="flex justify-center mt-12">
                    <Button variant="outline" size="lg">
                        View Full Fleet
                    </Button>
                </div>
            </div>
        </section>
    )

}

export default TopFleet
