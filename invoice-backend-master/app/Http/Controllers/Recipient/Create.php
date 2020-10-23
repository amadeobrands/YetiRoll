<?php

declare(strict_types=1);

namespace App\Http\Controllers\Recipient;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\Recipient\DTO\RecipientCreateDTO;
use App\Service\Recipient\RecipientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Create extends Controller
{

    private AuthService $auth;
    private RecipientService $recipient;

    public function __construct(AuthService $auth, RecipientService $recipient)
    {
        $this->auth = $auth;
        $this->recipient = $recipient;
    }

    public function __invoke(Request $request)
    {
        $dto = RecipientCreateDTO::build(array_merge(
            $request->all(),
            [RecipientCreateDTO::USER_ID => $this->auth->getCurrentPassport()->getUserId()]
        ))->usePassport($this->auth->getCurrentPassport());
        $recipient = $this->recipient->create($dto);

        return response(new Resources\Recipient\ItemResource($recipient), JsonResponse::HTTP_CREATED);
    }
}
