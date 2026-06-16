import { useState } from "react";
import { Play, Heart, Star, Calendar, Users } from "lucide-react";

export default function HeroSection({ movie, onSaveFavorite }) {
    const [imgError, setImgError] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSaveFavorite(movie);
        setSaving(false);
    };

    const handleTrailer = () => {
        if (movie.trailer_url) {
            window.open(movie.trailer_url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <section className="relative">
            {/* ─── BACKDROP IMMERSIVE ─────────────────────────────────────── */}
            <div className="relative w-full h-[45vh] md:h-[52vh] overflow-hidden">
                {movie.backdrop_url && !imgError ? (
                    <img
                        src={movie.backdrop_url}
                        alt={`${movie.title} backdrop`}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover object-center"
                    />
                ) : (
                    /* Fallback: gradasi warna jika tidak ada backdrop */
                    <div
                        className="w-full h-full"
                        style={{
                            background:
                                "linear-gradient(135deg, #2C3020, #4A533C, #3B4231)",
                        }}
                    />
                )}

                {/* Overlay gradasi — menyatukan backdrop dengan background bawah */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to top, #3B4231 0%, #3B423180 40%, rgba(0,0,0,0.4) 100%)",
                    }}
                />

                {/* Overlay kiri untuk kontras teks */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to right, rgba(44,48,32,0.7) 0%, transparent 60%)",
                    }}
                />
            </div>

            {/* ─── POSTER + INFO (TUMPANG TINDIH DENGAN BACKDROP) ─────────── */}
            <div className="relative px-4 md:px-8 max-w-5xl mx-auto">
                <div className="flex items-end gap-5 md:gap-7 -mt-24 md:-mt-32 pb-6">
                    {/* Poster Film */}
                    <div className="flex-shrink-0">
                        {movie.poster_url ? (
                            <img
                                src={movie.poster_url}
                                alt={movie.title}
                                className="w-32 md:w-44 rounded-lg shadow-2xl shadow-black/60 ring-2 ring-white/10"
                            />
                        ) : (
                            <div className="w-32 md:w-44 aspect-[2/3] bg-olive-600 rounded-lg shadow-2xl flex items-center justify-center">
                                <span className="text-white/30 text-xs font-sans">
                                    No Poster
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Info Film */}
                    <div className="flex-1 min-w-0 pb-2">
                        {/* Genre tags */}
                        {movie.genre_ids?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {movie.genre_ids.slice(0, 3).map((gid) => (
                                    <span
                                        key={gid}
                                        className="text-xs font-sans font-medium text-white/60 border border-white/15 rounded-full px-2.5 py-0.5"
                                    >
                                        #{gid}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Judul + Rating Badge (berdampingan) */}
                        <div className="flex items-start gap-4">
                            <h1 className="font-serif text-2xl md:text-4xl text-white leading-tight flex-1 min-w-0">
                                {movie.title}
                            </h1>

                            {/* Rating Badge sinematik (seperti referensi Wong Kar-wai) */}
                            <div className="flex-shrink-0 rating-badge mt-1">
                                <div className="text-center">
                                    <div className="text-cinema-gold font-serif font-bold text-lg leading-none">
                                        {movie.rating?.toFixed(1)}
                                    </div>
                                    <div className="text-white/40 text-[9px] font-sans tracking-wider mt-0.5">
                                        TMDb
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 mt-2 text-white/50 text-xs font-sans">
                            {movie.release_year && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {movie.release_year}
                                </span>
                            )}
                            {movie.vote_count > 0 && (
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {movie.vote_count.toLocaleString()} votes
                                </span>
                            )}
                        </div>

                        {/* Sinopsis — hanya tampil di desktop (ruang cukup) */}
                        {movie.overview && (
                            <p className="hidden md:block text-white/65 font-sans text-sm leading-relaxed mt-3 line-clamp-3">
                                {movie.overview}
                            </p>
                        )}
                    </div>
                </div>

                {/* Sinopsis di mobile */}
                {movie.overview && (
                    <p className="md:hidden text-white/65 font-sans text-sm leading-relaxed mb-4 px-0">
                        {movie.overview}
                    </p>
                )}

                {/* Tombol Aksi */}
                <div className="flex flex-wrap gap-3 pb-8">
                    {movie.trailer_available && (
                        <button onClick={handleTrailer} className="btn-primary">
                            <Play className="w-4 h-4 fill-olive-800" />
                            Tonton Trailer
                        </button>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-outline disabled:opacity-50"
                    >
                        <Heart
                            className={`w-4 h-4 ${saving ? "fill-red-400 text-red-400" : ""}`}
                        />
                        {saving ? "Menyimpan..." : "Simpan ke Favorit"}
                    </button>
                </div>

                {/* Garis dekoratif */}
                <div className="border-t border-white/8 mb-8" />
            </div>
        </section>
    );
}
