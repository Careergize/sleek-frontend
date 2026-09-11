import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";

const LOGIN_ENDPOINT = "https://api.sleek-cars.com/login/";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch(LOGIN_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            // Try to parse a JSON body even on error responses, since APIs
            // often return a message explaining what went wrong.
            let data = null;
            try {
                data = await response.json();
            } catch (_) {
                // no JSON body — that's fine, we'll fall back to status text
            }

            if (!response.ok) {
                const message =
                    data?.message || data?.error || "Access Denied: Invalid Credentials";
                setError(message);
                return;
            }

            // Adjust these two lines to match whatever your API actually
            // returns (e.g. data.token, data.access_token, data.user, etc.)
            const token = data?.token || data?.access_token;
            if (token) {
                localStorage.setItem("sleekAuthToken", token);
            }
            localStorage.setItem("isSleekAuthenticated", "true");

            navigate("/admin");
        } catch (err) {
            console.error("Login request failed:", err);
            setError("Network Error: Could Not Reach Server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-brand-gold selection:text-brand-dark">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md bg-brand-card p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden"
            >
                {/* Background Accent */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/10 blur-[100px] rounded-full" />

                <div className="text-center mb-12 relative z-10">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-brand-gold">Sleek.</h1>
                    <p className="text-[10px] text-brand-gray tracking-[0.4em] uppercase mt-2 font-bold">Admin Portal Access</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-gold transition-colors" size={18} />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-brand-dark border-white/5 rounded-xl pl-12 h-14 focus:border-brand-gold/30 transition-all text-sm font-bold tracking-tight"
                                placeholder="Enter admin email"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-gold transition-colors" size={18} />
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-brand-dark border-white/5 rounded-xl pl-12 h-14 focus:border-brand-gold/30 transition-all text-sm font-bold tracking-tight"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-[10px] font-black uppercase tracking-[0.15em] text-center bg-red-400/10 py-3 rounded-lg border border-red-400/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-neutral-200 active:scale-95 transition-all uppercase tracking-[0.3em] text-[11px] group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                Authenticating <Loader2 size={16} className="animate-spin" />
                            </>
                        ) : (
                            <>
                                Authenticate <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[9px] text-white/10 font-black uppercase tracking-widest">
                        Protected by Sleek Security Systems
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;