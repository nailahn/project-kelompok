<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    use HasFactory;

    protected $fillable = [
        'tmdb_genre_id',
        'name',
    ];

    // Relasi: Genre memiliki banyak SearchHistory
    public function searchHistories()
    {
        return $this->hasMany(SearchHistory::class);
    }
}






// <?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class Genre extends Model
// {
//     //
// }
