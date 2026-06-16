import { useState, useEffect } from "react";
import { genreAPI, recommendationAPI, favoriteAPI } from "../api/client";
import FilterPanel from "../components/filter/FilterPanel";
import HeroSection from "../components/movie/HeroSection";
import GallerySection from "../components/movie/GallerySection";
import CastSection from "../components/movie/CastSection";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import EmptyState from "../components/ui/EmptyState";
import { Shuffle } from "lucide-react";

export default function HomePage() {
    const [genres, setGenres] = useState([]);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [toast, setToast] = useState(null);

    // Muat daftar genre sekali saat halaman pertama dibuka
    useEffect(() => {
        genreAPI
            .getAll()
            .then((res) => setGenres(res.data.data))
            .catch(console.error);
    }, []);

    const handleSearch = async (filters) => {
        setLoading(true);
        setHasSearched(true);
        setMovie(null);
        try {
            const res = await recommendationAPI.get(filters);
            setMovie(res.data.data);
        } catch (err) {
            if (err.response?.status === 404) {
                setMovie(null);
            } else {
                showToast("Gagal memuat rekomendasi. Coba lagi.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveFavorite = async (movieData) => {
        try {
            // Ekstrak poster_path dari full URL
            const posterPath = movieData.poster_url
                ? movieData.poster_url.replace(
                      "https://image.tmdb.org/t/p/w500",
                      "",
                  )
                : null;

            await favoriteAPI.add({
                movie_id: movieData.id,
                movie_title: movieData.title,
                poster_path: posterPath,
                release_year: movieData.release_year,
                rating: movieData.rating,
            });
            showToast("Berhasil disimpan ke favorit!", "success");
        } catch (err) {
            if (err.response?.status === 409) {
                showToast("Film ini sudah ada di favorit kamu.", "warning");
            } else {
                showToast("Gagal menyimpan favorit.", "error");
            }
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    return (
        <div className="min-h-screen">
            {/* Panel Filter di bagian atas */}
            <div className="px-4 pt-8 pb-0 max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">
                        Temukan Film Malam Ini
                    </h1>
                    <p className="text-white/50 font-sans text-sm tracking-wide">
                        Pilih genre, tahun, dan rating — biarkan kami yang
                        memilihkan
                    </p>
                </div>
                <FilterPanel
                    genres={genres}
                    onSearch={handleSearch}
                    loading={loading}
                />
            </div>

            {/* Area Hasil */}
            <div className="mt-6">
                {loading && <SkeletonLoader />}

                {!loading && hasSearched && !movie && (
                    <div className="px-4 max-w-5xl mx-auto">
                        <EmptyState
                            title="Tidak ada film ditemukan"
                            description="Coba ubah filter genre, tahun, atau rating minimummu."
                            icon={<Shuffle className="w-8 h-8" />}
                        />
                    </div>
                )}

                {!loading && movie && (
                    <div className="animate-fade-in">
                        <HeroSection
                            movie={movie}
                            onSaveFavorite={handleSaveFavorite}
                        />
                        <GallerySection movieId={movie.id} />
                        <CastSection movieId={movie.id} />
                    </div>
                )}
            </div>

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-sans font-medium shadow-xl animate-fade-up
          ${toast.type === "success" ? "bg-green-800 text-green-100 border border-green-600/40" : ""}
          ${toast.type === "warning" ? "bg-yellow-800 text-yellow-100 border border-yellow-600/40" : ""}
          ${toast.type === "error" ? "bg-red-900 text-red-100 border border-red-600/40" : ""}
        `}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
