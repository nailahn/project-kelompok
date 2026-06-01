<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SearchHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    /**
     * GET /api/history
     * Ambil riwayat pencarian user
     */
    public function index(Request $request): JsonResponse
    {
        $histories = SearchHistory::with('genre')
            ->where('user_id', $request->user()->id)
            ->latest('searched_at')
            ->take(50) // Batasi 50 riwayat terakhir
            ->get()
            ->map(fn($history) => [
                'id'          => $history->id,
                'genre'       => $history->genre
                    ? ['id' => $history->genre->tmdb_genre_id, 'name' => $history->genre->name]
                    : null,
                'year'        => $history->year,
                'min_rating'  => $history->rating,
                'searched_at' => $history->searched_at->toIso8601String(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Riwayat pencarian berhasil diambil.',
            'data'    => $histories,
        ]);
    }
}
