<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Movie Recommendation API',
    description: 'Backend API untuk platform rekomendasi film'
)]
#[OA\PathItem(path: '/')]
class OpenApiSpec
{
}
