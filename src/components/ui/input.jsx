import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {

    return (
        <input
            type={type}
            className={cn(
                "flex h-11 w-full bg-brand-card border border-brand-border text-brand-white text-body placeholder:text-brand-gray-dark px-4 py-2 transition-colors focus:outline-none focus:border-brand-gold disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    )

})

Input.displayName = "Input"

export { Input }
