import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, Mail, Phone, Baby, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { API_BASE_URL } from "@/config"
import RentalConditions from "@/components/RentalConditions"
import { bookingPrice, validateBooking } from "@/lib/booking"

const TIME_OPTIONS = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
]

const initialBookingState = {
    pickupDate: "",
    dropoffDate: "",
    pickupTime: "",
    dropoffTime: "",
    name: "",
    phone: "",
    email: "",
    babySeat: false,
}

const BookingModal = ({ car, onClose }) => {
    const [bookingDetails, setBookingDetails] = useState(initialBookingState)
    const [bookingFailed, setBookingFailed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = ""
        }
    }, [])

    const { days: numberOfDays, discount, vat, total: totalPrice, upfront: submittedAmount } = bookingPrice(car, bookingDetails)
    const babySeatCost = bookingDetails.babySeat ? 25 * numberOfDays : 0

    const handleInputChange = (field) => (e) => {
        setBookingDetails(prev => ({ ...prev, [field]: e.target.value }))
    }

    const handleSelectChange = (field) => (value) => {
        setBookingDetails(prev => ({ ...prev, [field]: value }))
    }

    const handleToggleChange = (field) => () => {
        setBookingDetails(prev => ({ ...prev, [field]: !prev[field] }))
    }

    const handleClear = () => {
        setBookingDetails(initialBookingState)
        setError(null)
    }

    // Extract checkout URL from dynamic API payloads
    const extractCheckoutUrl = (payload) => {
        if (!payload || typeof payload !== "object") return null
        if (payload.checkout_url) return payload.checkout_url
        if (payload.url) return payload.url

        let foundUrl = null
        const walk = (obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                const normalizedKey = key.toLowerCase()
                if (typeof value === "string" && (normalizedKey.includes("checkout") || normalizedKey === "url")) {
                    foundUrl = value
                } else if (typeof value === "object" && value !== null) {
                    walk(value)
                }
            })
        }
        walk(payload)
        return foundUrl
    }

    const handleConfirmBooking = async () => {
        if (loading) return
        const errors = validateBooking(bookingDetails)
        if (errors.length) {
            setError(errors.join(" "))
            return
        }
        setLoading(true)
        setError(null)
        setBookingFailed(false)

        const bookingData = {
            car: car.id,
            pickup_date: bookingDetails.pickupDate,
            dropoff_date: bookingDetails.dropoffDate,
            pickup_time: bookingDetails.pickupTime,
            dropoff_time: bookingDetails.dropoffTime,
            name: bookingDetails.name.trim(),
            phone: "+971" + bookingDetails.phone.replace(/[\s-]/g, "").replace(/^0/, ""),
            email: bookingDetails.email.trim(),
            baby_seat: bookingDetails.babySeat,
            pay_now: true,
            total_price: parseFloat(submittedAmount.toFixed(2)),
            status: "pending"
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingData),
            })

            if (!response.ok) {
                let errorMessage = "Failed to create booking."
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.detail || errorData.message || Object.values(errorData).flat().join(" ") || errorMessage
                } catch {
                    errorMessage = `Request failed with status ${response.status}`
                }
                throw new Error(errorMessage)
            }

            const data = await response.json()
            const checkoutUrl = extractCheckoutUrl(data)
            const isValidCheckoutUrl = typeof checkoutUrl === "string" && /^https:\/\//.test(checkoutUrl)

            if (checkoutUrl && !isValidCheckoutUrl) {
                throw new Error("Payment setup returned an invalid checkout address.")
            }

            if (isValidCheckoutUrl) {
                // Redirect user to payment portal. Keep loading=true (don't reset it)
                // so the button stays disabled/no other state can render while navigation happens.
                // NOTE: the confirmation email for Pay Now bookings must NOT be sent here.
                // It is only sent once the payment gateway confirms the payment
                // (e.g. via a webhook or the payment return/callback endpoint on the backend).
                window.location.assign(checkoutUrl)
                return
            }

            throw new Error("Payment setup failed. Please try again.")
        } catch (err) {
            setError(err.message || "An unexpected error occurred during booking.")
            setBookingFailed(true)
            setLoading(false)
        }
    }

    if (bookingFailed) {
        return (
            <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setBookingFailed(false)} />
                <motion.div
                    className="relative w-full max-w-md bg-brand-card rounded-2xl p-10 text-center shadow-2xl border border-red-500/20"
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <X className="text-red-500" size={44} />
                    </div>
                    <h2 className="font-heading font-bold text-brand-white text-heading-sm mb-3 uppercase tracking-wider">Booking Failed</h2>
                    <p className="font-body text-brand-gray mb-8 leading-relaxed">We encountered an issue while processing your booking. Please try again or contact us via WhatsApp for immediate assistance.</p>
                    <div className="flex flex-col gap-3">
                        <a
                            href={`https://wa.me/971507023899?text=Hi, I tried to book the ${car.brand} ${car.name} but the request failed. Can you help?`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] text-white font-heading font-bold py-4 rounded-xl text-center no-underline transition-all active:scale-95 border-none"
                        >
                            Chat on WhatsApp
                        </a>
                        <button onClick={() => setBookingFailed(false)} className="w-full bg-white/5 text-brand-white font-heading font-bold py-4 rounded-xl hover:bg-white/10 transition-all active:scale-95 cursor-pointer border border-white/10">
                            Try Again
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                className="relative w-full max-w-4xl max-h-[92vh] bg-brand-card rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-brand-darker/80 flex items-center justify-center text-brand-gray hover:text-brand-white transition-colors cursor-pointer border-none">
                    <X size={16} />
                </button>

                <div className="flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden flex-1 min-h-0">
                    {/* Car Details Section */}
                    <div className="lg:w-[38%] shrink-0 flex flex-col">
                        <div className="relative h-52 lg:h-full min-h-0">
                            <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #111827 0%, transparent 50%)" }} />
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <span className="font-heading text-caption font-semibold text-brand-gold tracking-[0.2em] uppercase">{car.brand}</span>
                                <h3 className="font-heading font-bold text-brand-white text-heading-sm leading-snug mt-0.5">{car.name}</h3>
                                <div className="flex items-baseline gap-1.5 mt-2">
                                    <span className="font-body text-caption text-brand-gray">AED</span>
                                    <span className="font-heading font-bold text-brand-gold text-heading-sm">{car.priceDay.toLocaleString()}</span>
                                    <span className="font-body text-caption text-brand-gray">/ day</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form Section */}
                    <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-y-auto">
                        <div className="flex flex-col gap-5 p-6 flex-1">
                            <div>
                                <h2 className="font-heading font-bold text-brand-white text-heading-sm">Book Your Ride</h2>
                                <p className="font-body text-body-sm text-brand-gray mt-1">Fill in the details to confirm your booking</p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Pickup Date */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-heading text-caption font-semibold text-brand-gray uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar size={12} />Pickup Date
                                    </label>
                                    <Input type="date" value={bookingDetails.pickupDate} onChange={handleInputChange("pickupDate")} className="rounded-lg [color-scheme:dark]" />
                                </div>

                                {/* Drop Off Date */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-heading text-caption font-semibold text-brand-gray uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar size={12} />Drop Off Date
                                    </label>
                                    <Input type="date" value={bookingDetails.dropoffDate} onChange={handleInputChange("dropoffDate")} className="rounded-lg [color-scheme:dark]" />
                                </div>

                                {/* Pickup Time */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-heading text-caption font-semibold text-brand-gray uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock size={12} />Pickup Time
                                    </label>
                                    <Select onValueChange={handleSelectChange("pickupTime")} value={bookingDetails.pickupTime}>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[70]">
                                            {TIME_OPTIONS.map(time => (
                                                <SelectItem key={time} value={time}>{time}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Drop Off Time */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-heading text-caption font-semibold text-brand-gray uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock size={12} />Drop Off Time
                                    </label>
                                    <Select onValueChange={handleSelectChange("dropoffTime")} value={bookingDetails.dropoffTime}>
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="Select time" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[70]">
                                            {TIME_OPTIONS.map(time => (
                                                <SelectItem key={time} value={time}>{time}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Full Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-heading text-caption font-semibold text-brand-gray uppercase tracking-widest flex items-center gap-1.5">
                                        <User size={12} />Full Name
                                    </label>
                                    <Input type="text" placeholder="John Doe" value={bookingDetails.name} onChange={handleInputChange("name")} className="rounded-lg" />
                                </div>

                                {/* Phone Number */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-heading text-caption font-semibold text-brand-gray uppercase tracking-widest flex items-center gap-1.5">
                                        <Phone size={12} />Phone Number
                                    </label>
                                    <div className="flex">
                                        <div className="flex items-center gap-2 px-3 bg-brand-darker border border-brand-border border-r-0 rounded-l-lg shrink-0">
                                            <span className="text-base leading-none">🇦🇪</span>
                                            <span className="font-body text-body-sm text-brand-gray">+971</span>
                                        </div>
                                        <Input type="tel" placeholder="50 123 4567" value={bookingDetails.phone} onChange={handleInputChange("phone")} className="rounded-l-none rounded-r-lg flex-1" />
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <label className="font-heading text-caption font-semibold text-brand-gray uppercase tracking-widest flex items-center gap-1.5">
                                        <Mail size={12} />Email Address
                                    </label>
                                    <Input type="email" placeholder="you@example.com" value={bookingDetails.email} onChange={handleInputChange("email")} className="rounded-lg" />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex flex-col gap-3 pt-1">
                                {/* Baby Seat */}
                                <button onClick={handleToggleChange("babySeat")} className="flex items-center justify-between p-4 rounded-lg border border-brand-border hover:border-brand-gold/50 transition-colors cursor-pointer bg-transparent w-full text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-gold/15 flex items-center justify-center shrink-0">
                                            <Baby size={15} className="text-brand-gold" />
                                        </div>
                                        <div>
                                            <p className="font-heading font-semibold text-brand-white text-body-sm">Baby Seat</p>
                                            <p className="font-body text-caption text-brand-gray">AED 25 / day</p>
                                        </div>
                                    </div>
                                    <div className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${bookingDetails.babySeat ? "bg-brand-gold" : "bg-brand-border"}`}>
                                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${bookingDetails.babySeat ? "left-[calc(100%-1.375rem)]" : "left-0.5"}`} />
                                    </div>
                                </button>

                                <div className="p-4 rounded-lg border border-brand-gold">
                                    <p className="font-heading font-semibold text-brand-white">Pay Now</p>
                                    <p className="text-caption text-brand-gray mt-1">Pay 50% now to secure your booking. The remaining balance is due before vehicle handover.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 p-4 rounded-xl bg-brand-darker border border-brand-border">
                                    <h4 className="font-heading font-semibold text-brand-white text-body-sm">Booking Summary</h4>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <span className="font-body text-body-sm text-brand-gray">{car.priceDay.toLocaleString()} AED × {numberOfDays} day{numberOfDays > 1 ? "s" : ""}</span>
                                            <span className="font-body text-body-sm text-brand-white">AED {(car.priceDay * numberOfDays).toLocaleString()}</span>
                                        </div>
                                        {bookingDetails.babySeat && (
                                            <div className="flex justify-between">
                                                <span className="font-body text-body-sm text-brand-gray">Baby Seat × {numberOfDays} day{numberOfDays > 1 ? "s" : ""}</span>
                                                <span className="font-body text-body-sm text-brand-white">AED {babySeatCost.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="font-body text-body-sm text-brand-gray">VAT (5%)</span>
                                            <span className="font-body text-body-sm text-brand-white">AED {vat.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-body-sm text-brand-gray"><span>Pay Now discount (5%)</span><span>− AED {discount.toFixed(2)}</span></div>
                                        <div className="h-px bg-brand-border my-1" />
                                        <div className="flex justify-between">
                                            <span className="font-heading font-bold text-brand-white text-body">Total</span>
                                            <span className="font-heading font-bold text-brand-gold text-body">AED {totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            <div className="flex justify-between text-brand-gold font-semibold"><span>Pay now (50%)</span><span>AED {submittedAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm text-brand-gray"><span>Remaining balance</span><span>AED {(totalPrice - submittedAmount).toFixed(2)}</span></div>
                        </div>

                        <div className="px-6 pb-6">
                            <RentalConditions />
                        </div>

                        {/* Action Buttons */}
                        <p className="px-6 pb-4 text-caption text-brand-gray leading-relaxed">
                            Please review our <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-brand-gold underline">Terms &amp; Conditions</a> before confirming your booking. Your rental is also subject to the booking confirmation and rental agreement.
                        </p>
                        <div className="flex gap-3 p-6 pt-0 shrink-0">
                            <button onClick={handleClear} className="flex-1 font-heading font-semibold text-body-sm text-brand-gray border border-brand-border py-3 rounded-lg hover:border-brand-gold/50 hover:text-brand-white transition-colors cursor-pointer bg-transparent">
                                Clear
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                disabled={loading}
                                className="flex-[2] font-heading font-semibold text-body-sm text-brand-dark bg-brand-gold py-3 rounded-lg hover:bg-brand-gold-dark transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Opening payment..." : `Pay AED ${submittedAmount.toFixed(2)} Now`}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default BookingModal
