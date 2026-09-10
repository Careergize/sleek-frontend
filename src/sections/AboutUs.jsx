import { motion } from "motion/react"
import aboutImage from "@/assets/images/dubai.jpg"
import pointerArrow from "@/assets/svg/pointer-bash.svg"

const AboutUs = () => {

    return (
        <section id="about" >
            <div className="section-padding bg-brand-dark overflow-hidden mt-6">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-5% 0px" }}
                            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <img
                                src={aboutImage}
                                alt="Two people leaning on a luxury car in Dubai"
                                className="w-full h-full object-cover rounded-2xl"
                                style={{ maxHeight: "480px" }}
                            />
                        </motion.div>

                        <motion.div
                            className="flex flex-col"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-5% 0px" }}
                            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        >
                            <span className="spaced-text text-gray-100 ">
                                Sleek
                            </span>

                            <div className="flex flex-col gap-1">
                                {/* Changed text-brand-gold to text-white */}
                                <h2 className="font-heading font-bold text-white text-heading-xl leading-tight">
                                    Built for the
                                </h2>
                                <div className="flex items-center gap-4">
                                    {/* Changed text-brand-gold to text-white */}
                                    <h2 className="font-heading font-bold text-white text-heading-xl leading-tight">
                                        Drive Ahead
                                    </h2>
                                    {/* Added invert to make the arrow visible on dark bg */}
                                    <img src={pointerArrow} alt="" className="mt-1 shrink-0 invert" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 font-light mt-6">
                                <p className="font-body text-body-sm text-gray-400 body-text">
                                    At Sleek Rent a Car, we redefine mobility in the heart of Dubai — a city where luxury, speed, and innovation meet. We provide premium and reliable car rental solutions designed for those who value comfort, style, and seamless travel.
                                </p>
                                <p className="font-body text-body-sm text-gray-400 body-text">
                                    Whether you're visiting Dubai for business, leisure, or a long-term stay, Sleek offers a diverse fleet of well-maintained vehicles — from stylish sedans and luxury cars to powerful SUVs — ensuring a smooth and effortless driving experience. Our vehicles are equipped with modern features, delivering safety, performance, and sophistication on every journey.
                                </p>
                            </div>

                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    )

}

export default AboutUs