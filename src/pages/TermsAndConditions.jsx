import { useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RentalConditions from "@/components/RentalConditions"

const sections = [
    {
        title: "About these terms",
        paragraphs: [
            "These Terms and Conditions govern your use of www.sleek-cars.com and the car rental enquiries and bookings made through Sleek Rent a Car (Sleek, we, us). Please read them before using our website or making a booking. By using the website, you agree to these website terms.",
            "Your vehicle rental is also subject to the booking confirmation and rental agreement provided by Sleek. Vehicle-specific requirements, charges and policies must be disclosed before you commit to the rental. These website terms do not replace your rental agreement or limit any rights you have under applicable consumer protection law.",
        ],
    },
    {
        title: "Website use and availability",
        paragraphs: [
            "Use the website lawfully and provide accurate contact and booking information. Do not submit fraudulent reservations, interfere with the website, attempt unauthorised access or misuse another person's information.",
            "We may temporarily restrict access for maintenance, security or technical reasons. Vehicle images, features, prices and availability may change; please review the details of your selected vehicle and raise any questions with Sleek before booking. Any correction affecting your reservation will be communicated for your agreement before the rental proceeds.",
        ],
    },
    {
        title: "Driver eligibility and documents",
        paragraphs: [
            "Drivers must be at least 25 years old and possess a valid UAE or international driver's licence with at least 5 years of driving experience. All drivers must also meet the licence and insurance requirements for the selected vehicle.",
            "You must present a valid driving licence accepted for driving in the UAE and the identification required for your residency or visitor status, such as an Emirates ID or passport. An international driving permit may be required. Sleek must verify your documents before releasing the vehicle. Only drivers authorised in the rental agreement may drive it.",
        ],
    },
    {
        title: "Reservations and vehicle availability",
        paragraphs: [
            "The website allows you to select a vehicle, rental dates and times, enter contact details and choose available extras and payment options. Keep your booking reference and check the confirmation for accuracy. Vehicle release remains subject to document verification and completion of the rental agreement.",
            "If the booked vehicle becomes unavailable, Sleek will contact you about an alternative or the available cancellation and refund options. A different vehicle or price requires your agreement; no automatic substitute-car penalty is imposed by these website terms.",
        ],
    },
    {
        title: "Prices, payments and security deposits",
        paragraphs: [
            "Website rental prices are shown in UAE dirhams (AED). Review the booking summary for the rental period, selected extras, applicable discounts, VAT and total before confirming. Charges such as delivery, collection, additional mileage, fuel, tolls, fines or a security deposit must be explained in the quote or rental agreement where applicable.",
            "Payments are collected upfront, and a credit card deposit is required at the time of booking. A prepayment is credited towards your rental charges; it does not by itself determine whether a cancellation is refundable. Any remaining rental balance is payable as agreed with Sleek.",
            "Any required security deposit, payment method, permitted deductions and release timeframe will be stated in the rental agreement. Payment processing and refund posting times may depend on the payment provider and your bank. Never share your card PIN or one-time password with Sleek support.",
        ],
    },
    {
        title: "Changes, cancellations and refunds",
        paragraphs: [
            "Contact Sleek as soon as possible to request a date change, vehicle change or cancellation, quoting your booking reference. Changes depend on availability and may affect the price. Sleek will explain any revised charges before you accept a change.",
            "Cancellation deadlines, no-show charges and refundable or non-refundable amounts are governed by the policy disclosed for your booking and the rental agreement, subject to applicable law. These website terms do not create a blanket non-refundable booking fee. Ask Sleek to confirm the cancellation policy before making a prepayment if it has not been provided.",
            "Refund enquiries can be sent to info@sleek-cars.com. Approved card refunds will normally be returned through the original payment method, subject to payment provider requirements. Sleek will confirm the amount and expected processing timeframe when your request is resolved.",
        ],
    },
    {
        title: "Pickup, vehicle use and return",
        paragraphs: [
            "Inspect the vehicle at pickup and ensure existing damage, fuel level, mileage and supplied accessories are recorded. Return it at the agreed time and location in the condition required by your rental agreement. Contact Sleek before extending your rental; an extension requires confirmation.",
            "Follow UAE traffic laws and the rental agreement. Do not drive under the influence, use the vehicle for racing or unlawful activities, sub-rent it or allow an unauthorised driver to use it. Travel outside the UAE is not permitted unless expressly authorised in writing and covered by the necessary documentation and insurance.",
            "Mileage allowances, excess mileage rates, fuel requirements, late return charges, tolls and traffic fines are set out in the vehicle listing or rental agreement. Any additional charges must be supported by the applicable agreed terms.",
        ],
    },
    {
        title: "Insurance, accidents and breakdowns",
        paragraphs: [
            "Review the insurance included with your rental, any excess, exclusions and optional cover before accepting the vehicle. Insurance does not automatically cover every type of damage or every use of the vehicle; the policy and rental agreement determine the applicable cover.",
            "In an accident or breakdown, stop safely, contact the appropriate emergency services where needed and notify Sleek promptly. Obtain any report required by the authorities or insurer and follow their instructions. Do not authorise repairs without Sleek's approval except where necessary for immediate safety or required by law.",
        ],
    },
    {
        title: "Personal information and third-party services",
        paragraphs: [
            "Booking and enquiry forms collect information such as your name, email address, phone number and rental details so Sleek can respond, arrange your rental and support your booking. Identification may also be required for the rental. Contact Sleek for information about the handling of your personal data or to raise a privacy request.",
            "The website uses third-party services, including payment checkout, WhatsApp and embedded maps. When you use those services, their own terms and privacy notices also apply. Only provide information necessary for your enquiry or booking, and avoid sending payment credentials through contact forms or WhatsApp.",
        ],
    },
    {
        title: "Website content and responsibility",
        paragraphs: [
            "Sleek's branding and website content are protected by applicable intellectual property rights. You may view and use the website for rental enquiries and bookings, but may not copy or commercially reuse protected content without permission from the relevant rights holder.",
            "Each party remains responsible for its obligations under the booking and rental agreement. Nothing in these terms excludes liability that cannot lawfully be excluded or removes mandatory consumer rights. Report website errors or booking problems to Sleek so we can investigate and assist.",
        ],
    },
    {
        title: "Updates and disputes",
        paragraphs: [
            "We may update these website terms and will show the revised date on this page. Material changes will be communicated through the website or directly where appropriate. Changes do not retrospectively alter an existing confirmed booking without your agreement or a legal requirement.",
            "These terms are subject to applicable UAE law. Please contact Sleek first with any complaint so we can try to resolve it. Nothing prevents you from contacting the relevant consumer protection authority or bringing a claim before a court with jurisdiction under applicable law.",
        ],
    },
]

export default function TermsAndConditions() {
    useEffect(() => {
        const previousTitle = document.title
        document.title = "Terms & Conditions | Sleek Rent a Car"
        return () => { document.title = previousTitle }
    }, [])

    return (
        <>
            <Navbar />
            <main className="bg-brand-dark text-brand-white pt-36 pb-20 min-h-screen">
                <div className="container-custom">
                    <Link to="/" className="text-sm text-brand-gray hover:text-white transition-colors">← Back to home</Link>
                    <header className="mt-10 mb-12 max-w-3xl">
                        <p className="spaced-text text-brand-gold mb-4">Sleek Rent a Car</p>
                        <h1 className="font-heading font-bold text-4xl md:text-6xl leading-tight">Terms &amp; Conditions</h1>
                        <p className="mt-5 text-brand-gray leading-relaxed">Please read these terms before using our website or booking your next drive with Sleek.</p>
                        <p className="mt-4 text-sm text-brand-gray">Last updated: 4 October 2026</p>
                    </header>
                    <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-10 lg:gap-16">
                        <nav aria-label="Terms contents" className="self-start lg:sticky lg:top-28 rounded-2xl border border-brand-border p-6">
                            <h2 className="font-heading font-semibold mb-4">On this page</h2>
                            <ol className="space-y-3 text-sm text-brand-gray">
                                {sections.map((section, index) => (
                                    <li key={section.title}><a href={`#terms-${index + 1}`} className="hover:text-brand-gold transition-colors">{index + 1}. {section.title}</a></li>
                                ))}
                                <li><a href="#terms-contact" className="hover:text-brand-gold transition-colors">12. Contact Sleek</a></li>
                            </ol>
                        </nav>
                        <div className="max-w-3xl space-y-10">
                            <RentalConditions />
                            {sections.map((section, index) => (
                                <section key={section.title} id={`terms-${index + 1}`} className="scroll-mt-28 border-b border-brand-border pb-10">
                                    <h2 className="font-heading font-semibold text-xl md:text-2xl mb-5">{index + 1}. {section.title}</h2>
                                    <div className="space-y-4 text-brand-gray leading-relaxed">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
                                </section>
                            ))}
                            <section id="terms-contact" className="scroll-mt-28 rounded-2xl border border-brand-border p-6 md:p-8">
                                <h2 className="font-heading font-semibold text-2xl mb-5">12. Contact Sleek</h2>
                                <address className="not-italic text-brand-gray leading-relaxed space-y-3">
                                    <p className="text-white font-semibold">Sleek Rent a Car</p>
                                    <p>Building-Aswaaq-10, Dar Al Zahia 28, 15C Street, Hor Al Anz East, Deira, Dubai, United Arab Emirates.</p>
                                    <p>Email: <a className="text-brand-gold hover:underline" href="mailto:info@sleek-cars.com">info@sleek-cars.com</a></p>
                                    <p>Phone: <a className="text-brand-gold hover:underline" href="tel:+971507023905">+971 50 702 3905</a></p>
                                </address>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
