import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import {
    MapPin, Calendar, Gauge, Zap, Users, 
    ChevronDown, ChevronLeft, Check, Shield, Fuel, Settings2,
    Car, Clock
} from "lucide-react"
import { faqItems } from "@/data/faq"
import { useApp } from "@/context/AppContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BookingModal from "@/components/BookingModal"

// --- THEMED SUB-COMPONENTS ---

const OverviewRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
        <div className="flex items-center gap-3 text-white/40">
            <Icon size={14} className="shrink-0" />
            <span className="text-[11px] uppercase tracking-wider font-medium">{label}</span>
        </div>
        <span className="text-[12px] font-bold text-white italic">{value}</span>
    </div>
)

const FaqItem = ({ item }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="border border-white/10 rounded-sm overflow-hidden mb-2">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer border-none"
            >
                <span className="font-bold text-white text-[13px] uppercase tracking-tight italic">
                    {item.question}
                </span>
                <ChevronDown size={16} className={`text-white/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-0 bg-white/[0.01]">
                            <p className="text-[13px] text-white/60 leading-relaxed max-w-2xl">
                                {item.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const FeatureAccordion = ({ title, items }) => {
    const [open, setOpen] = useState(title === "Interior features")
    return (
        <div className="border border-white/10 rounded-sm overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] transition-colors border-none cursor-pointer"
            >
                <span className="font-bold text-white text-[11px] uppercase tracking-[0.1em]">{title}</span>
                <ChevronDown size={14} className={`text-white/20 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 bg-black grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                            {items.map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                    <Check size={12} className="text-white/40" />
                                    <span className="text-[12px] text-white/60">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const SimilarCard = ({ car, onBook }) => (
    <div className="flex flex-col bg-white/[0.03] border border-white/10 rounded-sm overflow-hidden shrink-0 w-72 hover:border-white/30 transition-colors duration-500 group">
        <div className="relative overflow-hidden aspect-[16/10]">
            <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </div>

        <div className="flex flex-col gap-4 p-5 flex-grow">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                    {car.brand}
                </span>
                <h3 className="font-bold text-white text-lg tracking-tight uppercase italic">
                    {car.name}
                </h3>
            </div>

            <div className="flex items-center gap-4 py-3 border-y border-white/5">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">Daily</span>
                    <span className="text-white font-black text-base italic">
                        <span className="text-[10px] font-normal mr-1 not-italic opacity-50">AED</span>
                        {car.priceDay.toLocaleString()}
                    </span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-white/40">Monthly</span>
                    <span className="text-white/60 font-bold text-base italic">
                        <span className="text-[10px] font-normal mr-1 not-italic opacity-50">AED</span>
                        {car.priceMonth.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => onBook(car)}
                    className="flex-1 bg-white text-black font-black text-[11px] tracking-widest uppercase py-3 hover:bg-neutral-200 transition-colors cursor-pointer border-none"
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

const CarOfferPage = () => {
    const { id } = useParams()
    const { cars: fleetCars, carsLoading: loading } = useApp()
    const [bookingCar, setBookingCar] = useState(null)
    const [activeImage, setActiveImage] = useState(0)
    const car = fleetCars.find((item) => item.id === Number(id))

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    if (!car) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white italic uppercase font-black">Vehicle Not Found</div>
    }

    const similarCars = fleetCars.filter((c) => c.id !== car.id).slice(0, 6)
    const galleryImages = [car.image, car.image, car.image, car.image]

    return (
        <div className="min-h-screen bg-black text-white">
            <AnimatePresence>
                {bookingCar && <BookingModal car={bookingCar} onClose={() => setBookingCar(null)} />}
            </AnimatePresence>

            <Navbar />

            <main className="pt-24 pb-20">
                <div className="container-custom">
                    {/* Navigation */}
                    <Link to="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors mb-8 no-underline">
                        <ChevronLeft size={14} /> Back to Fleet
                    </Link>

                    {/* Page Header */}
                    <div className="mb-10">
                        <span className="text-[12px] font-bold text-white/40 tracking-[0.3em] uppercase block mb-2">{car.brand}</span>
                        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-6">
                            Rent {car.name} <span className="text-white/20 not-italic font-light">/ Dubai</span>
                        </h1>
                        <div className="flex flex-wrap gap-6 text-white/60">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-white" /> 
                                <span className="text-[11px] uppercase tracking-widest">{car.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} /> 
                                <span className="text-[11px] uppercase tracking-widest">Available Now</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Gallery & Booking Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            <div className="relative aspect-video rounded-sm overflow-hidden border border-white/10">
                                <img src={galleryImages[activeImage]} alt={car.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {galleryImages.map((img, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setActiveImage(i)}
                                        className={`aspect-video rounded-sm overflow-hidden border-2 transition-all ${activeImage === i ? "border-white" : "border-transparent opacity-40 hover:opacity-100"}`}
                                    >
                                        <img src={img} alt={car.name} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="sticky top-28 flex flex-col gap-6">
                                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-sm">
                                    <div className="flex flex-col gap-6 mb-8">
                                        <div>
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Daily Rate</span>
                                            <div className="flex items-baseline gap-2 italic">
                                                <span className="text-[14px] text-white/40 not-italic font-medium">AED</span>
                                                <span className="text-4xl font-black">{car.priceDay.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                            <div>
                                                <span className="text-[9px] text-white/40 uppercase tracking-widest block">Weekly</span>
                                                <span className="text-[15px] font-bold italic">AED {car.priceWeek.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] text-white/40 uppercase tracking-widest block">Monthly</span>
                                                <span className="text-[15px] font-bold italic">AED {car.priceMonth.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setBookingCar(car)}
                                        className="w-full bg-white text-black font-black text-[13px] uppercase tracking-[0.2em] py-5 hover:bg-neutral-200 transition-colors cursor-pointer border-none mb-4"
                                    >
                                        Book This Vehicle
                                    </button>
                                    <p className="text-[10px] text-white/30 text-center uppercase tracking-widest">5% VAT applicable • Brand new model</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                        <section>
                            <h2 className="text-[14px] font-black uppercase italic tracking-[0.3em] mb-8 flex items-center gap-4">
                                01 <span className="h-px flex-1 bg-white/10" /> Technical Overview
                            </h2>
                            <div className="bg-white/[0.02] border border-white/10 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12">
                                <div className="flex flex-col">
                                    <OverviewRow label="Body Type" value={car.overview.bodyType} icon={Car} />
                                    <OverviewRow label="Model Year" value={car.overview.model} icon={Calendar} />
                                    <OverviewRow label="Engine" value={car.overview.engineCapacity} icon={Zap} />
                                </div>
                                <div className="flex flex-col">
                                    <OverviewRow label="Max Speed" value={`${car.specs.speed} KM/H`} icon={Gauge} />
                                    <OverviewRow label="Transmission" value={car.overview.gearbox} icon={Settings2} />
                                    <OverviewRow label="Seating" value={`${car.specs.seats} Persons`} icon={Users} />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[14px] font-black uppercase italic tracking-[0.3em] mb-8 flex items-center gap-4">
                                02 <span className="h-px flex-1 bg-white/10" /> Features & Specs
                            </h2>
                            <div className="flex flex-col gap-2">
                                <FeatureAccordion title="Interior features" items={car.features.interior} />
                                <FeatureAccordion title="Exterior features" items={car.features.exterior} />
                                <FeatureAccordion title="Safety & Infotainment" items={[...car.features.safety, ...car.features.infotainment]} />
                            </div>
                        </section>
                    </div>

                    {/* Description */}
                    <section className="max-w-4xl mb-24">
                        <h2 className="text-[14px] font-black uppercase italic tracking-[0.3em] mb-8 flex items-center gap-4">
                            03 <span className="h-px w-20 bg-white/10" /> Description
                        </h2>
                        <p className="text-xl text-white/60 leading-relaxed font-light">
                            {car.description}
                        </p>
                    </section>
                </div>

                {/* Similar Fleet Section (Updated Theme) */}
                <section className="bg-black border-t border-white/5 pt-24 pb-12 overflow-hidden">
                    <div className="container-custom">
                        <div className="flex items-end justify-between mb-12">
                            <div className="flex flex-col gap-2">
                                <span className="text-[11px] font-bold text-white/30 tracking-[0.4em] uppercase">Related</span>
                                <h2 className="font-black italic text-3xl uppercase tracking-tighter text-white">
                                    Similar Fleet
                                </h2>
                            </div>
                        </div>
                        
                        <div 
                            className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar" 
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {similarCars.map((c) => (
                                <div key={c.id} className="snap-start">
                                    <SimilarCard car={c} onBook={setBookingCar} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24">
                    <div className="container-custom flex flex-col items-center">
                        <div className="text-center mb-16">
                            <span className="text-[11px] font-bold text-white/40 tracking-[0.5em] uppercase block mb-4">FAQ</span>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Everything you need to know</h2>
                        </div>
                        <div className="max-w-3xl w-full">
                            {faqItems.map((item) => (
                                <FaqItem key={item.question} item={item} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default CarOfferPage