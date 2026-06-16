<?php

namespace App\Services;

use App\Integrations\TMDb\TMDbService;

/**
 * MovieDetailService — format detail film lengkap: info dasar, cast, gallery, related movies
 */
class MovieDetailService
{
    public function __construct(
        private readonly TMDbService $tmdb
    ) {}

    public function getFullDetail(int $movieId): ?array
    {
        $movie = $this->tmdb->getMovieDetail($movieId);

        if (empty($movie) || !isset($movie['id'])) {
            return null;
        }

        return [
            'id'           => $movie['id'],
            'title'        => $movie['title'],
            'overview'     => $movie['overview'],
            'poster_url'   => $this->tmdb->getPosterUrl($movie['poster_path'] ?? null),
            'backdrop_url' => $movie['backdrop_path']
                ? 'https://image.tmdb.org/t/p/w1280' . $movie['backdrop_path']
                : null,
            'release_date' => $movie['release_date'] ?? null,
            'release_year' => isset($movie['release_date']) ? substr($movie['release_date'], 0, 4) : null,
            'rating'       => round($movie['vote_average'] ?? 0, 1),
            'vote_count'   => $movie['vote_count'] ?? 0,

            // CAST — sebelumnya sudah di-fetch tapi tidak pernah diformat/dikirim
            'cast' => collect($movie['credits']['cast'] ?? [])
                ->take(12)
                ->map(fn ($actor) => [
                    'id'          => $actor['id'],
                    'name'        => $actor['name'],
                    'character'   => $actor['character'] ?? null,
                    'profile_url' => $actor['profile_path']
                        ? 'https://image.tmdb.org/t/p/w185' . $actor['profile_path']
                        : null,
                ])
                ->values()
                ->all(),

            // GALLERY — endpoint images TMDb sebelumnya tidak pernah dipanggil
            'gallery' => collect($movie['images']['backdrops'] ?? [])
                ->take(12)
                ->map(fn ($img) => 'https://image.tmdb.org/t/p/w780' . $img['file_path'])
                ->values()
                ->all(),

            // RELATED MOVIES — sebelumnya tidak ada endpoint sama sekali di backend
            'related' => collect($movie['recommendations']['results'] ?? [])
                ->take(12)
                ->map(fn ($m) => [
                    'id'         => $m['id'],
                    'title'      => $m['title'],
                    'poster_url' => $this->tmdb->getPosterUrl($m['poster_path'] ?? null),
                    'rating'     => round($m['vote_average'] ?? 0, 1),
                ])
                ->values()
                ->all(),
        ];
    }
}
