import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap  font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-brand-gold text-brand-dark hover:bg-brand-gold-dark ",
                outline: "border-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark",
                ghost: "text-brand-gray hover:text-brand-white hover:bg-brand-card",
                nav: "text-brand-gray hover:text-brand-gold bg-transparent ",
            },
            size: {
                default: "h-11 px-7 py-2 text-body rounded-sm",
                sm: "h-9 px-5 text-body-sm rounded-sm",
                lg: "h-14 px-10 text-body rounded-sm",
                icon: "h-10 w-10 rounded-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = ({ className, variant, size, asChild = false, ...props }) => {

    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )

}

Button.displayName = "Button"

export { Button, buttonVariants }
