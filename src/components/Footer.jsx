import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight, ChevronRight, Mail, MapPin, Phone, Send } from "lucide-react"
import sleekLogo from "@/assets/icons/logo.png"

const usefulLinks = [
    { label: "Browse our fleet", to: "/cars" },
    { label: "Contact Sleek", to: "/contact" },
    { label: "Terms & Conditions", to: "/terms-and-conditions" },
]

export default function Footer() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const handleEnquiry = (event) => {
        event.preventDefault()
        const message = `Hi Sleek, I'd like to enquire about a car rental.\nName: ${name.trim()}\nEmail: ${email.trim()}`
        window.open(`https://wa.me/971507023905?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
    }

    const headingClass = "text-sm font-bold uppercase tracking-[0.14em] text-white mb-6"
    const linkClass = "inline-flex items-center gap-2 text-sm text-white/60 hover:text-brand-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold focus-visible:outline-offset-4"

    return (
        <footer className="bg-[#111522] text-white border-t border-white/10">
            <div className="container-custom">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between py-9 border-b border-white/10">
                    <Link to="/" aria-label="Sleek home" className="inline-flex w-fit shrink-0 items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold focus-visible:outline-offset-4">
                        <img src={sleekLogo} alt="Sleek Rent a Car" width={1200} height={321} className="block h-auto w-44 md:w-56 object-contain" />
                    </Link>
                    <p className="text-sm text-white/50 max-w-xs">Your next drive starts here. Premium car rentals in Dubai.</p>
                    <Link to="/cars" className="inline-flex w-fit items-center gap-3 text-sm font-semibold text-brand-gold hover:text-white transition-colors">
                        Find your car <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.9fr_1.2fr] gap-10 xl:gap-12 py-12 md:py-16">
                    <div>
                        <h2 className={headingClass}>Get in touch</h2>
                        <address className="not-italic space-y-4">
                            <a href="tel:+971507023905" className={linkClass}><Phone size={16} className="text-brand-gold shrink-0" aria-hidden="true" /> +971 50 702 3905</a>
                            <a href="mailto:info@sleek-cars.com" className={linkClass}><Mail size={16} className="text-brand-gold shrink-0" aria-hidden="true" /> info@sleek-cars.com</a>
                            <p className="flex items-start gap-2 text-sm text-white/60 leading-relaxed"><MapPin size={18} className="text-brand-gold shrink-0 mt-1" aria-hidden="true" /><span>Building-Aswaaq-10, Dar Al Zahia 28, 15C Street, Hor Al Anz East, Deira, Dubai, UAE</span></p>
                        </address>
                        <h3 className="mt-7 mb-3 text-xs font-bold uppercase tracking-widest text-white/80">Follow us</h3>
                        <a href="https://www.instagram.com/sleekcarrental?igsh=emZhamI1bG8wZWtl" target="_blank" rel="noopener noreferrer" aria-label="Sleek on Instagram (opens in a new tab)" className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-brand-gold hover:text-black transition-colors"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" /></svg></a>
                    </div>

                    <nav aria-label="Footer useful links">
                        <h2 className={headingClass}>Useful links</h2>
                        <ul className="space-y-4">
                            {usefulLinks.map(({ label, to }) => <li key={to}><Link to={to} className={linkClass}><ChevronRight size={15} className="text-brand-gold" aria-hidden="true" />{label}</Link></li>)}
                        </ul>
                    </nav>

                    <div>
                        <h2 className={headingClass}>Your next drive</h2>
                        <p className="text-sm text-white/60 leading-relaxed mb-5">From everyday journeys to special occasions, find a vehicle that fits your plans.</p>
                        <div className="flex flex-wrap gap-2" aria-label="Rental highlights">
                            {["Luxury cars", "Sedans", "SUVs", "Daily rentals", "Monthly rentals"].map(label => <span key={label} className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/60">{label}</span>)}
                        </div>
                        <p className="mt-5 text-sm text-brand-gold">Free vehicle delivery within Dubai</p>
                    </div>

                    <div>
                        <h2 className={headingClass}>Plan your rental</h2>
                        <p className="text-sm text-white/60 leading-relaxed mb-5">Leave your details and start a conversation with our team on WhatsApp.</p>
                        <form onSubmit={handleEnquiry} className="space-y-3">
                            <div>
                                <label htmlFor="footer-name" className="sr-only">Your name</label>
                                <input id="footer-name" name="name" autoComplete="name" required minLength={2} maxLength={255} pattern=".*\S.*" value={name} onChange={event => setName(event.target.value)} placeholder="Your name" className="w-full rounded-lg border border-white/10 bg-[#0b0e18] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-brand-gold" />
                            </div>
                            <div>
                                <label htmlFor="footer-email" className="sr-only">Your email</label>
                                <input id="footer-email" name="email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="Your email" className="w-full rounded-lg border border-white/10 bg-[#0b0e18] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-brand-gold" />
                            </div>
                            <button type="submit" className="flex w-full items-center justify-between gap-3 rounded-lg bg-brand-gold px-4 py-3 text-sm font-bold text-black hover:bg-brand-gold-dark transition-colors">Enquire on WhatsApp <Send size={16} aria-hidden="true" /></button>
                            <p className="text-xs text-white/40 leading-relaxed">Opens WhatsApp with your enquiry ready to send.</p>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-t border-white/10 text-xs text-white/40">
                    <p>© {new Date().getFullYear()} Sleek Rent a Car. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link to="/terms-and-conditions" className="hover:text-brand-gold transition-colors">Terms &amp; Conditions</Link>
                        <span>Powered by Careergize LLP</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

