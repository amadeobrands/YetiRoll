<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dev;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class Hello extends Controller
{
    public function __invoke()
    {
        return new JsonResponse(['status' => 'working']);
    }
}
