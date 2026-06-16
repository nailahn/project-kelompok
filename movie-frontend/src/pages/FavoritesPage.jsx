import { useState, useEffect } from "react";
import { favoriteAPI } from "../api/client";
import MovieCard from "../components/movie/MovieCard";
import EmptyState from "../components/ui/EmptyState";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        favoriteAPI
            .getAll()
            .then((res) => setFavorites(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleRemove = async (id) => {
        try {
            await favoriteAPI.remove(id);
            // id di sini adalah favorite.id — bukan movie_id
            setFavorites((prev) => prev.filter((f) => f.id !== id));
        } catch (err) {
            console.error("Gagal hapus favorit:", err);
        }
    };

    if (loading) {
        return (
            <div className="px-4 md:px-8 max-w-5xl mx-auto py-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="skeleton aspect-[2/3] rounded-xl" />
                            <div className="skeleton h-3 w-3/4 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 max-w-5xl mx-auto py-8">
            <div className="mb-6">
                <h1 className="font-serif text-3xl text-white mb-1">
                    Film Favorit
                </h1>
                <p className="text-white/40 text-sm font-sans">
                    {favorites.length} film tersimpan
                </p>
            </div>

            {favorites.length === 0 ? (
                <EmptyState
                    title="Belum ada favorit"
                    description="Dapatkan rekomendasi film dan simpan yang kamu sukai."
                    icon={<Heart className="w-8 h-8" />}
                />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {favorites.map((fav) => (
                        <MovieCard
                            key={fav.id}
                            favorite={fav}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
