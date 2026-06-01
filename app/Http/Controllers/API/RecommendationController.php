<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\RecommendationRequest;
use App\Http\Resources\MovieResource;
use App\Services\RecommendationService;
use Illuminate\Http\JsonResponse;

class RecommendationController extends Controller
{
    public function __construct(
        private readonly RecommendationService $recommendationService
    ) {}

    /**
     * GET /api/recommendations
     *
     * Proses:
     * 1. Validasi input dari user
     * 2. Panggil RecommendationService
     * 3. Kembalikan film rekomendasi atau pesan kosong
     */
    public function recommend(RecommendationRequest $request): JsonResponse
    {
        $filters = [
            'genre_id'   => $request->input('genre_id'),
            'year'       => $request->input('year'),
            'min_rating' => $request->input('min_rating'),
        ];

        $movie = $this->recommendationService->getRecommendation(
            $filters,
            $request->user()->id
        );

        if (!$movie) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada film yang ditemukan sesuai kriteria kamu. Coba ubah filter.',
                'data'    => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Rekomendasi film berhasil ditemukan.',
            'data'    => new MovieResource($movie),
        ]);
    }
}
