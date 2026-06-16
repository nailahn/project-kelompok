import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Film, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate("/");
        } catch (err) {
            const status = err.response?.status;
            if (status === 422) {
                setErrors(err.response.data.errors || {});
            } else if (status === 401) {
                setErrors({ general: "Email atau password salah." });
            } else {
                setErrors({ general: "Terjadi kesalahan. Coba lagi." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-olive-900 flex items-center justify-center px-4"
            style={{
                background:
                    "linear-gradient(135deg, #2C3020 0%, #3B4231 50%, #2C3020 100%)",
            }}
        >
            {/* Card */}
            <div className="w-full max-w-md animate-fade-up">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <Film className="w-6 h-6 text-cinema-gold" />
                        <span className="font-serif text-xl text-white tracking-wide">
                            CineMatch
                        </span>
                    </div>
                    <h1 className="font-serif text-3xl text-white mb-1">
                        Selamat datang kembali
                    </h1>
                    <p className="text-white/50 text-sm font-sans">
                        Masuk untuk melanjutkan perjalanan sinema kamu
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-olive-700/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-5"
                >
                    {errors.general && (
                        <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                            {errors.general}
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-sans font-medium text-white/60 tracking-widest uppercase mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                placeholder="nama@email.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/25 text-sm font-sans focus:outline-none focus:border-cinema-gold/50 focus:bg-white/8 transition"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.email[0]}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-sans font-medium text-white/60 tracking-widest uppercase mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type={showPass ? "text" : "password"}
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder-white/25 text-sm font-sans focus:outline-none focus:border-cinema-gold/50 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                            >
                                {showPass ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.password[0]}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary justify-center py-3 rounded-xl disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <p className="text-center text-white/40 text-sm mt-6 font-sans">
                    Belum punya akun?{" "}
                    <Link
                        to="/register"
                        className="text-cinema-gold hover:text-cinema-cream transition"
                    >
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </div>
    );
}
