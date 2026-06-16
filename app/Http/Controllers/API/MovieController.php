<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\MovieDetailService;
use Illuminate\Http\JsonResponse;

class MovieController extends Controller
{
    public function __construct(
        private readonly MovieDetailService $movieDetailService
    ) {}

    /**
     * GET /api/movies/{id}
     */
    public function show(int $id): JsonResponse
    {
        $movie = $this->movieDetailService->getFullDetail($id);

        if (!$movie) {
            return response()->json([
                'success' => false,
                'message' => 'Film tidak ditemukan.',
                'data'    => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail film berhasil diambil.',
            'data'    => $movie,
        ]);
    }
}

// namespace App\Http\Controllers\API;

// use App\Http\Controllers\Controller;
// use App\Integrations\TMDb\TMDbService;
// use Illuminate\Http\JsonResponse;
// use Illuminate\Support\Facades\Cache;

// class MovieController extends Controller
// {
//     public function __construct(
//         private readonly TMDbService $tmdb
//     ) {}

//     /**
//      * GET /api/movies/{id}
//      * Ambil detail lengkap film: credits, images, watch providers
//      * Di-cache 1 jam karena data film jarang berubah
//      */
//     public function show(int $id): JsonResponse
//     {
//         $data = Cache::remember("movie_detail_{$id}", 3600, function () use ($id) {
//             return $this->tmdb->getMovieFullDetail($id);
//         });

//         return response()->json([
//             'success' => true,
//             'message' => 'Detail film berhasil diambil.',
//             'data'    => $data,
//         ]);
//     }
// }
