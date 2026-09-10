import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { Gauge, Zap, Users, MessageCircle, Tag } from "lucide-react"

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
}

const FleetCard = ({ car, index = 0, onBook }) => {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            transition={{
                duration: 0.6,
                delay: (index % 3) * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className="flex flex-col bg-brand-card rounded-2xl overflow-hidden"
        >
            {/* IMAGE */}
            <div className="relative overflow-hidden group/img" style={{ height: "210px" }}>
                <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, transparent 30%, #111827 100%)",
                    }}
                />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col gap-4 p-5">
                {/* TITLE */}
                <div>
                    <span className="font-heading text-caption font-semibold text-brand-gold tracking-[0.2em] uppercase">
                        {car.brand}
                    </span>
                    <h3 className="font-heading font-bold text-brand-white text-heading-sm leading-snug">
                        {car.name}
                    </h3>
                </div>

                {/* SPECS */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-brand-border">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center">
                            <Gauge size={14} className="text-brand-gray" />
                        </div>
                        <span className="text-caption text-brand-white font-medium">
                            {car.specs.speed} km/h
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center">
                            <Zap size={14} className="text-brand-gray" />
                        </div>
                        <span className="text-caption text-brand-white font-medium">
                            {car.specs.hp} HP
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center">
                            <Users size={14} className="text-brand-gray" />
                        </div>
                        <span className="text-caption text-brand-white font-medium">
                            {car.specs.seats} Seats
                        </span>
                    </div>
                </div>

                {/* PRICING */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-caption text-brand-gray">AED</span>
                        <span className="font-heading font-bold text-brand-gold text-heading-sm">
                            {car.priceDay.toLocaleString()}
                        </span>
                    </div>
                    <span className="text-caption text-brand-gray">/ day</span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                    <button
                        onClick={() => onBook?.(car)}
                        className="flex-1 flex items-center justify-center gap-2 bg-brand-gold text-brand-dark font-heading font-semibold text-body-sm py-2.5 px-4 rounded-lg hover:bg-brand-gold-dark transition-colors"
                    >
                        <MessageCircle size={15} />
                        Book Now
                    </button>

                    <Link
                        to={`/car/${car.id}`}
                        className="flex-1 flex items-center justify-center gap-2 border border-brand-border text-brand-white font-heading font-semibold text-body-sm py-2.5 px-4 rounded-lg hover:border-brand-gold hover:text-brand-gold transition-colors no-underline"
                    >
                        <Tag size={14} />
                        View Offer
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export default FleetCard