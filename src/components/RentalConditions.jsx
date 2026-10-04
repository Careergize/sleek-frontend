import { useId, useState } from "react"
import { ChevronRight } from "lucide-react"
import { rentalConditions } from "@/data/rentalConditions"

export default function RentalConditions() {
    const [openIndex, setOpenIndex] = useState(null)
    const accordionId = useId()

    return (
        <section aria-labelledby={`${accordionId}-heading`}>
            <h2 id={`${accordionId}-heading`} className="font-heading text-lg font-bold text-white mb-5">Rental Conditions</h2>
            <div className="space-y-3">
                {rentalConditions.map(({ title, description }, index) => {
                    const isOpen = openIndex === index
                    const buttonId = `${accordionId}-button-${index}`
                    const panelId = `${accordionId}-panel-${index}`

                    return (
                        <div key={title} className="overflow-hidden rounded-[20px] bg-[#222222]">
                            <h3>
                                <button
                                    type="button"
                                    id={buttonId}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className={`flex w-full items-center justify-between gap-4 border-none px-6 py-6 md:px-8 text-left text-sm font-semibold cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white ${isOpen ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/5"}`}
                                >
                                    <span><span className={isOpen ? "text-black" : "text-white"}>{index + 1}.</span> <span className="capitalize">{title}</span>:</span>
                                    <ChevronRight aria-hidden="true" size={18} className={`shrink-0 transition-transform ${isOpen ? "rotate-90 text-black" : "text-white"}`} />
                                </button>
                            </h3>
                            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                                <p className="px-6 py-7 md:px-8 text-sm text-white/60 leading-relaxed">{description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            <p className="mt-5 text-sm text-white/60 leading-relaxed">
                By renting with Sleek Rent a Car, you agree to these rental conditions. Please contact us for any clarifications or personalised arrangements.
            </p>
        </section>
    )
}
