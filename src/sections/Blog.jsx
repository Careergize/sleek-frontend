import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { blogPosts } from "@/data/blogs"
import pointerArrow from "@/assets/svg/pointer-bash.svg"

const POSTS_PER_PAGE = 3

const BlogCard = ({ post, index }) => (
    <motion.div
        key={post.id}
        className="relative pt-7"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
        <div className="relative w-full h-[450px] rounded-[40px] overflow-hidden group">
            <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            <div className="absolute top-0 left-0">
                <div className="absolute top-0 left-0 w-28 h-28 bg-[#0B0F14] rounded-br-[40px]">
                    <div className="absolute -right-6 top-0 w-6 h-6 bg-[#0B0F14] shadow-[-10px_-10px_0_0_#0B0F14] rounded-tl-full hidden md:block"></div>
                </div>

                <div className="relative m-4 flex flex-col items-center justify-center w-20 h-20 rounded-full border border-orange-400 text-white bg-[#0B0F14]">
                    <span className="text-2xl font-bold text-orange-400">{post.day}</span>
                    <span className="text-xs uppercase tracking-widest text-gray-400">{post.month}</span>
                </div>
            </div>

            <div className="absolute bottom-10 inset-x-0 text-center px-6">
                <p className="text-orange-400 text-[10px] tracking-[0.2em] font-bold uppercase mb-2">{post.category}</p>
                <h2 className="text-white text-2xl font-semibold leading-tight">
                    {post.title}
                </h2>
            </div>
        </div>
    </motion.div>
)

const Blog = () => {
    const [page, setPage] = useState(0)

    const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE)
    const visible = blogPosts.slice(page * POSTS_PER_PAGE, page * POSTS_PER_PAGE + POSTS_PER_PAGE)

    return (
        <section id="blogs" className="section-padding bg-brand-dark">
            <div className="container-custom flex flex-col gap-14">

                <div className="flex flex-col items-center gap-3">
                    <span className="font-heading font-semibold text-brand-gray text-caption tracking-[0.3em] uppercase">
                        Our Blog
                    </span>
                    <div className="flex items-center gap-4">
                        <img
                            src={pointerArrow}
                            alt=""
                            className="shrink-0 invert opacity-50"
                            style={{ transform: "scaleX(-1)" }}
                        />
                        {/* Heading changed to white */}
                        <h2 className="font-heading font-black text-white text-heading-md md:text-[2.6rem] tracking-wide text-center">
                            Latest News
                        </h2>
                        <img 
                            src={pointerArrow} 
                            alt="" 
                            className="shrink-0 invert opacity-50" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                    <AnimatePresence mode="wait">
                        {visible.map((post, index) => (
                            <BlogCard key={post.id} post={post} index={index} />
                        ))}
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`rounded-full transition-all duration-300 cursor-pointer border-none ${
                                i === page 
                                ? "w-4 h-4 bg-brand-gold" 
                                : "w-3 h-3 bg-transparent border-2 border-brand-gray-dark hover:border-brand-gold"
                            }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Blog