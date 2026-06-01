<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'movie_id',
        'movie_title',
        'poster_path',
        'release_year',
        'rating',
    ];

    protected $casts = [
        'rating' => 'float',
        'movie_id' => 'integer',
    ];

    // Relasi: Favorit dimiliki oleh satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}


// <?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class Favorite extends Model
// {
//     //
// }
