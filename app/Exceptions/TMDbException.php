<?php

namespace App\Exceptions;

use Exception;

/**
 * Exception khusus untuk error dari TMDb API
 */
class TMDbException extends Exception
{
    public function __construct(
        string $message = 'TMDb API error',
        int $code = 500
    ) {
        parent::__construct($message, $code);
    }
}
