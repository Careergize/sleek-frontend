import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Calendar, Car, Building2 } from "lucide-react"
import landingBg from "@/assets/background/landing_bg.webp"
import car1 from "@/assets/cars/landing_car_1.png"  
import car2 from "@/assets/cars/landing_car_2.png"
import car3 from "@/assets/cars/landing_car_3.png"

const cars = [car1, car2, car3]
const CAR_INTERVAL = 3800

const carVariants = {
    enter: { x: "20%", opacity: 0, scale: 1.1, filter: "blur(10px)" },
    center: { 
        x: 0, 
        opacity: 0.4, // Keep it subtle so text remains readable
        scale: 1, 
        filter: "blur(0px)",
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    },
    exit: { 
        x: "-10%", 
        opacity: 0, 
        filter: "blur(5px)",
        transition: { duration: 0.8 } 
    },
}

const Hero = () => {
    const [carIndex, setCarIndex] = useState(0)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
        const interval = setInterval(() => {
            setCarIndex(prev => (prev + 1) % cars.length)
        }, CAR_INTERVAL)
        return () => clearInterval(interval)
    }, [])

    const features = [
        { icon: <Calendar className="w-5 h-5 text-brand-gold" />, label: "TIMELESS FLEXIBILITY", title: "Daily, Weekly & Monthly", desc: "Tailored rental periods designed for the dynamic professional lifestyle." },
        { icon: <Car className="w-5 h-5 text-brand-gold" />, label: "ENGINEERED PERFORMANCE", title: "Luxury & Economy Fleet", desc: "A curated selection of the world's most advanced automotive marques." },
        { icon: <Building2 className="w-5 h-5 text-brand-gold" />, label: "INSTITUTIONAL RELIABILITY", title: "Corporate Leasing", desc: "High-efficiency fleet management solutions for enterprise-level operations." }
    ]

    return (
        <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-12 bg-[#070C16]">
            
            {/* BACKGROUND LAYER GROUP */}
            <div className="absolute inset-0 z-0">
                {/* Static Background Image */}
                <motion.img
                    src={landingBg}
                    className="w-full h-full object-cover opacity-30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                {/* SLIDING CAR BACKGROUND */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={carIndex}
                            src={cars[carIndex]}
                            variants={carVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="w-full max-w-6xl object-contain"
                        />
                    </AnimatePresence>
                </div>

                {/* Overlays to ensure text contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#070C16] via-transparent to-[#0B1120]" />
                <div className="absolute inset-0 bg-[#070C16]/40" /> 
            </div>

            {/* CONTENT LAYER */}
            <div className="container-custom relative z-10 flex flex-col items-center text-center">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[0.4em] text-gray-400 uppercase mb-4">
                    The New Standard in Mobility
                </motion.span>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-8xl md:text-[12rem] font-bold text-white tracking-tighter leading-none mb-6 drop-shadow-2xl"
                >
                    SLEEK
                </motion.h1>

                <hr className="w-24 border-gray-700 mb-8" />

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-2xl md:text-4xl font-semibold text-white mb-2">Premium Car Rental & Mobility Solutions</h2>
                    <p className="text-gray-400 italic font-light text-lg">Drive Beyond Expectations</p>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-6xl">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-sm text-left hover:border-brand-gold/30 transition-colors"
                        >
                            <div className="mb-6">{f.icon}</div>
                            <span className="text-[9px] tracking-widest text-gray-500 font-bold uppercase">{f.label}</span>
                            <h3 className="text-2xl font-bold text-white mt-2 mb-3 leading-tight">{f.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Hero