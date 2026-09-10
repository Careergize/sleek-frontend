    import { useState, useEffect } from "react"
    import { useNavigate, useLocation } from "react-router-dom"
    import { motion, AnimatePresence } from "motion/react"
    import { Menu, X } from "lucide-react"

    import { useApp } from "@/context/AppContext"
    import logoFull from "@/assets/icons/logo.png"

    const navLinks = [
        { label: "Home", href: "#home" },
        { label: "About Us", href: "#about" },
       
        { label: "Brands", href: "#brands" },
         { label: "Cars", href: "/cars" },
        { label: "Categories", href: "#categories" },
        { label: "Blogs", href: "#blogs" },
        { label: "Login", href: "/login" },
       { label: "Contact Us", href: "/contact" }
    ]

    const Navbar = () => {
        const { isMenuOpen, toggleMenu, closeMenu } = useApp()
        const navigate = useNavigate()
        const { pathname } = useLocation()
        const [isScrolled, setIsScrolled] = useState(false)

        useEffect(() => {
            const handleScroll = () => setIsScrolled(window.scrollY > 60)
            window.addEventListener("scroll", handleScroll, { passive: true })
            return () => window.removeEventListener("scroll", handleScroll)
        }, [])

        const handleNavClick = (href) => {
            closeMenu()
            
            // 1. Handle Full Page Navigation (/cars, /blogs)
            if (href.startsWith("/")) {
                // Only navigate if we aren't already there
                if (pathname !== href) {
                    navigate(href)
                    window.scrollTo(0, 0)
                }
                return
            }

            // 2. Handle Anchor Scrolls (#about, #contact, etc.)
            if (pathname !== "/") {
                // If we are NOT on the homepage, go home first, then scroll
                navigate("/")
                // Increase timeout slightly to ensure the homepage component is mounted
                setTimeout(() => {
                    const id = href.replace("#", "")
                    const el = document.getElementById(id)
                    if (el) {
                        el.scrollIntoView({ behavior: "smooth" })
                    }
                }, 300) 
            } else {
                // If we ARE on the homepage, just scroll
                const id = href.replace("#", "")
                const el = document.getElementById(id)
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" })
                }
            }
        }

        return (
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                    ? "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg"
                    : "bg-transparent border-b border-transparent"
                }`}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between h-24">
                        
                        {/* Logo Section */}
                        <button 
                            onClick={() => handleNavClick("#home")} 
                            className="bg-transparent border-none cursor-pointer p-0 flex items-center"
                        >
                            <img 
                                src={logoFull} 
                                alt="Sleek Logo" 
                                className="h-8 md:h-10 object-contain brightness-0 invert" 
                            />
                        </button>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            <nav className="flex items-center gap-6">
                                {navLinks.slice(0, -1).map(link => (
                                    <button
                                        key={link.label}
                                        onClick={() => handleNavClick(link.href)}
                                        className="relative text-white/70 hover:text-white font-bold text-[12px] tracking-widest uppercase transition-all duration-200 cursor-pointer bg-transparent border-none group"
                                    >
                                        {link.label}
                                        <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
                                    </button>
                                ))}
                            </nav>

                            {/* Separate Styling for Contact Us CTA */}
                            <button
                                onClick={() => handleNavClick(navLinks[navLinks.length - 1].href)}
                                className="bg-white text-black px-8 py-3 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors cursor-pointer border-none"
                            >
                                {navLinks[navLinks.length - 1].label}
                            </button>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden text-white transition-colors bg-transparent border-none cursor-pointer p-2"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Sidebar */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                        {/* Mobile Overlay/Backdrop to improve focus and clarity */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMenu}
                            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[55] lg:hidden"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-black border-l border-white/10 z-[60] lg:hidden shadow-2xl"
                        >
                            <div className="flex flex-col h-full p-8">
                                <div className="flex justify-end mb-10">
                                    <button onClick={closeMenu} className="text-white/40 hover:text-white bg-transparent border-none cursor-pointer transition-colors p-2">
                                        <X size={28} />
                                    </button>
                                </div>
                                
                                <div className="flex flex-col gap-6">
                                    {navLinks.map((link, idx) => (
                                        <div key={link.label} className="flex flex-col gap-3">
                                            <button
                                                onClick={() => handleNavClick(link.href)}
                                                className="text-white font-black text-xl md:text-2xl text-left tracking-wide uppercase bg-transparent border-none cursor-pointer hover:translate-x-2 transition-all duration-300 w-full"
                                            >
                                                {link.label}
                                            </button>
                                            {idx !== navLinks.length - 1 && (
                                                <div className="h-px w-full bg-white/7" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.header>
        )
    }

    export default Navbar