import { motion } from "motion/react"
import { Star } from "lucide-react"
import { testimonials } from "@/data/testimonials"
import pointerArrow from "@/assets/svg/pointer-bash.svg"
import user1 from "@/assets/images/testimony_users/Testimoney_user1.png"
import user2 from "@/assets/images/testimony_users/Testimoney_user2.png"
import user3 from "@/assets/images/testimony_users/Testimoney_user3.png"

const userImages = [user1, user2, user3]

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
}

const TestimonialCard = ({ testimonial, index, image }) => (
    <motion.div
        variants={cardVariants}
        transition={{ duration: 0.65, delay: index * 0.14, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col justify-between gap-5 p-5 relative"
    >
        <div className="absolute top-1/4 -left-2 w-[110px] h-[120px] rounded-full object-cover shrink-0">
            <img
                src={image}
                alt={testimonial.name}
                className="overflow-hidden w-[110px] h-[120px] testimonial-card"
            />
        </div>
        <div className="bg-brand-card flex flex-col justify-between min-h-[250px] p-5 rounded-2xl">
            <div className="flex gap-6 ps-6 pe-2">
                <span
                    className="font-heading font-black text-brand-gold shrink-0 select-none"
                    style={{ fontSize: "3.5rem", lineHeight: "1", marginTop: "-6px" }}
                >
                    "
                </span>
                <p className="font-body text-body-sm text-brand-gray leading-relaxed">
                    {testimonial.review}
                </p>
            </div>

            <div className="flex items-center gap-3 justify-between ps-6 pe-2 mt-8">
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={i < testimonial.rating ? "text-brand-gold fill-brand-gold" : "text-brand-gray-dark fill-brand-gray-dark"}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="font-heading font-bold text-brand-white text-body-sm leading-tight">
                            {testimonial.name}
                        </span>
                        <span className="font-body text-caption text-brand-gray">
                            {testimonial.role}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
)

const Testimonials = () => {
    return (
        <section id="testimonials" className="section-padding bg-brand-darker">
            <div className="container-custom">
                <div className="flex flex-col items-center gap-3 mb-14">
                    <span className="font-heading font-semibold text-brand-gray text-caption tracking-[0.3em] uppercase">
                        Testimonials
                    </span>
                    <div className="flex items-center gap-4">
                        <img
                            src={pointerArrow}
                            alt=""
                            className="shrink-0 invert opacity-50" // Added invert/opacity to match white theme
                            style={{ transform: "scaleX(-1)" }}
                        />
                        {/* CHANGED text-brand-gold to text-white */}
                        <h2 className="font-heading font-black text-white text-heading-md md:text-[2.6rem] tracking-wide text-center">
                            What Client Say
                        </h2>
                        <img 
                            src={pointerArrow} 
                            alt="" 
                            className="shrink-0 invert opacity-50" 
                        />
                    </div>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-5% 0px" }}
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
                >
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard 
                            key={testimonial.id} 
                            testimonial={testimonial} 
                            index={index} 
                            image={userImages[index]} 
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default Testimonials