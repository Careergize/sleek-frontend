import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-sm px-3 py-1 text-caption font-heading font-semibold tracking-wider uppercase transition-colors",
    {
        variants: {
            variant: {
                default: "bg-brand-gold text-brand-dark",
                outline: "border border-brand-gold text-brand-gold",
                ghost: "bg-brand-card text-brand-gray",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const Badge = ({ className, variant, ...props }) => {

    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )

}

export { Badge, badgeVariants }
