<?php

namespace App\Integrations\TMDb;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Exceptions\TMDbException;

/**
 * TMDbService — Kelas integrasi dengan The Movie Database API
 *
 * Kelas ini bertanggung jawab untuk:
 * - Melakukan HTTP request ke TMDb API
 * - Menangani error dari API
 * - Mengembalikan data yang sudah diformat
 *
 * Kenapa dipisah? Supaya jika TMDb API berubah, kita hanya ubah file ini.
 */
class TMDbService
{
    private string $apiKey;
    private string $baseUrl;
    private string $imageBaseUrl;

    public function __construct()
    {
        $this->apiKey      = config('services.tmdb.api_key');
        $this->baseUrl     = config('services.tmdb.base_url');
        $this->imageBaseUrl = config('services.tmdb.image_base_url');
    }

    /**
     * Ambil daftar genre film dari TMDb
     *
     * Endpoint: GET /genre/movie/list
     *
     * @return array
     */
    public function getGenres(): array
    {
        $response = $this->makeRequest('/genre/movie/list');
        return $response['genres'] ?? [];
    }

    /**
     * Ambil daftar film berdasarkan filter (discover)
     *
     * Endpoint: GET /discover/movie
     *
     * @param array $filters ['genre_id', 'year', 'min_rating', 'page']
     * @return array
     */
    public function discoverMovies(array $filters = []): array
    {
        $params = [
            'include_adult'         => 'false',      // Selalu exclude konten dewasa
            'include_video'         => 'false',
            'language'              => 'en-US',
            'sort_by'               => 'popularity.desc',
            'page'                  => $filters['page'] ?? 1,
        ];

        // Filter genre jika ada
        if (!empty($filters['genre_id'])) {
            $params['with_genres'] = $filters['genre_id'];
        }

        // Filter tahun jika ada
        if (!empty($filters['year'])) {
            $params['primary_release_year'] = $filters['year'];
        }

        // Filter rating minimum jika ada
        if (!empty($filters['min_rating'])) {
            $params['vote_average.gte'] = $filters['min_rating'];
            $params['vote_count.gte']   = 50; // Minimal 50 vote agar rating valid
        }

        $response = $this->makeRequest('/discover/movie', $params);

        return [
            'results'       => $response['results'] ?? [],
            'total_pages'   => $response['total_pages'] ?? 1,
            'total_results' => $response['total_results'] ?? 0,
        ];
    }

    /**
     * Ambil detail lengkap satu film
     *
     * Endpoint: GET /movie/{movie_id}
     *
     * @param int $movieId
     * @return array
     */
    public function getMovieDetail(int $movieId): array
    {
        return $this->makeRequest("/movie/{$movieId}", [
            'append_to_response' => 'credits,keywords',
        ]);
    }

    /**
     * Ambil video/trailer film dari TMDb
     *
     * Endpoint: GET /movie/{movie_id}/videos
     *
     * @param int $movieId
     * @return string|null YouTube URL jika trailer ditemukan, null jika tidak ada
     */
    public function getMovieTrailer(int $movieId): ?string
    {
        $response = $this->makeRequest("/movie/{$movieId}/videos");
        $videos   = $response['results'] ?? [];

        // Cari trailer YouTube (prioritas: Official Trailer)
        $trailer = collect($videos)
            ->filter(fn($v) => $v['site'] === 'YouTube' && $v['type'] === 'Trailer')
            ->sortByDesc(fn($v) => $v['official'] ?? false)
            ->first();

        if (!$trailer) {
            // Fallback ke video YouTube apapun jika tidak ada trailer
            $trailer = collect($videos)
                ->filter(fn($v) => $v['site'] === 'YouTube')
                ->first();
        }

        return $trailer
            ? "https://www.youtube.com/watch?v={$trailer['key']}"
            : null;
    }

    /**
     * Format URL poster lengkap
     *
     * @param string|null $posterPath
     * @return string|null
     */
    public function getPosterUrl(?string $posterPath): ?string
    {
        if (!$posterPath) return null;
        return $this->imageBaseUrl . $posterPath;
    }

    /**
     * Method inti: melakukan HTTP request ke TMDb API
     *
     * @param string $endpoint  Contoh: '/genre/movie/list'
     * @param array  $params    Query parameters tambahan
     * @return array
     * @throws TMDbException
     */
    private function makeRequest(string $endpoint, array $params = []): array
    {
        // Selalu tambahkan API key
        $params['api_key'] = $this->apiKey;

        try {
            $response = Http::timeout(15)
                ->retry(2, 500) // Coba ulang 2x jika gagal, jeda 500ms
                ->get($this->baseUrl . $endpoint, $params);

            if ($response->failed()) {
                Log::error('TMDb API error', [
                    'endpoint'    => $endpoint,
                    'status'      => $response->status(),
                    'body'        => $response->body(),
                ]);

                // Tangani error spesifik dari TMDb
                if ($response->status() === 401) {
                    throw new TMDbException('API key TMDb tidak valid atau kedaluwarsa.', 401);
                }

                if ($response->status() === 404) {
                    throw new TMDbException('Resource tidak ditemukan di TMDb.', 404);
                }

                throw new TMDbException(
                    "TMDb API mengembalikan error: HTTP {$response->status()}",
                    $response->status()
                );
            }

            return $response->json() ?? [];

        } catch (TMDbException $e) {
            throw $e; // Re-throw TMDb exceptions
        } catch (\Exception $e) {
            Log::error('TMDb connection error', [
                'message' => $e->getMessage(),
            ]);
            throw new TMDbException('Gagal terhubung ke TMDb API. Coba lagi nanti.', 503);
        }
    }
}
