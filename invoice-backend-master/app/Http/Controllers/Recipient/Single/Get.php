<?php

declare(strict_types=1);

namespace App\Http\Controllers\Recipient\Single;

use App\DataAccess\Recipient\RecipientDataAccess;
use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\Recipient\RecipientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Get extends Controller
{

    private AuthService $auth;
    private RecipientService $recipient;

    public function __construct(AuthService $auth, RecipientService $recipient)
    {
        $this->auth = $auth;
        $this->recipient = $recipient;
    }

    public function __invoke(Request $request, $recipient)
    {
        $recipient = (new RecipientDataAccess())
            ->usePassport($this->auth->getCurrentPassport())
            ->getById((int)$recipient);
        return response(new Resources\Recipient\ItemResource($recipient), JsonResponse::HTTP_OK);
    }
}
