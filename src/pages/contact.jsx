import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STATS = [
  { value: "500+", label: "Businesses trust us" },
  { value: "24/7", label: "Modern tech support" },
  { value: "0.00%", label: "Hidden fees" },
];

const STEPS = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Share your dates, headcount, and the kind of experience you're after.",
  },
  {
    number: "02",
    title: "We match your fleet",
    description:
      "Our team lines up vehicles and drivers suited to the brief, no back-and-forth.",
  },
  {
    number: "03",
    title: "Confirm & ride",
    description:
      "Approve the quote and we handle the rest, door to door.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export default function ContactPage() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-10%" });

  const stepsRef = useRef(null);
  const isStepsInView = useInView(stepsRef, { once: true, margin: "-15%" });

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Navbar />

      {/* Hero */}
      <section
        ref={heroRef}
        className="border-b border-white/10 px-8 py-16 pt-32 md:px-16 md:py-24"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40"
          >
            Engineered for excellence
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="mt-4 max-w-2xl text-5xl font-black leading-[1.02] tracking-tight md:text-6xl"
          >
            Let&rsquo;s talk logistics.
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-5 max-w-md text-white/60">
            Whether it&rsquo;s a single booking or a fleet-wide contract, the
            team behind Sleek responds within one business day.
          </motion.p>
          <motion.a
            variants={fadeInUp}
            href="#contact-form"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white"
          >
            Send an inquiry
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </motion.a>
        </motion.div>
      </section>

      {/* Stats bar */}
      <div className="grid grid-cols-1 divide-y divide-white/10 border-b border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
        {STATS.map((stat) => (
          <div key={stat.label} className="px-8 py-10 text-center md:px-4">
            <div className="text-3xl font-bold md:text-4xl">{stat.value}</div>
            <div className="mt-2 text-xs font-medium uppercase tracking-widest text-white/50">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* How it works — leads into the Footer's contact form */}
      <section
        ref={stepsRef}
        className="border-b border-white/10 px-8 py-20 md:px-16 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="max-w-md text-3xl font-black leading-tight tracking-tight md:text-4xl"
          >
            From inquiry to pickup, in three steps.
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isStepsInView ? "visible" : "hidden"}
            className="mt-14 grid grid-cols-1 gap-10 border-t border-white/10 pt-10 md:grid-cols-3 md:gap-8"
          >
            {STEPS.map((step) => (
              <motion.div variants={fadeInUp} key={step.number}>
                <span className="text-sm font-semibold text-white/30">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-white/60">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form, phone/email/address, map, and socials all live in Footer */}
      <Footer />
    </div>
  );
}