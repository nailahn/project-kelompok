<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\FavoriteRequest;
use App\Http\Resources\FavoriteResource;
use App\Services\FavoriteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function __construct(
        private readonly FavoriteService $favoriteService
    ) {}

    /**
     * GET /api/favorites
     * Ambil semua film favorit user
     */
    public function index(Request $request): JsonResponse
    {
        $favorites = $this->favoriteService->getUserFavorites($request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Daftar favorit berhasil diambil.',
            'data'    => FavoriteResource::collection($favorites),
        ]);
    }

    /**
     * POST /api/favorites
     * Tambah film ke favorit
     */
    public function store(FavoriteRequest $request): JsonResponse
    {
        $result = $this->favoriteService->addFavorite(
            $request->user()->id,
            $request->validated()
        );

        if ($result['already_exists']) {
            return response()->json([
                'success' => false,
                'message' => 'Film ini sudah ada di daftar favorit kamu.',
                'data'    => null,
            ], 409); // 409 Conflict
        }

        return response()->json([
            'success' => true,
            'message' => 'Film berhasil ditambahkan ke favorit.',
            'data'    => new FavoriteResource($result['favorite']),
        ], 201);
    }

    /**
     * DELETE /api/favorites/{id}
     * Hapus film dari favorit
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $deleted = $this->favoriteService->removeFavorite($id, $request->user()->id);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Favorit tidak ditemukan atau bukan milik kamu.',
                'data'    => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Film berhasil dihapus dari favorit.',
            'data'    => null,
        ]);
    }
}
