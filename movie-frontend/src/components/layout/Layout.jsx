import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen bg-olive-800">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <footer className="text-center py-6 text-white/20 text-xs font-sans border-t border-white/5 mt-8">
                Powered by <span className="text-cinema-gold/50">TMDb API</span>{" "}
                — CineMatch © 2026
            </footer>
        </div>
    );
}
