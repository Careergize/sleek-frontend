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
    Loader2
} from 'lucide-react';

import { API_BASE_URL } from "@/config";

const AdminDashboard = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCar, setSelectedCar] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 15;
    const navigate = useNavigate();

    // =========================
    // AUTH CHECK
    // =========================
    useEffect(() => {
        const auth = localStorage.getItem("isSleekAuthenticated");

        if (auth !== "true") {
            navigate("/login");
        }
    }, [navigate]);

    // =========================
    // CLOCK
    // =========================
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // =========================
    // FETCH CARS FROM DJANGO API
    // =========================
    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${API_BASE_URL}/api/cars/`);

                if (!response.ok) {
                    throw new Error("Failed to fetch cars");
                }

                const data = await response.json();

                // Add frontend status if backend doesn't have one
                const formattedCars = data.map((car) => ({
                    ...car,
                    priceDay: parseFloat(car.price_day || 0),
                    priceWeek: parseFloat(car.price_week || 0),
                    priceMonth: parseFloat(car.price_month || 0),
                    mileageLimit: car.mileage_limit || 250,
                    additionalMileage: car.additional_mileage || "5.00",
                    minRental: car.min_rental || 1,
                    status: car.status || "Available",
                    image: car.image?.startsWith('http') ? car.image : `${API_BASE_URL}${car.image}`
                }));

                setCars(formattedCars);

            } catch (error) {
                console.error("Error fetching cars:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    // =========================
    // LOGOUT
    // =========================
    const handleLogout = () => {
        localStorage.removeItem("isSleekAuthenticated");
        navigate("/");
    };

    // =========================
    // UPDATE CAR (FRONTEND ONLY)
    // =========================
    const handleUpdateCar = async (e) => {
        e.preventDefault();

        // We use FormData because 'image' is a file field in Django.
        // Even if we aren't changing the image, using FormData is more robust for this API.
        // We use PATCH because PUT requires sending ALL fields (including the image file), 
        // which would overwrite existing data with nulls if omitted.
        const formData = new FormData();
        formData.append('brand', selectedCar.brand);
        formData.append('name', selectedCar.name);
        formData.append('category', selectedCar.category);
        formData.append('price_day', selectedCar.priceDay); // Use normalized priceDay
        formData.append('price_week', selectedCar.priceWeek); // Use normalized priceWeek
        formData.append('price_month', selectedCar.priceMonth); // Use normalized priceMonth
        formData.append('mileage_limit', selectedCar.mileageLimit); // Use normalized mileageLimit
        formData.append('additional_mileage', selectedCar.additionalMileage); // Use normalized additionalMileage
        formData.append('min_rental', selectedCar.minRental); // Use normalized minRental
        formData.append('location', selectedCar.location);
        formData.append('status', selectedCar.status); // Include status
        
        // Objects must be stringified when sent via FormData
        formData.append('specs', JSON.stringify(selectedCar.specs || {}));
        formData.append('overview', JSON.stringify(selectedCar.overview || {}));
        formData.append('features', JSON.stringify(selectedCar.features || {}));

        // description is required by your backend
        formData.append('description', selectedCar.description || "");

        // If you add a file input later, you would append the file here:
        // if (selectedCar.newImageFile) formData.append('image', selectedCar.newImageFile);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/cars/${selectedCar.id}/`,
                {
                    method: "PATCH",
                    body: formData,
                    // Note: Do NOT set Content-Type header when using FormData; 
                    // the browser sets it automatically with the correct boundary.
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Django Validation Errors:", errorData);
                // This alert will now tell you exactly which field failed (e.g. "description": ["This field is required"])
                alert(`Update failed. Errors: ${JSON.stringify(errorData)}`);
                return;
            }

            const updatedCar = await response.json();

            setCars((prevCars) =>
                prevCars.map((car) =>
                    car.id === updatedCar.id
                        ? {
                            ...updatedCar,
                            // Re-normalize updated car data from API
                            priceDay: parseFloat(updatedCar.price_day || 0),
                            priceWeek: parseFloat(updatedCar.price_week || 0),
                            priceMonth: parseFloat(updatedCar.price_month || 0),
                            mileageLimit: updatedCar.mileage_limit,
                            additionalMileage: updatedCar.additional_mileage,
                            minRental: updatedCar.min_rental,
                            image: updatedCar.image?.startsWith('http') ? updatedCar.image : `${API_BASE_URL}${updatedCar.image}`
                        }
                        : car
                )
            );

            setIsEditing(false);
            setSelectedCar(null);

        } catch (error) {
            console.error("Update Error:", error);
            alert("Failed to update car");
        }
    };

    // =========================
    // DELETE CAR
    // =========================
    const handleDeleteCar = async (id) => {
        const confirmDelete = window.confirm("Delete this vehicle?");

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/cars/${id}/`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            setCars((prev) => prev.filter((car) => car.id !== id));

        } catch (error) {
            console.error("Delete Error:", error);
            alert("Failed to delete car");
        }
    };

    // =========================
    // FILTERED CARS
    // =========================
    const allFilteredCars = cars.filter((car) => {

        const matchesSearch =
            car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.category?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            filterStatus === "All" || car.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // =========================
    // PAGINATION
    // =========================
    const displayedCars = allFilteredCars.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // =========================
    // SIDEBAR
    // =========================
    const SidebarContent = () => (
        <>
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-yellow-500">
                        Sleek.
                    </h1>

                    <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mt-1">
                        Admin Portal
                    </p>
                </div>

                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden p-2 text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 space-y-2">

                <Link
                    to="/admin"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-yellow-500 text-black no-underline"
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>

                <Link
                    to="/admin/fleet"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 no-underline"
                >
                    <Car size={18} />

                    <span className="flex-1 text-left">
                        Fleet Management
                    </span>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500">
                        {cars.filter(c => c.status === "Rented").length}
                    </span>
                </Link>

                <Link
                    to="/admin/customers"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 no-underline"
                >
                    <Users size={18} />
                    Customers
                </Link>

                <Link
                    to="/admin/analytics"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 no-underline"
                >
                    <TrendingUp size={18} />
                    Analytics
                </Link>

            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-black text-white flex">

            {/* MOBILE SIDEBAR */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
                        />

                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            className="fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-white/10 p-6 z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* DESKTOP SIDEBAR */}
            <aside className="w-64 bg-zinc-900 border-r border-white/10 p-6 hidden lg:flex flex-col">
                <SidebarContent />
            </aside>

            {/* MAIN */}
            <main className="flex-1 flex flex-col">

                {/* HEADER */}
                <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-20">

                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-6">

                        <div className="flex flex-col items-end">
                            <span className="text-yellow-500 font-bold">
                                {currentTime.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>

                            <span className="text-[10px] text-gray-400 uppercase">
                                {currentTime.toLocaleDateString()}
                            </span>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-black">
                            AD
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="p-8">

                    {/* STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-3xl font-black">
                                {cars.length}
                            </h3>

                            <p className="text-gray-400 text-xs uppercase mt-2">
                                Total Fleet
                            </p>
                        </div>

                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-3xl font-black text-yellow-500">
                                {cars.filter(c => c.status === "Rented").length}
                            </h3>

                            <p className="text-gray-400 text-xs uppercase mt-2">
                                Active Rented
                            </p>
                        </div>

                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-3xl font-black text-green-400">
                                {cars.filter(c => c.status === "Available").length}
                            </h3>

                            <p className="text-gray-400 text-xs uppercase mt-2">
                                Available
                            </p>
                        </div>

                    </div>

                    {/* SEARCH */}
                    <div className="mb-6 relative max-w-md">
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none"
                        />
                    </div>

                    {/* TABLE */}
                    <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden">

                        {loading ? (
                            <div className="p-20 flex justify-center">
                                <Loader2 className="animate-spin" size={40} />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead>
                                        <tr className="bg-white/5 text-left text-xs uppercase text-gray-400">
                                            <th className="px-6 py-4">Vehicle</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Daily Rate</th>
                                            <th className="px-6 py-4">Location</th>
                                            <th className="px-6 py-4">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {displayedCars.map((car) => (

                                            <tr
                                                key={car.id}
                                                className="border-t border-white/5 hover:bg-white/[0.03]"
                                            >

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">

                                                        <img
                                                            src={car.image}
                                                            alt={car.name}
                                                            className="w-14 h-14 rounded-lg object-cover"
                                                        />

                                                        <div>
                                                            <h3 className="font-bold">
                                                                {car.name}
                                                            </h3>

                                                            <p className="text-xs text-gray-400">
                                                                {car.brand}
                                                            </p>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 capitalize">
                                                    {car.category}
                                                </td>

                                                <td className="px-6 py-4 text-yellow-500 font-bold">
                                                    AED {car.priceDay.toLocaleString()}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                    {car.location}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() => {
                                                                setSelectedCar(car);
                                                                setIsEditing(true);
                                                            }}
                                                            className="p-2 hover:bg-white/10 rounded-lg"
                                                        >
                                                            <Edit size={16} />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteCar(car.id)}
                                                            className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* EDIT MODAL */}
            <AnimatePresence>
                {isEditing && selectedCar && (

                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-50"
                            onClick={() => setIsEditing(false)}
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed top-0 right-0 w-full max-w-lg h-full bg-zinc-900 z-50 p-8 overflow-y-auto"
                        >

                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black">
                                    Edit Vehicle
                                </h2>

                                <button
                                    onClick={() => setIsEditing(false)}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form
                                onSubmit={handleUpdateCar}
                                className="space-y-6"
                            >

                                <div>
                                    <label className="block mb-2 text-sm">
                                        Brand
                                    </label>

                                    <input
                                        type="text"
                                        value={selectedCar.brand}
                                        onChange={(e) =>
                                            setSelectedCar({
                                                ...selectedCar,
                                                brand: e.target.value
                                            })
                                        }
                                        className="w-full bg-black border border-white/10 rounded-xl p-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm">
                                        Car Name
                                    </label>

                                    <input
                                        type="text"
                                        value={selectedCar.name}
                                        onChange={(e) =>
                                            setSelectedCar({
                                                ...selectedCar,
                                                name: e.target.value
                                            })
                                        }
                                        className="w-full bg-black border border-white/10 rounded-xl p-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm">
                                        Price Per Day
                                    </label>

                                    <input
                                        type="number"
                                        value={selectedCar.priceDay}
                                        onChange={(e) =>
                                            setSelectedCar({
                                                ...selectedCar,
                                                priceDay: e.target.value // Update priceDay (camelCase)
                                            })
                                        }
                                        className="w-full bg-black border border-white/10 rounded-xl p-3"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-yellow-500 text-black py-4 rounded-xl font-black flex justify-center items-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>

                            </form>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;