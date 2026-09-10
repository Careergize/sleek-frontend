import React, { useState, useEffect, useMemo } from 'react';
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
    Search,
    Clock,
    Calendar,
    User,
    Mail,
    Phone,
    History,
    ArrowUpRight,
    MoreHorizontal,
    Eye,
    Check
} from 'lucide-react';

import { API_BASE_URL } from "@/config";

const Customers = () => {
    const [bookings, setBookings] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewingBooking, setViewingBooking] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("isSleekAuthenticated");
        if (auth !== "true") navigate("/login");
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [bRes, cRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/bookings/`),
                    fetch(`${API_BASE_URL}/api/cars/`)
                ]);
                
                if (bRes.ok && cRes.ok) {
                    const bData = await bRes.json();
                    const cData = await cRes.json();
                    setBookings(bData);
                    setCars(cData);
                }
            } catch (err) {
                console.error("Error fetching admin data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Derive unique customers from bookings list
    const customers = useMemo(() => {
        const customerMap = {};
        bookings.forEach(b => {
            const email = b.email?.toLowerCase();
            if (!customerMap[email]) {
                customerMap[email] = {
                    id: b.id,
                    name: b.name,
                    email: b.email,
                    phone: b.phone,
                    bookings: 0,
                    totalSpent: 0,
                    status: "Active",
                    lastBooking: b.created_at?.split('T')[0],
                    latestBookingObj: b
                };
            }
            customerMap[email].bookings += 1;
            customerMap[email].totalSpent += parseFloat(b.total_price || 0);
            
            // Update last activity if this booking is newer
            if (new Date(b.created_at) > new Date(customerMap[email].lastBooking)) {
                customerMap[email].lastBooking = b.created_at?.split('T')[0];
                customerMap[email].latestBookingObj = b;
            }
        });
        return Object.values(customerMap);
    }, [bookings]);

    // Format recent bookings for the top section
    const recentBookingsList = useMemo(() => {
        return [...bookings].reverse().slice(0, 2).map(b => {
            const carObj = cars.find(c => c.id === b.car);
            return {
                id: `BK-${b.id}`,
                customer: b.name,
                car: carObj ? `${carObj.brand} ${carObj.name}` : `Car #${b.car}`,
                period: `${b.pickup_date} - ${b.dropoff_date}`,
                amount: parseFloat(b.total_price || 0),
                status: b.status,
                image: carObj ? (carObj.image?.startsWith('http') ? carObj.image : `${API_BASE_URL}${carObj.image}`) : "",
                rawBooking: b
            };
        });
    }, [bookings, cars]);

    const handleLogout = () => {
        localStorage.removeItem("isSleekAuthenticated");
        navigate("/");
    };

    const getCarName = (carId) => {
        const car = cars.find(c => c.id === carId);
        return car ? `${car.brand} ${car.name}` : `Car #${carId}`;
    };

    const SidebarContent = () => (
        <>
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-brand-gold">Sleek.</h1>
                    <p className="text-[10px] text-brand-gray tracking-[0.3em] uppercase mt-1">Admin Portal</p>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-brand-gray hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>
            <nav className="flex-1 space-y-2">
                <Link to="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-brand-gray hover:text-brand-white hover:bg-white/5 no-underline">
                    <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/admin/fleet" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-brand-gray hover:text-brand-white hover:bg-white/5 no-underline">
                    <Car size={18} /> Fleet Management
                </Link>
                <Link to="/admin/customers" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-brand-gold text-brand-dark no-underline">
                    <Users size={18} /> Customers
                </Link>
                <Link to="/admin/analytics" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-brand-gray hover:text-brand-white hover:bg-white/5 no-underline">
                    <TrendingUp size={18} /> Analytics
                </Link>
            </nav>
            <div className="mt-auto pt-6 border-t border-white/5">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all group">
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-brand-dark text-brand-white flex font-body">
            {/* Booking Details Modal */}
            <AnimatePresence>
                {viewingBooking && (
                    <motion.div 
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setViewingBooking(null)}
                    >
                        <motion.div 
                            className="relative w-full max-w-lg bg-brand-card rounded-2xl p-8 border border-white/10 shadow-2xl"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setViewingBooking(null)} className="absolute top-6 right-6 text-brand-gray hover:text-white transition-colors cursor-pointer border-none bg-transparent">
                                <X size={20} />
                            </button>
                            
                            <h3 className="font-heading font-bold text-xl uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                                Booking <span className="text-brand-gold ml-2">#BK-{viewingBooking.id}</span>
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] text-brand-gray uppercase font-black tracking-widest mb-1">Vehicle</p>
                                        <p className="font-bold text-sm uppercase italic">{getCarName(viewingBooking.car)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-brand-gray uppercase font-black tracking-widest mb-1">Status</p>
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                                            {viewingBooking.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] text-brand-gray uppercase font-black tracking-widest mb-1">Pickup</p>
                                        <p className="text-xs font-bold text-white/90">{viewingBooking.pickup_date}</p>
                                        <p className="text-[10px] text-brand-gray">{viewingBooking.pickup_time}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-brand-gray uppercase font-black tracking-widest mb-1">Dropoff</p>
                                        <p className="text-xs font-bold text-white/90">{viewingBooking.dropoff_date}</p>
                                        <p className="text-[10px] text-brand-gray">{viewingBooking.dropoff_time}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 p-4 bg-white/5 rounded-xl">
                                    <div>
                                        <p className="text-[10px] text-brand-gray uppercase font-black tracking-widest mb-1">Customer Info</p>
                                        <p className="text-sm font-bold text-white">{viewingBooking.name}</p>
                                        <p className="text-xs text-brand-gray lowercase">{viewingBooking.email}</p>
                                        <p className="text-xs text-brand-gray">{viewingBooking.phone}</p>
                                    </div>
                                    <div className="flex gap-4 pt-2 border-t border-white/5">
                                        <p className="text-[10px] text-white/60">Baby Seat: <span className="text-white">{viewingBooking.baby_seat ? "Yes" : "No"}</span></p>
                                        <p className="text-[10px] text-white/60">Payment: <span className="text-white">{viewingBooking.pay_now ? "Online" : "On Pickup"}</span></p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="font-heading font-black text-sm uppercase italic">Final Total</span>
                                    <span className="text-lg font-black text-brand-gold italic">AED {parseFloat(viewingBooking.total_price).toLocaleString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden" />
                        <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 left-0 h-full w-64 bg-brand-darker border-r border-white/5 flex flex-col p-6 z-[51] lg:hidden">
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <aside className="w-64 border-r border-white/5 bg-brand-darker flex flex-col p-6 hidden lg:flex">
                <SidebarContent />
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-brand-dark/50 backdrop-blur-md sticky top-0 z-20">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-white/5 rounded-lg lg:hidden text-brand-gray hover:text-white">
                        <Menu size={24} />
                    </button>
                    <h2 className="font-heading font-bold text-xl uppercase tracking-widest hidden sm:block">Customer Database</h2>
                    <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-dark font-black">AD</div>
                </header>

                <div className="p-8 flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                    {/* Recently Booked Section */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <History size={18} className="text-brand-gold" />
                            <h3 className="font-heading font-bold text-sm uppercase tracking-widest italic">Recently Booked</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recentBookingsList.map((booking) => (
                                <div 
                                    key={booking.id} 
                                    onClick={() => setViewingBooking(booking.rawBooking)}
                                    className="bg-brand-card rounded-2xl border border-white/5 p-6 flex items-center gap-6 group hover:border-brand-gold/30 transition-all cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0 group-hover:border-brand-gold/30 transition-colors">
                                        <User size={20} className="text-brand-gray group-hover:text-brand-gold" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-black uppercase text-xs tracking-tight truncate">{booking.customer}</h4>
                                            <span className="text-[10px] font-bold text-brand-gold italic">AED {booking.amount.toLocaleString()}</span>
                                        </div>
                                        <p className="text-[10px] text-brand-gray uppercase tracking-widest mb-1">{booking.car}</p>
                                        <div className="flex items-center gap-2 text-white/40 text-[9px] uppercase tracking-tighter">
                                            <Calendar size={10} /> {booking.period}
                                        </div>
                                    </div>
                                    <div className="p-2 bg-white/5 rounded-full text-brand-gray group-hover:text-brand-gold transition-colors">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Table */}
                    <div className="bg-brand-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="font-heading font-bold text-lg uppercase tracking-widest">Master List</h2>
                            <div className="relative w-full max-w-md group">
                                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-brand-gold' : 'text-brand-gray'}`} size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search by name, email or phone..." 
                                    className="w-full bg-brand-dark border border-white/10 rounded-xl py-2.5 pl-12 pr-10 text-sm focus:outline-none focus:border-brand-gold/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray bg-white/5">
                                        <th className="px-6 py-5">Client Information</th>
                                        <th className="px-6 py-5">Statistics</th>
                                        <th className="px-6 py-5">Last Activity</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {customers.filter(c => 
                                        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        c.email.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).map((client) => (
                                        <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-brand-gold/30 transition-colors">
                                                        <User size={18} className="text-brand-gray group-hover:text-brand-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm uppercase tracking-tight">{client.name}</p>
                                                        <div className="flex items-center gap-3 mt-0.5">
                                                            <span className="flex items-center gap-1 text-[10px] text-brand-gray lowercase"><Mail size={10} /> {client.email}</span>
                                                            <span className="flex items-center gap-1 text-[10px] text-brand-gray"><Phone size={10} /> {client.phone}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black uppercase text-white/80">{client.bookings} Bookings</span>
                                                    <span className="text-[10px] font-bold text-brand-gold italic">AED {client.totalSpent.toLocaleString()} Total</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-brand-gray text-[10px] font-bold uppercase tracking-wider">
                                                    <Clock size={12} className="text-white/20" /> {client.lastBooking}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border
                                                    ${client.status === 'Active' ? 'bg-green-500/5 text-green-400 border-green-500/20' : 'bg-white/5 text-brand-gray border-white/10'}`}>
                                                    {client.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button 
                                                    onClick={() => setViewingBooking(client.latestBookingObj)}
                                                    className="p-2.5 bg-white/5 hover:bg-brand-gold/10 rounded-xl text-brand-gray hover:text-brand-gold transition-all cursor-pointer border-none"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary Footer */}
                    <div className="mt-8 flex justify-between items-center px-4">
                        <p className="text-[10px] text-brand-gray font-black uppercase tracking-widest">
                            Showing {customers.length} Verified Accounts
                        </p>
                        <button className="text-[10px] text-brand-gold font-black uppercase tracking-widest hover:underline decoration-brand-gold underline-offset-4">
                            Export CSV Report
                        </button>
                    </div>
                    </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Customers;