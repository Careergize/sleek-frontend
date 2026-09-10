import { motion } from "motion/react"
import { Car, BadgeDollarSign, HandshakeIcon } from "lucide-react"
import benz from "@/assets/icons/car_logos/benz.png"
import bmw from "@/assets/icons/car_logos/bmw.png"
import lambo from "@/assets/icons/car_logos/lambo.png"
import landRover from "@/assets/icons/car_logos/land_rover.png"
import mas from "@/assets/icons/car_logos/mas.png"
import mini from "@/assets/icons/car_logos/mini.png"
import porsche from "@/assets/icons/car_logos/porsche.png"
import rr from "@/assets/icons/car_logos/rr.png"
import pointerArrow from "@/assets/svg/pointer-bash.svg"

const logos = [
    { src: benz, alt: "Mercedes-Benz" },
    { src: bmw, alt: "BMW" },
    { src: lambo, alt: "Lamborghini" },
    { src: landRover, alt: "Land Rover" },
    { src: mas, alt: "Maserati" },
    { src: mini, alt: "Mini" },
    { src: porsche, alt: "Porsche" },
    { src: rr, alt: "Rolls-Royce" },
]

const features = [
    {
        icon: Car,
        title: "Wide Range of Cars",
        description: "Choose from economy to luxury options, including SUVs and 4x4s, ideal for daily drives and road trips across UAE.",
    },
    {
        icon: BadgeDollarSign,
        title: "Best Prices, Always.",
        description: "Choose from economy to luxury options, including SUVs and 4x4s, ideal for daily drives and road trips across UAE.",
    },
    {
        icon: HandshakeIcon,
        title: "Trusted Rental Experience",
        description: "Choose from economy to luxury options, including SUVs and 4x4s, ideal for daily drives and road trips across UAE.",
    },
]

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
}

const Brands = () => {

    return (
        <section id="brands" className="pt-20 pb-16 bg-brand-darker">
            <div className="container-custom flex flex-col gap-16">
                <div className="flex flex-col gap-10 mb-8">
                    <div className="flex flex-col items-center gap-3">
                        <span className="font-heading font-semibold text-brand-gray text-caption tracking-[0.3em] uppercase">
                            Why Choose Us
                        </span>

                        <div className="flex items-center gap-4">
                            <img
                                src={pointerArrow}
                                alt=""
                                className="shrink-0 invert opacity-50" // Added invert/opacity to match the white theme
                                style={{ transform: "scaleX(-1)" }}
                            />
                            {/* Changed text-brand-gold to text-white */}
                            <h2 className="font-heading font-bold text-white text-heading-lg md:text-heading-xl leading-tight text-center">
                                Why Sleek is the #1 Car Marketplace
                            </h2>
                            <img src={pointerArrow} alt="" className="shrink-0 invert opacity-50" />
                        </div>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-5 "
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-5% 0px" }}
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
                    >
                        {features.map((feature) => {

                            const FeatureIcon = feature.icon

                            return (
                                <motion.div
                                    key={feature.title}
                                    variants={cardVariants}
                                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                                    className="flex items-start gap-4 bg-brand-card rounded-xl p-6 border border-brand-border"
                                >
                                    <div className="w-14 h-14 rounded-full bg-brand-gold/15 flex items-center justify-center shrink-0">
                                        <FeatureIcon size={26} className="text-brand-gold" />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-heading font-bold text-brand-white text-heading-sm leading-snug">
                                            {feature.title}
                                        </h3>
                                        <p className="font-body text-body-sm text-brand-gray leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            )

                        })}
                    </motion.div>
                </div>

                <div
                    className="overflow-hidden"
                    style={{
                        maskImage: "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
                    }}
                >
                    <div
                        className="flex gap-14 items-center"
                        style={{
                            width: "max-content",
                            animation: "marquee 28s linear infinite",
                        }}
                        onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
                        onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}
                    >
                        {[...logos, ...logos].map((logo, i) => (
                            <div key={i} className="flex items-center justify-center px-3 shrink-0">
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="h-14 w-auto object-contain"
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )

}

export default Brands