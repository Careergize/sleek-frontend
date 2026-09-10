import { useEffect } from "react"
import { motion } from "motion/react"

const LOADER_DURATION = 2400
const SPOKE_COUNT = 5

const WheelSvg = () => {
    const spokes = Array.from({ length: SPOKE_COUNT }, (_, i) => {
        const angle = (i * 360) / SPOKE_COUNT
        const rad = (angle * Math.PI) / 180

        // Adjusted coordinates for a realistic alloy spoke layout
        const x1 = 50 + 10 * Math.cos(rad)
        const y1 = 50 + 10 * Math.sin(rad)
        const x2 = 50 + 35 * Math.cos(rad)
        const y2 = 50 + 35 * Math.sin(rad)

        return { x1, y1, x2, y2 }
    })

    return (
        <svg viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">
            {/* Outer Tire / Rim Edge */}
            <circle cx="50" cy="50" r="46" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.1" />
            <circle cx="50" cy="50" r="42" stroke="#FFFFFF" strokeWidth="4" fill="none" />
            
            {/* Inner Lip of the Rim */}
            <circle cx="50" cy="50" r="38" stroke="#000000" strokeWidth="1" fill="none" opacity="0.5" />

            {/* Alloy Spokes */}
            {spokes.map((spoke, i) => (
                <g key={i}>
                    {/* Main Spoke Body */}
                    <line
                        x1={spoke.x1}
                        y1={spoke.y1}
                        x2={spoke.x2}
                        y2={spoke.y2}
                        stroke="#FFFFFF"
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                    {/* Spoke Detail / Groove */}
                    <line
                        x1={spoke.x1}
                        y1={spoke.y1}
                        x2={spoke.x2}
                        y2={spoke.y2}
                        stroke="#000000"
                        strokeWidth="1.5"
                        opacity="0.3"
                        strokeLinecap="round"
                    />
                </g>
            ))}

            {/* Center Hub / Lug Nut Area */}
            <circle cx="50" cy="50" r="10" fill="#FFFFFF" />
            <circle cx="50" cy="50" r="8" fill="#000000" />
            {/* Center Logo/Cap */}
            <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
        </svg>
    )
}

const PageLoader = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, LOADER_DURATION)
        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-black"
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="relative"
            >
                {/* Subtle Glow Effect behind the wheel */}
                <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
                <WheelSvg />
            </motion.div>

            <motion.p
                className="font-heading font-bold text-[10px] text-white tracking-[0.5em] uppercase italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                Igniting Engines
            </motion.p>
        </motion.div>
    )
}

export default PageLoader