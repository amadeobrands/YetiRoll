<?php

declare(strict_types=1);

namespace App\Http\Controllers\Session;

use App\Http\Controllers\Controller;
use App\Service\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Invalidate extends Controller
{

    private AuthService $auth;

    public function __construct(AuthService $auth)
    {
        $this->auth = $auth;
    }

    public function __invoke(Request $request)
    {
        return new JsonResponse(['dev' => 'not-implemented']);
    }
}
