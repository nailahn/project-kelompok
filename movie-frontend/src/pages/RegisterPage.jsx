import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Film, User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            await register(
                form.name,
                form.email,
                form.password,
                form.password_confirmation,
            );
            navigate("/");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                setErrors({ general: "Terjadi kesalahan. Coba lagi." });
            }
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ label, name, type = "text", icon: Icon, placeholder }) => (
        <div>
            <label className="block text-xs font-sans font-medium text-white/60 tracking-widest uppercase mb-2">
                {label}
            </label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    type={type}
                    value={form[name]}
                    onChange={(e) =>
                        setForm({ ...form, [name]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/25 text-sm font-sans focus:outline-none focus:border-cinema-gold/50 transition"
                />
            </div>
            {errors[name] && (
                <p className="text-red-400 text-xs mt-1">{errors[name][0]}</p>
            )}
        </div>
    );

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-10"
            style={{
                background:
                    "linear-gradient(135deg, #2C3020 0%, #3B4231 50%, #2C3020 100%)",
            }}
        >
            <div className="w-full max-w-md animate-fade-up">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <Film className="w-6 h-6 text-cinema-gold" />
                        <span className="font-serif text-xl text-white">
                            CineMatch
                        </span>
                    </div>
                    <h1 className="font-serif text-3xl text-white mb-1">
                        Buat akun baru
                    </h1>
                    <p className="text-white/50 text-sm">
                        Temukan film yang tepat untukmu malam ini
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-olive-700/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-4"
                >
                    {errors.general && (
                        <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                            {errors.general}
                        </div>
                    )}

                    <Field
                        label="Nama Lengkap"
                        name="name"
                        icon={User}
                        placeholder="John Doe"
                    />
                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        icon={Mail}
                        placeholder="nama@email.com"
                    />
                    <Field
                        label="Password"
                        name="password"
                        type="password"
                        icon={Lock}
                        placeholder="Min. 8 karakter"
                    />
                    <Field
                        label="Ulangi Password"
                        name="password_confirmation"
                        type="password"
                        icon={Lock}
                        placeholder="Ulangi password"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary justify-center py-3 rounded-xl mt-2 disabled:opacity-50"
                    >
                        {loading ? "Mendaftar..." : "Daftar Sekarang"}
                    </button>
                </form>

                <p className="text-center text-white/40 text-sm mt-6 font-sans">
                    Sudah punya akun?{" "}
                    <Link
                        to="/login"
                        className="text-cinema-gold hover:text-cinema-cream transition"
                    >
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}
