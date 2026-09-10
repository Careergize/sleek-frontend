import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Plus, Minus } from "lucide-react"
import { faqItems } from "@/data/faq"
import pointerArrow from "@/assets/svg/pointer-bash.svg" // Note: Consider if this SVG color matches your new theme

const FAQItem = ({ item }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="rounded-xl overflow-hidden border border-white/5">
            <button
                onClick={() => setOpen(!open)}
                // UPDATED COLORS: bg-neutral-900 and white text
                className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-200 cursor-pointer border-none ${
                    open ? "bg-white text-black" : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
            >
                <span className="shrink-0">
                    {open ? <Minus size={16} /> : <Plus size={16} />}
                </span>
                <span className="font-heading font-bold uppercase tracking-tight text-body-sm">
                    {item.question}
                </span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden bg-black"
                    >
                        <div className="px-5 py-6">
                            {/* UPDATED COLORS: text-white/60 for a professional dimmed look */}
                            <p className="font-body text-body-sm text-white/60 uppercase tracking-widest leading-relaxed pl-8">
                                {item.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const FAQ = () => {
    return (
        // UPDATED BACKGROUND: Pure black
        <section id="faq" className="section-padding bg-black border-t border-white/5">
            <div className="container-custom flex flex-col gap-12">

                <div className="flex flex-col items-center gap-3">
                    {/* UPDATED COLORS: text-white/20 for subtleness */}
                    
                    <div className="flex items-center gap-4">
                        <img
                            src={pointerArrow}
                            alt=""
                            className="shrink-0 opacity-20 invert" // Inverted if your SVG was dark
                            style={{ transform: "scaleX(-1)" }}
                        />
                        {/* UPDATED COLORS: pure white text */}
                        <h2 className="font-heading font-black text-white text-heading-md md:text-heading-xl uppercase tracking-tighter  leading-tight text-center">
                            Frequently Asked <span className="opacity-40">Questions</span>
                        </h2>
                        <img src={pointerArrow} alt="" className="shrink-0 opacity-20 invert" />
                    </div>
                </div>

                <div className="flex flex-col gap-3 max-w-4xl mx-auto w-full">
                    {faqItems.map((item) => (
                        <FAQItem key={item.question} item={item} />
                    ))}
                </div>

            </div>
        </section>
    )
}

export default FAQ