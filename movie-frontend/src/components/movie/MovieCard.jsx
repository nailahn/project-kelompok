import { Trash2, Star, Calendar } from "lucide-react";

export default function MovieCard({ favorite, onRemove }) {
    return (
        <div className="group relative bg-olive-700/30 border border-white/8 rounded-xl overflow-hidden hover:border-white/20 transition duration-300">
            {/* Poster */}
            <div className="aspect-[2/3] overflow-hidden bg-olive-700">
                {favorite.poster_url ? (
                    <img
                        src={favorite.poster_url}
                        alt={favorite.movie_title}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 font-serif text-2xl">
                        {favorite.movie_title?.charAt(0)}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="text-white/85 text-sm font-sans font-medium leading-tight line-clamp-2 mb-1.5">
                    {favorite.movie_title}
                </h3>
                <div className="flex items-center justify-between text-white/40 text-xs font-sans">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {favorite.release_year || "—"}
                    </span>
                    {favorite.rating > 0 && (
                        <span className="flex items-center gap-1 text-cinema-gold/70">
                            <Star className="w-3 h-3" />
                            {favorite.rating?.toFixed(1)}
                        </span>
                    )}
                </div>
            </div>

            {/* Tombol Hapus (muncul saat hover) */}
            <button
                onClick={() => onRemove(favorite.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-black/60 rounded-lg text-red-400 hover:text-red-300 hover:bg-black/80 transition duration-200"
                title="Hapus dari favorit"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
