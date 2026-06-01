<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\GenreService;
use Illuminate\Http\JsonResponse;

class GenreController extends Controller
{
    public function __construct(
        private readonly GenreService $genreService
    ) {}

    /**
     * GET /api/genres
     * Ambil semua genre film (di-cache 30 menit)
     */
    public function index(): JsonResponse
    {
        $genres = $this->genreService->getAllGenres();

        return response()->json([
            'success' => true,
            'message' => 'Genre berhasil diambil.',
            'data'    => $genres,
        ]);
    }
}
