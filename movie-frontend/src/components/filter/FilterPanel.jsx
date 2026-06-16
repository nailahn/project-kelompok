import { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i);
const RATING_OPTIONS = [
    { label: "Semua Rating", value: "" },
    { label: "≥ 9.0 — Masterpiece", value: "9" },
    { label: "≥ 8.0 — Sangat Bagus", value: "8" },
    { label: "≥ 7.0 — Bagus", value: "7" },
    { label: "≥ 6.0 — Cukup Bagus", value: "6" },
];

export default function FilterPanel({ genres, onSearch, loading }) {
    const [filters, setFilters] = useState({
        genre_id: "",
        year: "",
        min_rating: "",
    });
    const [open, setOpen] = useState(true);

    const handleReset = () =>
        setFilters({ genre_id: "", year: "", min_rating: "" });

    const handleSearch = () => {
        const params = {};
        // Hanya kirim filter yang terisi (backend menerima semua sebagai opsional)
        if (filters.genre_id) params.genre_id = Number(filters.genre_id);
        if (filters.year) params.year = Number(filters.year);
        if (filters.min_rating) params.min_rating = Number(filters.min_rating);
        onSearch(params);
    };

    const selectClass =
        "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-sans focus:outline-none focus:border-cinema-gold/40 transition appearance-none cursor-pointer";

    return (
        <div className="bg-olive-700/30 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            {/* Header filter */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white/70">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="text-xs font-sans font-medium tracking-widest uppercase">
                        Filter Film
                    </span>
                </div>
                <button
                    onClick={() => setOpen(!open)}
                    className="text-white/40 hover:text-white/70 text-xs font-sans transition"
                >
                    {open ? "Sembunyikan" : "Tampilkan"}
                </button>
            </div>

            {open && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    {/* Genre */}
                    <div>
                        <label className="block text-xs text-white/40 font-sans mb-1.5 tracking-wide">
                            Genre
                        </label>
                        <div className="relative">
                            <select
                                value={filters.genre_id}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        genre_id: e.target.value,
                                    })
                                }
                                className={selectClass}
                            >
                                <option value="">Semua Genre</option>
                                {genres.map((g) => (
                                    // PENTING: value pakai tmdb_genre_id, bukan id
                                    <option key={g.id} value={g.tmdb_genre_id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tahun */}
                    <div>
                        <label className="block text-xs text-white/40 font-sans mb-1.5 tracking-wide">
                            Tahun Rilis
                        </label>
                        <select
                            value={filters.year}
                            onChange={(e) =>
                                setFilters({ ...filters, year: e.target.value })
                            }
                            className={selectClass}
                        >
                            <option value="">Semua Tahun</option>
                            {YEAR_OPTIONS.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-xs text-white/40 font-sans mb-1.5 tracking-wide">
                            Rating Minimum
                        </label>
                        <select
                            value={filters.min_rating}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    min_rating: e.target.value,
                                })
                            }
                            className={selectClass}
                        >
                            {RATING_OPTIONS.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Tombol aksi */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="btn-primary flex-1 justify-center disabled:opacity-50"
                >
                    {loading ? (
                        <span className="animate-pulse">Mencari...</span>
                    ) : (
                        <>
                            <Search className="w-4 h-4" /> Rekomendasikan Film
                        </>
                    )}
                </button>
                <button
                    onClick={handleReset}
                    title="Reset filter"
                    className="btn-outline px-3 py-2.5"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
