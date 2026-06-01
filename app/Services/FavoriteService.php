<?php

namespace App\Services;

use App\Models\Favorite;
use Illuminate\Database\Eloquent\Collection;

/**
 * FavoriteService — Mengelola logika bisnis untuk film favorit
 */
class FavoriteService
{
    /**
     * Ambil semua favorit milik user
     *
     * @param int $userId
     * @return Collection
     */
    public function getUserFavorites(int $userId): Collection
    {
        return Favorite::where('user_id', $userId)
            ->latest()
            ->get();
    }

    /**
     * Tambah film ke favorit
     *
     * @param int   $userId
     * @param array $data   Data film dari request
     * @return array  ['favorite' => Favorite, 'already_exists' => bool]
     */
    public function addFavorite(int $userId, array $data): array
    {
        $exists = Favorite::where('user_id', $userId)
            ->where('movie_id', $data['movie_id'])
            ->exists();

        if ($exists) {
            return [
                'favorite'      => null,
                'already_exists' => true,
            ];
        }

        $favorite = Favorite::create([
            'user_id'      => $userId,
            'movie_id'     => $data['movie_id'],
            'movie_title'  => $data['movie_title'],
            'poster_path'  => $data['poster_path'] ?? null,
            'release_year' => $data['release_year'] ?? null,
            'rating'       => $data['rating'] ?? null,
        ]);

        return [
            'favorite'       => $favorite,
            'already_exists' => false,
        ];
    }

    /**
     * Hapus film dari favorit
     *
     * @param int $favoriteId
     * @param int $userId  Untuk memastikan user hanya bisa hapus favorit miliknya
     * @return bool
     */
    public function removeFavorite(int $favoriteId, int $userId): bool
    {
        $favorite = Favorite::where('id', $favoriteId)
            ->where('user_id', $userId)
            ->first();

        if (!$favorite) {
            return false;
        }

        $favorite->delete();
        return true;
    }
}
