import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from "motion/react";
import { 
    Car, 
    LayoutDashboard, 
    Plus, 
    Edit, 
    Trash2, 
    Clock, 
    Calendar,
    Users,
    Search,
    TrendingUp,
    Save,
    X,
    LogOut,
    Menu,
    AlertTriangle
} from 'lucide-react';
import { Input } from "@/components/ui/input";

import { API_BASE_URL } from "@/config";

const FleetManagement = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCar, setSelectedCar] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const navigate = useNavigate();

    // Auth Check
    useEffect(() => {
        const auth = localStorage.getItem("isSleekAuthenticated");
        if (auth !== "true") navigate("/login");
    }, [navigate]);

    // Fetch live fleet data
    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/cars/`);
                if (!response.ok) throw new Error("Connection to fleet API failed.");
                const data = await response.json();
                
                const mappedData = data.map(car => ({
                    ...car,
                    priceDay: parseFloat(car.price_day || 0),
                    priceWeek: parseFloat(car.price_week || 0),
                    priceMonth: parseFloat(car.price_month || 0),
                    mileageLimit: car.mileage_limit || 250,
                    additionalMileage: car.additional_mileage || "5.00",
                    minRental: car.min_rental || 2,
                    description: car.description || "",
                    status: car.status || "Available",
                    image: car.image?.startsWith('http') ? car.image : `${API_BASE_URL}${car.image}`
                }));
                setCars(mappedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("isSleekAuthenticated");
        navigate("/");
    };

    const handleSaveCar = async (e) => {
        e.preventDefault();
        const isNew = !selectedCar.id;
        const url = isNew ? `${API_BASE_URL}/api/cars/` : `${API_BASE_URL}/api/cars/${selectedCar.id}/`;
        const method = isNew ? "POST" : "PATCH";

        const formData = new FormData();
        formData.append('brand', selectedCar.brand || "");
        formData.append('name', selectedCar.name || "");
        formData.append('category', selectedCar.category || "sedan");
        formData.append('price_day', selectedCar.priceDay || 0);
        formData.append('price_week', selectedCar.priceWeek || 0);
        formData.append('price_month', selectedCar.priceMonth || 0);
        formData.append('mileage_limit', selectedCar.mileageLimit || 0);
        formData.append('additional_mileage', selectedCar.additionalMileage || "0.00");
        formData.append('min_rental', selectedCar.minRental || 1);
        formData.append('status', selectedCar.status);
        formData.append('location', selectedCar.location || "Dubai Marina, Dubai");
        formData.append('description', selectedCar.description || "Premium rental vehicle.");
        formData.append('specs', JSON.stringify(selectedCar.specs || {}));

        if (selectedCar.imageFile) {
            formData.append('image', selectedCar.imageFile);
        } else if (isNew) {
            alert("Please select a vehicle image.");
            return;
        }

        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                console.error("Save failed:", err);
                alert(`Save failed: ${JSON.stringify(err)}`);
                return;
            }

            const savedData = await response.json();
            const formattedCar = {
                ...savedData,
                priceDay: parseFloat(savedData.price_day || 0),
                priceWeek: parseFloat(savedData.price_week || 0),
                priceMonth: parseFloat(savedData.price_month || 0),
                mileageLimit: savedData.mileage_limit,
                additionalMileage: savedData.additional_mileage,
                minRental: savedData.min_rental,
                description: savedData.description,
                status: savedData.status || "Available",
                image: savedData.image?.startsWith('http') ? savedData.image : `${API_BASE_URL}${savedData.image}`
            };

            if (isNew) {
                setCars(prev => [formattedCar, ...prev]);
            } else {
                setCars(cars.map(c => c.id === formattedCar.id ? formattedCar : c));
            }

            setIsEditing(false);
            setSelectedCar(null);
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    const handleAddClick = () => {
        setSelectedCar({
            brand: "",
            name: "",
            category: "sedan",
            priceDay: 0,
            priceWeek: 0,
            priceMonth: 0,
            mileageLimit: 250,
            additionalMileage: "5.00",
            minRental: 2,
            status: "Available",
            specs: { speed: 0, hp: 0, seats: 5 },
            location: "Dubai Marina, Dubai",
            description: "Premium rental vehicle."
        });
        setIsEditing(true);
    };

    const allFilteredCars = cars.filter(car => {
        const matchesSearch = 
            car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.overview?.bodyType?.toLowerCase().includes(searchQuery.toLowerCase());
            
        const matchesStatus = filterStatus === "All" || car.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const displayedCars = allFilteredCars.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                <Link to="/admin/fleet" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-brand-gold text-brand-dark no-underline">
                    <Car size={18} /> Fleet Management
                </Link>
                <Link to="/admin/customers" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-brand-gray hover:text-brand-white hover:bg-white/5 no-underline">
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
                    <h2 className="font-heading font-bold text-xl uppercase tracking-widest hidden sm:block">Vehicle Inventory</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-dark font-black">AD</div>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-y-auto">
                    {/* Interactive Tabs with Counts */}
                    <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-1 rounded-2xl w-fit">
                        {[
                            { id: 'All', label: 'All Units', count: cars.length, icon: Car },
                            { id: 'Rented', label: 'Booked', count: cars.filter(c => c.status === 'Rented').length, icon: Clock, color: 'text-brand-gold' },
                            { id: 'Available', label: 'Available', count: cars.filter(c => c.status === 'Available').length, icon: Calendar, color: 'text-green-400' },
                            { id: 'Maintenance', label: 'Service', count: cars.filter(c => c.status === 'Maintenance').length, icon: AlertTriangle, color: 'text-red-400' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilterStatus(tab.id)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest
                                    ${filterStatus === tab.id ? 'bg-brand-card shadow-lg text-white' : 'text-brand-gray hover:text-brand-white'}`}
                            >
                                <tab.icon size={14} className={filterStatus === tab.id ? tab.color : ''} />
                                {tab.label}
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-[9px] ${filterStatus === tab.id ? 'bg-brand-gold text-brand-dark' : 'bg-white/10'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-brand-card rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full max-w-md group">
                                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-brand-gold' : 'text-brand-gray'}`} size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search model, brand..." 
                                    className="w-full bg-brand-dark border border-white/10 rounded-xl py-2.5 pl-12 pr-10 text-sm focus:outline-none focus:border-brand-gold/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={handleAddClick}
                                className="bg-brand-gold text-brand-dark px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-brand-gold-dark transition-all shadow-lg active:scale-95"
                            >
                                <Plus size={14} /> Add Vehicle
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gray bg-white/5">
                                        <th className="px-6 py-5">Vehicle Details</th>
                                        <th className="px-6 py-5">Type</th>
                                        <th className="px-6 py-5">Daily Rate</th>
                                        <th className="px-6 py-5">Current Status</th>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {allFilteredCars.map((car) => (
                                        <tr key={car.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={car.image} alt="" className="w-14 h-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all border border-white/5" />
                                                    <div>
                                                        <p className="font-bold text-sm uppercase tracking-tight">{car.name}</p>
                                                        <p className="text-[10px] text-brand-gray uppercase tracking-widest">{car.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-gray">{car.overview?.bodyType}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-brand-gold italic">AED {car.priceDay.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border
                                                    ${car.status === 'Available' ? 'bg-green-500/5 text-green-400 border-green-500/20' : 
                                                      car.status === 'Rented' ? 'bg-brand-gold/5 text-brand-gold border-brand-gold/20' : 
                                                      'bg-red-500/5 text-red-400 border-red-500/20'}`}>
                                                    {car.status === 'Rented' ? 'Booked' : car.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => { setSelectedCar(car); setIsEditing(true); }} className="p-2.5 hover:bg-white/10 rounded-xl text-brand-gray hover:text-white transition-all"><Edit size={16} /></button>
                                                    <button className="p-2.5 hover:bg-red-500/10 rounded-xl text-brand-gray hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {allFilteredCars.length > itemsPerPage && (
                        <div className="mt-8 flex justify-center items-center gap-4">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 disabled:opacity-30 transition-all cursor-pointer"
                            >
                                Previous
                            </button>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gray">
                                Page <span className="text-white">{currentPage}</span> of {Math.ceil(allFilteredCars.length / itemsPerPage)}
                            </span>
                            <button 
                                disabled={currentPage >= Math.ceil(allFilteredCars.length / itemsPerPage)}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 disabled:opacity-30 transition-all cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <AnimatePresence>
                {isEditing && selectedCar && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-lg bg-brand-card border-l border-white/10 z-[101] p-8 shadow-2xl flex flex-col">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">{selectedCar.id ? "Manage Asset" : "Add New Asset"}</h2>
                                    <p className="text-[10px] text-brand-gray uppercase tracking-[0.2em] mt-1">{selectedCar.id ? `Vehicle ID: #${selectedCar.id}` : "Inventory Creation"}</p>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={24} /></button>
                            </div>

                            <form className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar" onSubmit={handleSaveCar}>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Category</label>
                                        <select 
                                            className="w-full bg-brand-dark border border-white/10 rounded-xl p-3.5 text-sm font-bold focus:outline-none focus:border-brand-gold/50 appearance-none"
                                            value={selectedCar.category}
                                            onChange={(e) => setSelectedCar({...selectedCar, category: e.target.value})}
                                        >
                                            <option value="sedan">Sedan</option>
                                            <option value="suv">SUV</option>
                                            <option value="sports">Sports</option>
                                            <option value="luxury">Luxury</option>
                                            <option value="convertible">Convertible</option>
                                            <option value="van">Van</option>
                                        </select>
                                    </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Vehicle Image</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => setSelectedCar({...selectedCar, imageFile: e.target.files[0]})}
                                            className="w-full bg-brand-dark border border-white/10 rounded-xl p-2 text-xs text-brand-gray file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-brand-gold file:text-brand-dark"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Brand</label>
                                            <Input value={selectedCar.brand} onChange={(e) => setSelectedCar({...selectedCar, brand: e.target.value})} className="bg-brand-dark border-white/10 rounded-xl font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Model</label>
                                            <Input value={selectedCar.name} onChange={(e) => setSelectedCar({...selectedCar, name: e.target.value})} className="bg-brand-dark border-white/10 rounded-xl font-bold" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray font-bold">Daily Rate (AED)</label>
                                        <Input type="number" step="0.01" value={selectedCar.priceDay} onChange={(e) => setSelectedCar({...selectedCar, priceDay: parseFloat(e.target.value)})} className="bg-brand-dark border-white/10 rounded-xl text-brand-gold font-black text-lg italic" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Weekly Rate</label>
                                            <Input type="number" step="0.01" value={selectedCar.priceWeek} onChange={(e) => setSelectedCar({...selectedCar, priceWeek: parseFloat(e.target.value)})} className="bg-brand-dark border-white/10 rounded-xl font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Monthly Rate</label>
                                            <Input type="number" step="0.01" value={selectedCar.priceMonth} onChange={(e) => setSelectedCar({...selectedCar, priceMonth: parseFloat(e.target.value)})} className="bg-brand-dark border-white/10 rounded-xl font-bold" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Daily Km Limit</label>
                                            <Input type="number" value={selectedCar.mileageLimit} onChange={(e) => setSelectedCar({...selectedCar, mileageLimit: e.target.value ? parseInt(e.target.value) : 0})} className="bg-brand-dark border-white/10 rounded-xl font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Add. Km Fee</label>
                                            <Input type="number" step="0.01" value={selectedCar.additionalMileage} onChange={(e) => setSelectedCar({...selectedCar, additionalMileage: e.target.value || "0.00"})} className="bg-brand-dark border-white/10 rounded-xl font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Min Days</label>
                                            <Input type="number" value={selectedCar.minRental} onChange={(e) => setSelectedCar({...selectedCar, minRental: e.target.value ? parseInt(e.target.value) : 1})} className="bg-brand-dark border-white/10 rounded-xl font-bold" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Public Description</label>
                                        <textarea 
                                            value={selectedCar.description} 
                                            onChange={(e) => setSelectedCar({...selectedCar, description: e.target.value})}
                                            className="w-full bg-brand-dark border border-white/10 rounded-xl p-3.5 text-sm font-medium h-24 focus:outline-none focus:border-brand-gold/50"
                                        />
                                    </div>

                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-2">Technical Specifications</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black uppercase text-brand-gray block text-center">Top Speed</label>
                                                <input type="number" className="bg-brand-dark border border-white/10 rounded-lg text-center w-full py-2 font-bold text-xs outline-none focus:border-brand-gold/50" value={selectedCar.specs.speed} onChange={(e) => setSelectedCar({...selectedCar, specs: {...selectedCar.specs, speed: parseInt(e.target.value)}})} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black uppercase text-brand-gray block text-center">Power (HP)</label>
                                                <input type="number" className="bg-brand-dark border border-white/10 rounded-lg text-center w-full py-2 font-bold text-xs outline-none focus:border-brand-gold/50" value={selectedCar.specs.hp} onChange={(e) => setSelectedCar({...selectedCar, specs: {...selectedCar.specs, hp: parseInt(e.target.value)}})} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black uppercase text-brand-gray block text-center">Seats</label>
                                                <input type="number" className="bg-brand-dark border border-white/10 rounded-lg text-center w-full py-2 font-bold text-xs outline-none focus:border-brand-gold/50" value={selectedCar.specs.seats} onChange={(e) => setSelectedCar({...selectedCar, specs: {...selectedCar.specs, seats: parseInt(e.target.value)}})} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Asset Status</label>
                                        <select 
                                            className="w-full bg-brand-dark border border-white/10 rounded-xl p-3.5 text-sm font-bold focus:outline-none focus:border-brand-gold/50 appearance-none"
                                            value={selectedCar.status}
                                            onChange={(e) => setSelectedCar({...selectedCar, status: e.target.value})}
                                        >
                                            <option value="Available">🟢 Available</option>
                                            <option value="Rented">🟡 Booked (Rented)</option>
                                            <option value="Maintenance">🔴 In Maintenance</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-6 space-y-3">
                                    <button type="submit" className="w-full bg-brand-gold text-brand-dark font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-gold-dark transition-all uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-brand-gold/10">
                                        <Save size={16} /> {selectedCar.id ? "Deploy Changes" : "Register Vehicle"}
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="w-full bg-white/5 text-brand-white font-black py-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all uppercase tracking-[0.2em] text-[11px]">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FleetManagement;