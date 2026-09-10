export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
}

export const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
}

export const staggerContainer = (stagger = 0.12) => ({
    hidden: {},
    show: {
        transition: {
            staggerChildren: stagger,
        },
    },
})

export const smoothTransition = (duration = 0.65) => ({
    duration,
    ease: [0.25, 0.1, 0.25, 1],
})
