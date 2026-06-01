<?php

namespace App\Services;

use App\Integrations\TMDb\TMDbService;
use App\Models\Genre;
use Illuminate\Support\Facades\Cache;

/**
 * GenreService — Mengelola logika bisnis untuk genre film
 */
class GenreService
{
    public function __construct(
        private readonly TMDbService $tmdb
    ) {}

    /**
     * Ambil semua genre, gabungkan dari database & TMDb
     * Data di-cache 30 menit untuk menghemat API call
     *
     * @return array
     */
    public function getAllGenres(): array
    {
        return Cache::remember('tmdb_genres', 60 * 30, function () {
            // Ambil dari TMDb
            $tmdbGenres = $this->tmdb->getGenres();

            // Simpan atau update ke database lokal
            foreach ($tmdbGenres as $genre) {
                Genre::updateOrCreate(
                    ['tmdb_genre_id' => $genre['id']],
                    ['name'          => $genre['name']]
                );
            }

            // Kembalikan dari database (sudah sinkron)
            return Genre::orderBy('name')
                ->get(['id', 'tmdb_genre_id', 'name'])
                ->toArray();
        });
    }
}
