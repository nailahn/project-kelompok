<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade'); // Hapus favorit jika user dihapus
            $table->integer('movie_id');           // ID film dari TMDb
            $table->string('movie_title');         // Judul film
            $table->string('poster_path')->nullable(); // Path poster
            $table->string('release_year', 4)->nullable(); // Tahun rilis
            $table->decimal('rating', 4, 1)->nullable();   // Rating film
            $table->timestamps();

            // Satu user tidak bisa simpan film yang sama dua kali
            $table->unique(['user_id', 'movie_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};




// <?php

// use Illuminate\Database\Migrations\Migration;
// use Illuminate\Database\Schema\Blueprint;
// use Illuminate\Support\Facades\Schema;

// return new class extends Migration
// {
//     /**
//      * Run the migrations.
//      */
//     public function up(): void
//     {
//         Schema::create('favorites', function (Blueprint $table) {
//             $table->id();
//             $table->timestamps();
//         });
//     }

//     /**
//      * Reverse the migrations.
//      */
//     public function down(): void
//     {
//         Schema::dropIfExists('favorites');
//     }
// };
