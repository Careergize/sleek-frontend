import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "motion/react"
import { ArrowUpRight, Send, Phone, Mail, MapPin, CheckCircle2, X } from "lucide-react"

const Footer = () => {
    const container = useRef(null)
    const isInView = useInView(container, { once: true, margin: "-10%" })

    const [formData, setFormData] = useState({
        "Full Name": "",
        "Email Address": "",
        "Phone number": ""
    })

    const [isSubmitted, setIsSubmitted] = useState(false)

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] } 
        }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const handleWhatsAppContact = (e) => {
        e.preventDefault()

        const message = `*Contact Inquiry - Sleek*%0A%0A` +
            `*Name:* ${formData["Full Name"] || "N/A"}%0A` +
            `*Email:* ${formData["Email Address"] || "N/A"}%0A` +
            `*Phone:* ${formData["Phone number"] || "N/A"}`

        const whatsappUrl = `https://wa.me/971506562366?text=${message}`
        
        window.open(whatsappUrl, '_blank')
        setIsSubmitted(true)
    }

    const handleInputChange = (label, value) => {
        setFormData(prev => ({ ...prev, [label]: value }))
    }

    return (
        <footer 
            ref={container}
            className="bg-[#050505] text-white overflow-hidden border-t border-white/5"
        >
            <AnimatePresence>
                {isSubmitted && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="relative w-full max-w-md bg-brand-card rounded-2xl p-10 text-center shadow-2xl border border-brand-gold/20"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <button 
                                onClick={() => setIsSubmitted(false)}
                                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                            >
                                <X size={20} />
                            </button>

                            <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="text-brand-gold" size={44} />
                            </div>

                            <h2 className="text-2xl font-black tracking-tighter uppercase mb-3">
                                Message Sent
                            </h2>
                            <p className="text-white/60 text-sm font-medium leading-relaxed mb-8">
                                Thank you for reaching out to Sleek. We have received your inquiry and our team will get back to you shortly.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-neutral-200 transition-all active:scale-95 cursor-pointer border-none uppercase tracking-widest text-[11px]"
                            >
                                Dismiss
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="p-8 md:p-20 lg:p-32 flex flex-col justify-center border-r border-white/5"
                >
                    <motion.div variants={fadeInUp} className="mb-16">
                        <span className="text-white/30 text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">
                            Contact / Inquiry
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] ">
                            Join the <br /> 
                            <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}>
                                Movement.
                            </span>
                        </h2>
                    </motion.div>

                    <form className="space-y-12 max-w-lg" onSubmit={handleWhatsAppContact}>
                        {["Full Name", "Email Address", "Phone number"].map((label) => (
                            <motion.div variants={fadeInUp} key={label} className="relative group">
                                <input 
                                    type={label === "Email Address" ? "email" : "text"} 
                                    required
                                    className="peer w-full bg-transparent border-b border-white/10 py-4 text-lg font-bold tracking-tight outline-none transition-colors focus:border-white placeholder-transparent"
                                    value={formData[label]}
                                    onChange={(e) => handleInputChange(label, e.target.value)}
                                    placeholder={label}
                                />
                                <label className="absolute left-0 top-4 text-white/20 text-xs font-black uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-white peer-valid:-top-6 peer-valid:text-white">
                                    {label}
                                </label>
                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-500 group-focus-within:w-full" />
                            </motion.div>
                        ))}

                        <motion.button 
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex items-center justify-between w-full py-6 px-10 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] overflow-hidden relative"
                            type="submit"
                        >
                            <span className="relative z-10">Contact US</span>
                            <Send size={16} className="relative z-10 transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" />
                            <div className="absolute inset-0 bg-neutral-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </motion.button>
                    </form>
                </motion.div>

                <div className="relative group h-[500px] lg:h-auto overflow-hidden">
                    <motion.div 
                        initial={{ scale: 1.2, filter: "grayscale(100%)" }}
                        animate={isInView ? { scale: 1, filter: "grayscale(100%) contrast(1.2)" } : {}}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2000')] bg-cover bg-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black lg:to-transparent" />
                    
                    <motion.div 
                        initial={{ x: 100, opacity: 0 }}
                        animate={isInView ? { x: 0, opacity: 1 } : {}}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="absolute bottom-12 left-8 md:left-12 p-8 border border-white/10 backdrop-blur-xl bg-black/40 max-w-xs"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <span className="w-12 h-[1px] bg-white/50 mt-2" />
                            <ArrowUpRight size={20} className="text-white/30" />
                        </div>
                        <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 mb-2">Regional HQ</h4>
                        <p className="text-xl font-bold leading-tight uppercase">Garhoud, Dubai <br />United Arab Emirates</p>
                    </motion.div>
                </div>
            </div>

            {/* --- UPDATED BOTTOM SECTION: CONTACT INFO & MAP --- */}
            <div className="border-t border-white/5 py-24 px-8 md:px-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Brand & Socials (As per image) */}
                    <div className="lg:col-span-3">
                        <h3 className="text-4xl font-black tracking-tighter uppercase mb-8 italic">Sleek.</h3>
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/sleekcarrental?igsh=emZhamI1bG8wZWtl"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 border border-white/10 flex items-center justify-center text-[10px] font-black hover:bg-white hover:text-black transition-all uppercase"
                            >
                                IG
                            </a>
                        </div>
                    </div>
                    <div className="lg:col-span-5 h-[300px] rounded-sm overflow-hidden border border-white/5 grayscale invert opacity-60 contrast-125 hover:opacity-100 transition-opacity duration-700">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.210408569833!2d55.34005137604368!3d25.275249577659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5c9443793f77%3A0x6b84013400045f4!2sHor%20Al%20Anz%20East%20-%20Dubai!5e0!3m2!1sen!2sae!4v1715243452425!5m2!1sen!2sae" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    {/* Contact Details */}
                    <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-8">
                        <div className="space-y-6">
                            <div>
                                <h5 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20 mb-4">Call Us</h5>
                                <a href="tel:00971507023905" className="text-sm font-bold hover:text-white transition-colors tracking-widest">+00971 50 702 3905</a>
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20 mb-4">Write to us</h5>
                                <a href="mailto:info@sleek-cars.com" className="text-sm font-bold hover:text-white transition-colors tracking-widest">info@sleek-cars.com</a>
                            </div>
                        </div>
                        
                        <div className="md:col-span-1">
                            <h5 className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20 mb-4">Address</h5>
                            <p className="text-sm font-bold leading-relaxed text-white/60 tracking-widest uppercase">
                                BUILDING-ASWAAQ-10, DAR AL ZAHIA 28, 15C STREET, HOR AL ANZ EAST DEIRA DUBAI, UAE
                            </p>
                        </div>
                    </div>

                    {/* Interactive Map */}
                    
                </div>
            </div>

            {/* Final Copyright */}
            <div className="p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black tracking-[0.3em] uppercase text-white/20">
                <span>© POWERD BY CAREERGIZE LLP</span>
                <span>Designed for the Elite</span>
            </div>
        </footer>
    )
}

export default Footer