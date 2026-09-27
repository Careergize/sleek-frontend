import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Car, LayoutDashboard, LogOut, Menu, TrendingUp, Users, X } from "lucide-react";
import { API_BASE_URL } from "@/config";
import { useApp } from "@/context/AppContext";
import CarRentalPlanner from "@/pages/Carrentalplanner";

const vehicleColors = ["#b91c1c", "#1d4ed8", "#047857", "#b45309", "#6d28d9"];

const normalizeBookingStatus = (status) => {
    return String(status || "pending").trim().toLowerCase();
};

const CarRentalPlannerPage = () => {
    const navigate = useNavigate();
    const { cars, carsLoading, carsError } = useApp();
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [bookingsError, setBookingsError] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("isSleekAuthenticated") !== "true") {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        let isMounted = true;

        const loadBookings = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/bookings/`);
                if (!response.ok) throw new Error("Failed to load bookings.");

                const data = await response.json();
                const rows = Array.isArray(data) ? data : data.results || [];
                if (isMounted) setBookings(rows);
            } catch (error) {
                if (isMounted) setBookingsError(error.message);
            } finally {
                if (isMounted) setBookingsLoading(false);
            }
        };

        loadBookings();
        return () => {
            isMounted = false;
        };
    }, []);

    const plannerCars = useMemo(() => cars.map((car, index) => ({
        ...car,
        name: `${car.brand || ""} ${car.name || "Vehicle"}`.trim(),
        seats: car.specs?.seats || 5,
        trim: car.category || car.overview?.bodyType || "Fleet",
        color: car.color || vehicleColors[index % vehicleColors.length],
    })), [cars]);

    const plannerBookings = useMemo(() => bookings.map((booking) => {
        const carId = typeof booking.car === "object" && booking.car !== null
            ? booking.car.id
            : booking.car;

        return {
            ...booking,
            car: carId,
            status: normalizeBookingStatus(booking.status),
            total_price: Number(booking.total_price) || 0,
        };
    }), [bookings]);

    const handleLogout = () => {
        localStorage.removeItem("isSleekAuthenticated");
        navigate("/");
    };

    const navLinkClass = "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-brand-gray no-underline transition-all hover:bg-white/5 hover:text-brand-white";

    const SidebarContent = () => (
        <>
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-brand-gold">Sleek.</h1>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-brand-gray">Admin Portal</p>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-brand-gray hover:text-white lg:hidden" aria-label="Close menu">
                    <X size={20} />
                </button>
            </div>
            <nav className="flex-1 space-y-2">
                <Link to="/admin" className={navLinkClass}><LayoutDashboard size={18} />Dashboard</Link>
                <Link to="/admin/planner" className="flex w-full items-center gap-3 rounded-xl bg-brand-gold px-4 py-3 text-sm font-bold text-brand-dark no-underline">
                    <Calendar size={18} />Rental Planner
                </Link>
                <Link to="/admin/fleet" className={navLinkClass}><Car size={18} />Fleet Management</Link>
                <Link to="/admin/customers" className={navLinkClass}><Users size={18} />Customers</Link>
                <Link to="/admin/analytics" className={navLinkClass}><TrendingUp size={18} />Analytics</Link>
            </nav>
            <div className="mt-8 border-t border-white/5 pt-6">
                <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-400 transition-colors hover:bg-red-400/10">
                    <LogOut size={18} />Logout
                </button>
            </div>
        </>
    );

    const isLoading = carsLoading || bookingsLoading;
    const error = carsError || bookingsError;

    return (
        <div className="flex min-h-screen bg-brand-dark font-body text-brand-white">
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}
            <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-brand-darker p-6 transition-transform lg:static lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <SidebarContent />
            </aside>
            <main className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/5 px-5 sm:px-8">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-brand-gray hover:text-white lg:hidden" aria-label="Open menu">
                        <Menu size={22} />
                    </button>
                    <h2 className="text-lg font-bold uppercase tracking-widest sm:text-xl">Car Rental Planner</h2>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold font-black text-brand-dark">AD</div>
                </header>
                <div className="flex-1 overflow-auto p-3 sm:p-6">
                    {error ? (
                        <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>
                    ) : isLoading ? (
                        <div className="rounded-xl border border-white/10 bg-brand-card p-8 text-sm text-brand-gray">Loading fleet and bookings...</div>
                    ) : (
                        <div className="min-h-[640px] overflow-hidden rounded-xl border border-white/10 bg-black shadow-xl">
                            <CarRentalPlanner cars={plannerCars} bookings={plannerBookings} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CarRentalPlannerPage;