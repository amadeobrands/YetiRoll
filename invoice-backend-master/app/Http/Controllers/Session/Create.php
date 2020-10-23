<?php

declare(strict_types=1);

namespace App\Http\Controllers\Session;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\Auth\DTO\AuthCreateSessionByEmailAndPasswordDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Create extends Controller
{
    private AuthService $auth;

    public function __construct(AuthService $auth)
    {
        $this->auth = $auth;
    }

    public function __invoke(Request $request)
    {
        $dto = AuthCreateSessionByEmailAndPasswordDTO::build($request->all());
        $session = $this->auth->createSessionByEmailAndPassport($dto);

        return response(new Resources\Session\ItemResource($session), JsonResponse::HTTP_CREATED);
    }
}
