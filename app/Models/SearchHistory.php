<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SearchHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'genre_id',
        'year',
        'rating',
        'searched_at',
    ];

    protected $casts = [
        'searched_at' => 'datetime',
        'rating' => 'float',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Genre
    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }
}




// <?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class SearchHistory extends Model
// {
//     //
// }
