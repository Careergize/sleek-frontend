import { useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Check, X } from "lucide-react"

// ponytail: one route, two states via ?status=. Stripe success_url/cancel_url land here.
const BookingResult = () => {
    const [params] = useSearchParams()
    const success = params.get("status") === "success"
    const { icon, title, body } = useMemo(() => success
        ? {
            icon: <Check className="text-brand-gold" size={44} />,
            title: "Booking & Payment Received!",
            body: "Thank you for choosing Sleek. Your payment has been processed. Our team will contact you shortly to confirm your reservation.",
        }
        : {
            icon: <X className="text-red-500" size={44} />,
            title: "Payment Cancelled",
            body: "Your booking was not charged. You can try again or contact us on WhatsApp for assistance.",
        }, [success])

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-darker">
            <div className="w-full max-w-md bg-brand-card rounded-2xl p-10 text-center shadow-2xl border border-brand-gold/20">
                <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    {icon}
                </div>
                <h2 className="font-heading font-bold text-brand-white text-heading-sm mb-3 uppercase tracking-wider">{title}</h2>
                <p className="font-body text-brand-gray mb-8 leading-relaxed">{body}</p>
                <div className="flex flex-col gap-3">
                    <Link to="/" className="w-full bg-brand-gold text-brand-dark font-heading font-bold py-4 rounded-xl hover:bg-brand-gold-dark transition-all text-center no-underline">
                        Back to Home
                    </Link>
                    {!success && (
                        <a
                            href="https://wa.me/971507023899?text=Hi, I had an issue with my booking payment. Can you help?"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] text-white font-heading font-bold py-4 rounded-xl text-center no-underline"
                        >
                            Chat on WhatsApp
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookingResult
