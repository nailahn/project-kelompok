<?php

namespace App\Services;

use App\Integrations\TMDb\TMDbService;
use App\Models\Genre;
use App\Models\SearchHistory;
use Illuminate\Support\Collection;

/**
 * RecommendationService — Logika inti rekomendasi film
 *
 * Alur:
 * 1. Terima filter dari user (genre, tahun, rating)
 * 2. Panggil TMDb discover/movie
 * 3. Acak hasil, pilih 1 film
 * 4. Ambil trailer YouTube
 * 5. Simpan ke search history
 * 6. Kembalikan data film
 */
class RecommendationService
{
    // Jumlah halaman yang diambil untuk meningkatkan variasi rekomendasi
    private const MAX_PAGES_TO_SAMPLE = 5;

    public function __construct(
        private readonly TMDbService $tmdb
    ) {}

    /**
     * Dapatkan satu rekomendasi film secara acak
     *
     * @param array $filters  ['genre_id', 'year', 'min_rating']
     * @param int   $userId   ID user yang sedang login
     * @return array|null     Data film atau null jika tidak ditemukan
     */
    public function getRecommendation(array $filters, int $userId): ?array
    {
        // LANGKAH 1: Ambil data awal dari TMDb (halaman 1)
        $initialResult = $this->tmdb->discoverMovies($filters);

        if (empty($initialResult['results'])) {
            return null; // Tidak ada film yang cocok
        }

        // LANGKAH 2: Kumpulkan film dari beberapa halaman (untuk variasi)
        $totalPages    = min($initialResult['total_pages'], self::MAX_PAGES_TO_SAMPLE);
        $allMovies     = collect($initialResult['results']);

        // Jika ada lebih dari 1 halaman, ambil halaman acak lain
        if ($totalPages > 1) {
            $randomPage = rand(2, $totalPages);
            $extraResult = $this->tmdb->discoverMovies(array_merge($filters, ['page' => $randomPage]));
            $allMovies = $allMovies->merge($extraResult['results'] ?? []);
        }

        // LANGKAH 3: Pilih film secara acak dari pool yang terkumpul
        $selectedMovie = $allMovies->random();

        // LANGKAH 4: Ambil trailer YouTube
        $trailerUrl = $this->tmdb->getMovieTrailer($selectedMovie['id']);

        // LANGKAH 5: Simpan ke search history
        $this->saveSearchHistory($filters, $userId);

        // LANGKAH 6: Format dan kembalikan respons
        return $this->formatMovieData($selectedMovie, $trailerUrl);
    }

    /**
     * Simpan riwayat pencarian user ke database
     */
    private function saveSearchHistory(array $filters, int $userId): void
    {
        // Cari genre_id di database lokal berdasarkan tmdb_genre_id
        $genreId = null;
        if (!empty($filters['genre_id'])) {
            $genre   = Genre::where('tmdb_genre_id', $filters['genre_id'])->first();
            $genreId = $genre?->id;
        }

        SearchHistory::create([
            'user_id'     => $userId,
            'genre_id'    => $genreId,
            'year'        => $filters['year'] ?? null,
            'rating'      => $filters['min_rating'] ?? null,
            'searched_at' => now(),
        ]);
    }

    /**
     * Format data film menjadi struktur respons yang konsisten
     */
    private function formatMovieData(array $movie, ?string $trailerUrl): array
    {
        return [
            'id'           => $movie['id'],
            'title'        => $movie['title'],
            'overview'     => $movie['overview'],
            'poster_url'   => $this->tmdb->getPosterUrl($movie['poster_path'] ?? null),
            'backdrop_url' => $movie['backdrop_path']
                ? 'https://image.tmdb.org/t/p/w1280' . $movie['backdrop_path']
                : null,
            'release_date' => $movie['release_date'] ?? null,
            'release_year' => isset($movie['release_date'])
                ? substr($movie['release_date'], 0, 4)
                : null,
            'rating'       => round($movie['vote_average'] ?? 0, 1),
            'vote_count'   => $movie['vote_count'] ?? 0,
            'genre_ids'    => $movie['genre_ids'] ?? [],
            'trailer_url'  => $trailerUrl,
            'trailer_available' => !is_null($trailerUrl),
        ];
    }
}
