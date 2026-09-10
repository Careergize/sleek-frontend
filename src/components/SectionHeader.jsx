import { motion } from "motion/react"
import { cn } from "@/lib/utils"

const SectionHeader = ({ label, title, highlight, subtitle, center = false, className }) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
                "flex flex-col gap-3",
                center && "items-center text-center",
                className
            )}
        >
            {label && (
                <span className="text-brand-gold font-heading font-semibold text-body-sm tracking-[0.2em] uppercase">
                    {label}
                </span>
            )}

            <h2 className="font-heading font-bold text-heading-xl md:text-heading-lg text-brand-white leading-tight">
                {title}{" "}
                {highlight && (
                    <span className="text-gradient-gold">{highlight}</span>
                )}
            </h2>

            {subtitle && (
                <p className="text-brand-gray font-body text-body max-w-xl mt-1">
                    {subtitle}
                </p>
            )}
        </motion.div>
    )

}

export default SectionHeader
