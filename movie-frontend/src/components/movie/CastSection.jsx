import { useState, useEffect } from "react";
import { movieAPI } from "../../api/client";
import { Tv2, ExternalLink } from "lucide-react";

// Platform streaming — ikon teks karena tidak ada akses ke logo resmi
const STREAMING_ICONS = {
    Netflix: { bg: "#E50914", letter: "N" },
    "Amazon Prime Video": { bg: "#00A8E0", letter: "P" },
    "Disney Plus": { bg: "#113CCF", letter: "D+" },
    "Apple TV": { bg: "#555555", letter: "🍎" },
    "HBO Max": { bg: "#7C3AED", letter: "HBO" },
    default: { bg: "#3B4231", letter: "▶" },
};

function StreamingBadge({ provider }) {
    const style =
        STREAMING_ICONS[provider.provider_name] || STREAMING_ICONS["default"];
    return (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ backgroundColor: style.bg }}
            >
                {style.letter}
            </div>
            <span className="text-white/70 text-xs font-sans truncate">
                {provider.provider_name}
            </span>
        </div>
    );
}

export default function CastSection({ movieId }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    if (!movieId) return;

    setLoading(true);

    movieAPI
        .getDetail(movieId)
        .then((res) => {
            console.log("CAST RESPONSE:", res.data);
            setDetail(res.data.data);
        })
        .catch(() => {
            setDetail(null);
        })
        .finally(() => {
            setLoading(false);
        });
}, [movieId]);

    // useEffect(() => {
    //     if (!movieId) return;
    //     setLoading(true);
    //     movieAPI.getDetail(movieId).then((res) => {
    //         console.log("CAST RESPONSE:", res.data);
    //         setDetail(res.data.data);
    //     },[movieId]);
    //     movieAPI
    //         .getDetail(movieId)
    //         .then((res) => setDetail(res.data.data))
    //         .catch(() => setDetail(null))
    //         .finally(() => setLoading(false));
    // }, [movieId]);

    if (loading) {
        return (
            <div className="px-4 md:px-8 max-w-5xl mx-auto pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="skeleton h-4 w-24 rounded" />
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="flex gap-3">
                                    <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
                                    <div className="flex-1 space-y-1.5 pt-1">
                                        <div className="skeleton h-3 w-28 rounded" />
                                        <div className="skeleton h-2.5 w-20 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!detail) return null;

    // const cast = detail.credits?.cast?.slice(0, 8) || [];
    const cast = detail.cast?.slice(0, 8) || [];
    const director = detail.credits?.crew?.find((c) => c.job === "Director");
    const providers = detail.watch_providers?.results?.ID?.flatrate || [];
    const genres = detail.genres || [];

    return (
        <section className="px-4 md:px-8 max-w-5xl mx-auto pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* ─── KOLOM 1: CAST ─── */}
                <div>
                    <h3 className="text-xs font-sans font-medium text-white/35 tracking-widest uppercase mb-4">
                        Pemeran Utama
                    </h3>
                    <div className="space-y-3">
                        {cast.length > 0 ? (
                            cast.slice(0, 5).map((actor) => (
                                <div
                                    key={actor.id}
                                    className="flex items-center gap-3"
                                >
                                    {/* Foto aktor */}
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-olive-600 flex-shrink-0">
                                        {/* {actor.profile_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                                                alt={actor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : ( */}
                                        {actor.profile_path ? (
                                            <img
                                                src={actor.profile_url}
                                                alt={actor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/30 text-lg font-serif">
                                                {actor.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white/85 text-sm font-sans font-medium truncate">
                                            {actor.name}
                                        </p>
                                        <p className="text-white/40 text-xs font-sans truncate italic">
                                            {actor.character}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white/30 text-sm font-sans">
                                Data tidak tersedia
                            </p>
                        )}
                    </div>
                </div>

                {/* ─── KOLOM 2: METADATA ─── */}
                <div>
                    <h3 className="text-xs font-sans font-medium text-white/35 tracking-widest uppercase mb-4">
                        Detail Film
                    </h3>
                    <div className="space-y-3">
                        {director && (
                            <div>
                                <p className="text-white/35 text-xs font-sans mb-0.5">
                                    Sutradara
                                </p>
                                <p className="text-white/80 text-sm font-sans">
                                    {director.name}
                                </p>
                            </div>
                        )}
                        {detail.original_title &&
                            detail.original_title !== detail.title && (
                                <div>
                                    <p className="text-white/35 text-xs font-sans mb-0.5">
                                        Judul Asli
                                    </p>
                                    <p className="text-white/80 text-sm font-sans italic">
                                        {detail.original_title}
                                    </p>
                                </div>
                            )}
                        {detail.runtime > 0 && (
                            <div>
                                <p className="text-white/35 text-xs font-sans mb-0.5">
                                    Durasi
                                </p>
                                <p className="text-white/80 text-sm font-sans">
                                    {Math.floor(detail.runtime / 60)}j{" "}
                                    {detail.runtime % 60}m
                                </p>
                            </div>
                        )}
                        {genres.length > 0 && (
                            <div>
                                <p className="text-white/35 text-xs font-sans mb-1.5">
                                    Genre
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {genres.map((g) => (
                                        <span
                                            key={g.id}
                                            className="text-xs font-sans text-white/60 border border-white/15 rounded-full px-2.5 py-0.5"
                                        >
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {detail.original_language && (
                            <div>
                                <p className="text-white/35 text-xs font-sans mb-0.5">
                                    Bahasa Asli
                                </p>
                                <p className="text-white/80 text-sm font-sans uppercase">
                                    {detail.original_language}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── KOLOM 3: WHERE TO WATCH ─── */}
                <div>
                    <h3 className="text-xs font-sans font-medium text-white/35 tracking-widest uppercase mb-4 flex items-center gap-2">
                        <Tv2 className="w-3.5 h-3.5" />
                        Tonton Di
                    </h3>
                    {providers.length > 0 ? (
                        <div className="space-y-2">
                            {providers.slice(0, 5).map((p) => (
                                <StreamingBadge
                                    key={p.provider_id}
                                    provider={p}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Fallback: Link ke JustWatch */}
                            <p className="text-white/35 text-xs font-sans mb-2">
                                Data streaming tidak tersedia untuk region
                                Indonesia.
                            </p>
                            <a
                                href={`https://www.justwatch.com/id/search?q=${encodeURIComponent(detail.title || "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline text-xs py-2 inline-flex"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Cek di JustWatch
                            </a>
                        </div>
                    )}

                    {/* TMDb link */}
                    <a
                        href={`https://www.themoviedb.org/movie/${movieId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-white/25 hover:text-white/50 text-xs font-sans mt-4 transition"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Lihat di TMDb
                    </a>
                </div>
            </div>
        </section>
    );
}
