import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowRight, Plus } from "lucide-react"

// Asset Imports
import lamboAventador from "@/assets/cars/fleet/lamborghini_aventador.jpg"
import benely from "@/assets/cars/fleet/bentley_continental_gt.jpg"
import rangerover from "@/assets/cars/fleet/range_rover_autobiography.jpg"
import sonata from "@/assets/cars/fleet/sonataImg.jpg"

const fleetCategories = [
    {
        id: "luxury",
        type: "THE EXECUTIVE CLASS",
        description: "Redefining the gold standard of travel. Experience unrivaled prestige and British craftsmanship with our elite flagship models.",
        image: benely,
        variant: "large"
    },
    {
        id: "suv",
        type: "COMMANDING PRESENCE",
        description: "Master the landscape from a position of absolute power. Elite all-terrain luxury designed for those who refuse to blend in.",
        image: rangerover,
        variant: "large"
    },
    {
        id: "sports",
        type: "RAW ADRENALINE",
        description: "Precision engineering designed to ignite the senses. Break the boundaries of speed with our world-class supercar collection.",
        image: lamboAventador,
        variant: "large"
    },
    {
        id: "spacer", 
        variant: "empty"
    },
    {
        id: "economy",
        type: "SMART MOBILITY",
        description: "Modern efficiency meets premium comfort. High-performance economy models tailored for the sophisticated urban explorer.",
        image: sonata,
        variant: "large"
    },
]
const CategoryCard = ({ item }) => {
    if (item.variant === "empty") {
        return <div className="hidden lg:block" aria-hidden="true" />;
    }

    const isSmall = item.variant === "small";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            // whileTap handles the "touch" zoom for mobile devices
            whileTap={{ scale: 0.98 }} 
            className="flex flex-col bg-[#111111] border border-white/5 overflow-hidden group h-full cursor-pointer"
        >
            {!isSmall && (
                <div className="relative h-[280px] overflow-hidden">
                    <img 
                        src={item.image} 
                        alt={item.type} 
                        /* 
                           CHANGES:
                           1. Removed 'grayscale' and 'group-hover:grayscale-0'
                           2. Added 'transition-transform' with a custom duration
                           3. Changed scale from 105 to 110 for a more noticeable zoom
                        */
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 group-active:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />
                </div>
            )}

            <div className="p-8 flex flex-col flex-grow">
                {isSmall && (
                    <span className="text-[10px] tracking-[0.2em] text-gray-500 font-bold mb-4 uppercase">
                        {item.label}
                    </span>
                )}
                
                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                    {item.type}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                    {item.description}
                </p>

                {isSmall ? (
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                            {item.models}
                        </span>
                        <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-colors">
                            <Plus size={12} className="text-white" />
                        </div>
                    </div>
                ) : (
                    <Link 
                        to="/cars" 
                        className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-white uppercase group-hover:gap-4 transition-all no-underline"
                    >
                        View Specs <ArrowRight size={14} />
                    </Link>
                )}
            </div>
        </motion.div>
    )
}
const Fleet = () => {
    return (
        <section id="categories" className="py-24 bg-[#0A0A0A]">
            <div className="container-custom">
                
                {/* Header Section */}
                <div className="border-b border-white/10 pb-8 mb-12">
                   
                    <h2 className="text-5xl font-black text-white tracking-tight uppercase mt-2">
                        Fleet <span className="text-white/40 font-light">Selection.</span>
                    </h2>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fleetCategories.map((item) => (
                        <CategoryCard key={item.id} item={item} />
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Fleet;