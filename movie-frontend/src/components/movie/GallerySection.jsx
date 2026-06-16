import { useState, useEffect } from "react";
import { movieAPI } from "../../api/client";

export default function GallerySection({ movieId }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        if (!movieId) return;
        setLoading(true);
        movieAPI
            .getDetail(movieId)
            .then((res) => {
                const gallery = res.data.data?.gallery || [];
                setImages(gallery);
            })
            // .then((res) => {
            //     console.log("GALLERY RESPONSE:", res.data);

            //     const backdrops = res.data.data?.images?.backdrops || [];
            //     // Ambil maks 12 gambar, sort by vote_average
            //     const sorted = backdrops
            //         .sort(
            //             (a, b) => (b.vote_average || 0) - (a.vote_average || 0),
            //         )
            //         .slice(0, 12);
            //     setImages(sorted);
            // })
            .catch(() => setImages([]))
            .finally(() => setLoading(false));
    }, [movieId]);

    if (loading) {
        return (
            <div className="px-4 md:px-8 max-w-5xl mx-auto mb-10">
                <div className="text-center mb-5">
                    <span className="text-xs font-sans font-medium text-white/30 tracking-widest uppercase">
                        Gallery
                    </span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-video skeleton rounded"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (images.length === 0) return null;

    return (
        <section className="px-4 md:px-8 max-w-5xl mx-auto mb-10">
            {/* Section Title */}
            <div className="text-center mb-5">
                <span className="text-xs font-sans font-medium text-white/35 tracking-widest uppercase">
                    Gallery
                </span>
            </div>

            {/* Grid Foto Adegan */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-2">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setLightbox(img)}
                        className="group aspect-video overflow-hidden rounded bg-olive-700 focus:outline-none focus:ring-2 focus:ring-cinema-gold/40"
                    >
                        <img
                            src={img}
                            alt={`Scene ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover rounded transition duration-300 group-hover:scale-105 group-hover:opacity-80"
                        />
                    </button>
                ))}
            </div>
            {/* {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setLightbox(img)}
                        className="group aspect-video overflow-hidden rounded bg-olive-700 focus:outline-none focus:ring-2 focus:ring-cinema-gold/40"
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                            alt={`Scene ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover rounded transition duration-300 group-hover:scale-105 group-hover:opacity-80"
                        />
                    </button>
                ))}
            </div> */}

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <img
                        // src={`https://image.tmdb.org/t/p/original${lightbox.file_path}`}
                        src={lightbox}
                        alt="Scene"
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-4 right-4 text-white/60 hover:text-white font-sans text-sm"
                    >
                        ✕ Tutup
                    </button>
                </div>
            )}
        </section>
    );
}
