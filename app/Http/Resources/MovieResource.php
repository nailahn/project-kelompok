<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * MovieResource — Format output data film
 *
 * Digunakan untuk format respons rekomendasi film dari TMDb
 */
class MovieResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->resource['id'],
            'title'              => $this->resource['title'],
            'overview'           => $this->resource['overview'],
            'poster_url'         => $this->resource['poster_url'],
            'backdrop_url'       => $this->resource['backdrop_url'],
            'release_date'       => $this->resource['release_date'],
            'release_year'       => $this->resource['release_year'],
            'rating'             => $this->resource['rating'],
            'vote_count'         => $this->resource['vote_count'],
            'genre_ids'          => $this->resource['genre_ids'],
            'trailer_url'        => $this->resource['trailer_url'],
            'trailer_available'  => $this->resource['trailer_available'],
        ];
    }
}


// <?php

// namespace App\Http\Resources;

// use Illuminate\Http\Request;
// use Illuminate\Http\Resources\Json\JsonResource;

// class MovieResource extends JsonResource
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
