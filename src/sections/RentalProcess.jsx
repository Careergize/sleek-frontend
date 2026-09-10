import { motion } from "motion/react"
import { 
    Calendar, 
    MapPin, 
    CreditCard, 
    LayoutDashboard, 
    LineChart, 
    UserCheck, 
    FileText, 
    Headphones 
} from "lucide-react"

const ecosystemFeatures = [
    {
        icon: Calendar,
        title: "Online Booking",
        description: "Instant reservation through our high-performance web and mobile portal.",
    },
    {
        icon: MapPin,
        title: "Live Vehicle Tracking",
        description: "GPS-integrated real-time telemetry for every asset in your fleet.",
    },
    {
        icon: CreditCard,
        title: "Digital Payments",
        description: "Secure, encrypted transactional flows for frictionless billing cycles.",
    },
    {
        icon: LayoutDashboard,
        title: "Mobile Dashboard",
        description: "Full fleet control in the palm of your hand via the SLEEK native app.",
    },
    {
        icon: LineChart,
        title: "Fleet Monitoring",
        description: "Advanced diagnostics and preventative maintenance scheduling.",
    },
    {
        icon: UserCheck,
        title: "Driver Management",
        description: "Performance metrics and safety compliance tracking for operators.",
    },
    {
        icon: FileText,
        title: "Automated Billing",
        description: "Seamless ERP integration for complex corporate accounting.",
    },
    {
        icon: Headphones,
        title: "24/7 Customer Support",
        description: "Priority concierge assistance for mission-critical mobility.",
    },
]

const RentalProcess = () => {
    return (
        <section id="process" className="py-24 bg-black">
            <div className="container-custom">
                
                {/* Header Section */}
                <div className="flex flex-col gap-4 mb-16">
                    <span className="text-white/40 text-[12px] font-black tracking-[0.4em] uppercase">
                        02 / TECHNOLOGY
                    </span>
                    <h2 className="text-white text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                        Smart Ecosystem
                    </h2>
                    <p className="text-white/60 text-lg max-w-2xl font-light leading-relaxed">
                        A centralized digital command center for all your mobility operations, 
                        engineered for real-time efficiency.
                    </p>
                </div>

                {/* Ecosystem Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-white/10">
                    {ecosystemFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.05 }}
                            className="group p-10 border-r border-b border-white/10 hover:bg-white/[0.02] transition-colors flex flex-col gap-6"
                        >
                            {/* Icon */}
                            <div className="text-white">
                                <feature.icon size={28} strokeWidth={1.5} />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-3">
                                <h3 className="text-white font-black text-[14px] tracking-widest uppercase">
                                    {feature.title}
                                </h3>
                                <p className="text-white/40 text-[13px] leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Detail Text */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 pt-10 border-t border-white/5"
                >
                    <p className="text-white/20 text-[11px] uppercase tracking-[0.2em] leading-loose text-center max-w-5xl mx-auto">
                        The car rental process begins with browsing and selecting a suitable vehicle based on budget, preference, and availability. 
                        Once details are verified, the rental terms and conditions are explained, and the agreement is signed. 
                        Payment is completed based on the chosen rental plan. The customer receives the vehicle in good condition with safety checks completed.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

export default RentalProcess