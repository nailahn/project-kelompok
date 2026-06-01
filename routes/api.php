<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\FavoriteController;
use App\Http\Controllers\API\GenreController;
use App\Http\Controllers\API\HistoryController;
use App\Http\Controllers\API\RecommendationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Semua route sudah di-prefix /api secara otomatis oleh Laravel
| Route yang dilindungi Sanctum menggunakan middleware 'auth:sanctum'
|
*/

// ============================================================
// PUBLIC ROUTES — Tidak perlu login
// ============================================================

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// Genre bisa diakses publik (untuk halaman landing misalnya)
Route::get('/genres', [GenreController::class, 'index']);

// ============================================================
// PROTECTED ROUTES — Wajib login dengan Sanctum token
// ============================================================

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Rekomendasi Film
    Route::get('/recommendations', [RecommendationController::class, 'recommend']);

    // Favorit
    Route::prefix('favorites')->group(function () {
        Route::get('/',       [FavoriteController::class, 'index']);
        Route::post('/',      [FavoriteController::class, 'store']);
        Route::delete('/{id}', [FavoriteController::class, 'destroy']);
    });

    // Riwayat Pencarian
    Route::get('/history', [HistoryController::class, 'index']);
});



// <?php

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
