import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Film, Heart, Clock, LogOut, User } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { pathname } = useLocation();

    const navLink = (to, label, Icon) => {
        const active = pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-1.5 text-sm font-sans transition
              ${
                  active
                      ? "text-white font-medium"
                      : "text-white/45 hover:text-white/75"
              }`}
            >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
            </Link>
        );
    };

    return (
        <nav className="sticky top-0 z-40 border-b border-white/8 bg-olive-800/90 backdrop-blur-md">
            <div className="max-w-5xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <Film className="w-5 h-5 text-cinema-gold group-hover:rotate-12 transition duration-300" />
                    <span className="font-serif text-base text-white tracking-wide">
                        CineMatch
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-5">
                    {navLink("/", "Discover", Film)}
                    {navLink("/favorites", "Favorit", Heart)}
                    {navLink("/history", "Riwayat", Clock)}
                </div>

                {/* User */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 text-white/40 text-xs font-sans">
                        <User className="w-3.5 h-3.5" />
                        <span>{user?.name?.split(" ")[0]}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-1.5 text-white/35 hover:text-white/70 transition text-xs font-sans"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Keluar</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
