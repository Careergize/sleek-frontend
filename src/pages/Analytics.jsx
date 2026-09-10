import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from "motion/react";

import {
    Car,
    LayoutDashboard,
    Users,
    TrendingUp,
    LogOut,
    Menu,
    X,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';

import { API_BASE_URL } from "@/config";

// Bookings counted as "current/active" are ones whose status is in this list.
// Your API returned "pending" as an example — add/remove values here once you
// know the full set your backend uses (e.g. "confirmed", "completed", "cancelled").
// Statuses NOT in this list (e.g. "completed", "cancelled") are excluded from
// the active count and the green "Fleet Status" bar.
const ACTIVE_BOOKING_STATUSES = ["pending", "confirmed", "ongoing"];

const isActiveBooking = (booking) =>
    ACTIVE_BOOKING_STATUSES.includes(String(booking.status).toLowerCase());

// Groups bookings into the last 6 calendar months (oldest -> newest) using
// created_at, i.e. when the booking was made. Switch to pickup_date below if
// you'd rather chart when trips are scheduled to happen instead.
const buildMonthlyData = (bookings) => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${d.getFullYear()}-${d.getMonth()}`,
            month: d.toLocaleString('default', { month: 'short' }),
            bookings: 0,
        });
    }

    bookings.forEach((booking) => {
        const rawDate = booking.created_at; // or booking.pickup_date
        if (!rawDate) return;

        const d = new Date(rawDate);
        if (Number.isNaN(d.getTime())) return;

        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const bucket = months.find((m) => m.key === key);
        if (bucket) bucket.bookings += 1;
    });

    return months;
};

const Analytics = () => {

    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();

    // Live counts derived from the bookings API
    const currentBookingsCount = bookings.filter(isActiveBooking).length;
    const totalFleetCount = cars.length;

    // Safe utilization calculation
    const utilizationRate =
        totalFleetCount > 0
            ? ((currentBookingsCount / totalFleetCount) * 100).toFixed(1)
            : 0;

    // Monthly chart data, derived from real booking dates. Falls back to
    // just the current month's count if bookings have no date field.
    const monthlyData = buildMonthlyData(bookings);
    const maxBookings = Math.max(1, ...monthlyData.map(d => d.bookings));

    // Authentication check
    useEffect(() => {
        const auth = localStorage.getItem("isSleekAuthenticated");

        if (auth !== "true") {
            navigate("/login");
        }
    }, [navigate]);

    // Fetch fleet + bookings from the Django API
    useEffect(() => {

        const fetchAnalyticsData = async () => {

            try {

                setLoading(true);
                setError("");

                const [carsRes, bookingsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/cars/`),
                    fetch(`${API_BASE_URL}/api/bookings/`),
                ]);

                if (!carsRes.ok) {
                    throw new Error("Failed to fetch cars");
                }
                if (!bookingsRes.ok) {
                    throw new Error("Failed to fetch bookings");
                }

                const carsData = await carsRes.json();
                const bookingsData = await bookingsRes.json();

                console.log("Cars API Response:", carsData);
                console.log("Bookings API Response:", bookingsData);

                // Handle both a plain array and a paginated { results: [...] } shape,
                // since DRF pagination is common.
                setCars(Array.isArray(carsData) ? carsData : carsData.results || []);
                setBookings(Array.isArray(bookingsData) ? bookingsData : bookingsData.results || []);

            } catch (err) {

                console.error("Analytics fetch error:", err);

                setError("Failed to load analytics data");

            } finally {

                setLoading(false);
            }
        };

        fetchAnalyticsData();

    }, []);

    const handleLogout = () => {

        localStorage.removeItem("isSleekAuthenticated");

        navigate("/");
    };

    const SidebarContent = () => (
        <>
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-brand-gold">
                        Sleek.
                    </h1>

                    <p className="text-[10px] text-brand-gray tracking-[0.3em] uppercase mt-1">
                        Admin Portal
                    </p>
                </div>

                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden p-2 text-brand-gray hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 space-y-2">

                <Link
                    to="/admin"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-brand-gray hover:text-brand-white hover:bg-white/5 no-underline"
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>

                <Link
                    to="/admin/fleet"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-brand-gray hover:text-brand-white hover:bg-white/5 no-underline"
                >
                    <Car size={18} />
                    Fleet Management
                </Link>

                <Link
                    to="/admin/customers"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-brand-gray hover:text-brand-white hover:bg-white/5 no-underline"
                >
                    <Users size={18} />
                    Customers
                </Link>

                <Link
                    to="/admin/analytics"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-brand-gold text-brand-dark no-underline"
                >
                    <TrendingUp size={18} />
                    Analytics
                </Link>

            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all group"
                >
                    <LogOut
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform"
                    />

                    Logout
                </button>

            </div>
        </>
    );

    // Loading Screen
    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white text-xl font-bold">
                Loading Analytics...
            </div>
        );
    }

    // Error Screen
    if (error) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center text-red-400 text-xl font-bold">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark text-brand-white flex font-body">

            {/* Mobile Sidebar */}
            <AnimatePresence>

                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
                        />

                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 200
                            }}
                            className="fixed top-0 left-0 h-full w-64 bg-brand-darker border-r border-white/5 flex flex-col p-6 z-[51] lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}

            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-brand-darker flex flex-col p-6 hidden lg:flex">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Header */}
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-brand-dark/50 backdrop-blur-md sticky top-0 z-20">

                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 hover:bg-white/5 rounded-lg lg:hidden text-brand-gray hover:text-white"
                    >
                        <Menu size={24} />
                    </button>

                    <h2 className="font-heading font-bold text-xl uppercase tracking-widest hidden sm:block">
                        Performance Analytics
                    </h2>

                    <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-dark font-black">
                        AD
                    </div>

                </header>

                {/* Body */}
                <div className="p-8 flex-1 overflow-y-auto">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                        {/* Utilization */}
                        <div className="bg-brand-card p-6 rounded-2xl border border-white/5 shadow-xl">

                            <div className="flex justify-between items-start mb-4">

                                <div className="p-3 rounded-xl bg-brand-gold/10 text-brand-gold">
                                    <Activity size={24} />
                                </div>

                            </div>

                            <h3 className="text-3xl font-black uppercase tracking-tighter">
                                {utilizationRate}%
                            </h3>

                            <p className="text-[10px] text-brand-gray font-black uppercase tracking-widest mt-1">
                                Fleet Utilization
                            </p>

                        </div>

                        {/* Bookings */}
                        <div className="bg-brand-card p-6 rounded-2xl border border-white/5 shadow-xl">

                            <div className="flex justify-between items-start mb-4">

                                <div className="p-3 rounded-xl bg-blue-400/10 text-blue-400">
                                    <BarChart3 size={24} />
                                </div>

                                <span className="text-[10px] font-black text-brand-gray">
                                    REAL-TIME
                                </span>

                            </div>

                            <h3 className="text-3xl font-black uppercase tracking-tighter">
                                {currentBookingsCount}
                            </h3>

                            <p className="text-[10px] text-brand-gray font-black uppercase tracking-widest mt-1">
                                Active Bookings
                            </p>

                        </div>

                        {/* Total Fleet */}
                        <div className="bg-brand-card p-6 rounded-2xl border border-white/5 shadow-xl">

                            <div className="flex justify-between items-start mb-4">

                                <div className="p-3 rounded-xl bg-purple-400/10 text-purple-400">
                                    <PieChart size={24} />
                                </div>

                            </div>

                            <h3 className="text-3xl font-black uppercase tracking-tighter">
                                {totalFleetCount}
                            </h3>

                            <p className="text-[10px] text-brand-gray font-black uppercase tracking-widest mt-1">
                                Total Assets
                            </p>

                        </div>

                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Chart */}
                        <div className="lg:col-span-8 bg-brand-card rounded-2xl border border-white/5 p-8">

                            <div className="flex items-center justify-between mb-10">

                                <div>
                                    <h3 className="font-heading font-bold text-sm uppercase tracking-widest italic">
                                        Booking Trends
                                    </h3>

                                    <p className="text-[10px] text-brand-gray uppercase tracking-widest mt-1">
                                        Monthly performance overview
                                    </p>
                                </div>

                            </div>

                            <div className="h-64 flex items-end justify-between gap-4 px-2">

                                {monthlyData.map((data, i) => (

                                    <div
                                        key={data.key}
                                        className="flex-1 flex flex-col items-center gap-4 group"
                                    >

                                        <div className="relative w-full flex flex-col items-center">

                                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-gold text-brand-dark text-[10px] font-black py-1 px-2 rounded pointer-events-none">
                                                {data.bookings}
                                            </div>

                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{
                                                    height: `${(data.bookings / maxBookings) * 100}%`
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    delay: i * 0.1
                                                }}
                                                className={`w-full max-w-[40px] rounded-t-lg transition-colors cursor-pointer
                                                ${i === monthlyData.length - 1
                                                        ? 'bg-brand-gold'
                                                        : 'bg-white/10 group-hover:bg-white/20'
                                                    }`}
                                            />

                                        </div>

                                        <span className="text-[10px] font-black uppercase text-brand-gray tracking-widest">
                                            {data.month}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* Fleet Status */}
                        <div className="lg:col-span-4 bg-brand-card rounded-2xl border border-white/5 p-8">

                            <h3 className="font-heading font-bold text-sm uppercase tracking-widest italic mb-8">
                                Fleet Status
                            </h3>

                            <div className="space-y-6">

                                {/* Booked */}
                                <div>

                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">

                                        <span className="text-brand-gold">
                                            Booked
                                        </span>

                                        <span>
                                            {currentBookingsCount} Units
                                        </span>

                                    </div>

                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">

                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${utilizationRate}%`
                                            }}
                                            transition={{
                                                duration: 1.5
                                            }}
                                            className="h-full bg-brand-gold"
                                        />

                                    </div>

                                </div>

                                {/* Available */}
                                <div>

                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">

                                        <span className="text-green-400">
                                            Available
                                        </span>

                                        <span>
                                            {Math.max(
                                                totalFleetCount - currentBookingsCount,
                                                0
                                            )} Units
                                        </span>

                                    </div>

                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">

                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${100 - utilizationRate}%`
                                            }}
                                            transition={{
                                                duration: 1.5
                                            }}
                                            className="h-full bg-green-400"
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Cars List */}
                    <div className="mt-12 bg-brand-card rounded-2xl border border-white/5 p-8">

                        <h3 className="font-heading font-bold text-xl uppercase tracking-widest mb-8">
                            Cars From Django API
                        </h3>

                        {cars.length === 0 ? (

                            <p className="text-brand-gray">
                                No cars found.
                            </p>

                        ) : (

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                                {cars.map((car) => (

                                    <div
                                        key={car.id}
                                        className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-brand-gold/40 transition-all"
                                    >

                                        <div className="flex items-center justify-between mb-4">

                                            <div className="p-3 rounded-xl bg-brand-gold/10 text-brand-gold">
                                                <Car size={22} />
                                            </div>

                                            <span className="text-[10px] uppercase font-black tracking-widest text-green-400">
                                                Active
                                            </span>

                                        </div>

                                        <h4 className="text-xl font-black uppercase tracking-tight mb-2">
                                            {car.name || car.title || "Unnamed Car"}
                                        </h4>

                                        <div className="space-y-2 text-sm text-brand-gray">

                                            <p>
                                                Brand:
                                                <span className="text-white ml-2">
                                                    {car.brand || "N/A"}
                                                </span>
                                            </p>

                                            <p>
                                                Model:
                                                <span className="text-white ml-2">
                                                    {car.model || "N/A"}
                                                </span>
                                            </p>

                                            <p>
                                                Price:
                                                <span className="text-brand-gold ml-2 font-bold">
                                                    ₹{car.price || "N/A"}
                                                </span>
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                    {/* Bookings List */}
                    <div className="mt-12 bg-brand-card rounded-2xl border border-white/5 p-8">

                        <h3 className="font-heading font-bold text-xl uppercase tracking-widest mb-8">
                            Bookings From Django API
                        </h3>

                        {bookings.length === 0 ? (

                            <p className="text-brand-gray">
                                No bookings found.
                            </p>

                        ) : (

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                                {bookings.map((booking) => (

                                    <div
                                        key={booking.id}
                                        className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-brand-gold/40 transition-all"
                                    >

                                        <div className="flex items-center justify-between mb-4">

                                            <div className="p-3 rounded-xl bg-brand-gold/10 text-brand-gold">
                                                <BarChart3 size={22} />
                                            </div>

                                            <span
                                                className={`text-[10px] uppercase font-black tracking-widest ${
                                                    isActiveBooking(booking)
                                                        ? 'text-green-400'
                                                        : 'text-brand-gray'
                                                }`}
                                            >
                                                {booking.status || "N/A"}
                                            </span>

                                        </div>

                                        <h4 className="text-xl font-black uppercase tracking-tight mb-2">
                                            {cars.find((c) => c.id === booking.car)?.name || `Car #${booking.car}`}
                                        </h4>

                                        <div className="space-y-2 text-sm text-brand-gray">

                                            <p>
                                                Customer:
                                                <span className="text-white ml-2">
                                                    {booking.name || booking.email || "N/A"}
                                                </span>
                                            </p>

                                            <p>
                                                Pickup:
                                                <span className="text-white ml-2">
                                                    {booking.pickup_date} {booking.pickup_time}
                                                </span>
                                            </p>

                                            <p>
                                                Dropoff:
                                                <span className="text-white ml-2">
                                                    {booking.dropoff_date} {booking.dropoff_time}
                                                </span>
                                            </p>

                                            <p>
                                                Price:
                                                <span className="text-brand-gold ml-2 font-bold">
                                                    ₹{booking.total_price}
                                                </span>
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Analytics;