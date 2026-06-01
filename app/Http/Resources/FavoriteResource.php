<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * FavoriteResource — Format output data favorit
 */
class FavoriteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'movie_id'     => $this->movie_id,
            'movie_title'  => $this->movie_title,
            'poster_url'   => $this->poster_path
                ? 'https://image.tmdb.org/t/p/w500' . $this->poster_path
                : null,
            'release_year' => $this->release_year,
            'rating'       => $this->rating,
            'saved_at'     => $this->created_at->toIso8601String(),
        ];
    }
}










// <?php

// namespace App\Http\Resources;

// use Illuminate\Http\Request;
// use Illuminate\Http\Resources\Json\JsonResource;

// class FavoriteResource extends JsonResource
// {
//     /**
//      * Transform the resource into an array.
//      *
//      * @return array<string, mixed>
//      */
//     public function toArray(Request $request): array
//     {
//         return parent::toArray($request);
//     }
// }
