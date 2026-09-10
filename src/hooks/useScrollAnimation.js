import { useRef } from "react"
import { useInView } from "motion/react"

const useScrollAnimation = (options = {}) => {

    const { once = true, margin = "-5% 0px" } = options

    const ref = useRef(null)
    const isInView = useInView(ref, { once, margin })

    return { ref, isInView }

}

export default useScrollAnimation
