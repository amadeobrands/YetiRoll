<?php

declare(strict_types=1);

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use Illuminate\Http\JsonResponse;

class Get extends Controller
{
    private AuthService $auth;

    public function __construct(AuthService $auth)
    {
        $this->auth = $auth;
    }

    public function __invoke()
    {
        return response(new Resources\User\ItemResource($this->auth->getCurrentUser()), JsonResponse::HTTP_OK);
    }
}
