<?php

declare(strict_types=1);

namespace App\Http\Controllers\Recipient\Single;

use App\Http\Controllers\Controller;
use App\Http\Resources;
use App\Service\Auth\AuthService;
use App\Service\Recipient\DTO\RecipientUpdateDTO;
use App\Service\Recipient\RecipientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Update extends Controller
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
        $dto = RecipientUpdateDTO::build(array_merge(
            $request->all(),
            [RecipientUpdateDTO::RECIPIENT_ID => (int)$recipient]
        ))->usePassport($this->auth->getCurrentPassport());
        $recipient = $this->recipient->update($dto);

        return response(new Resources\Recipient\ItemResource($recipient), JsonResponse::HTTP_OK);
    }
}
