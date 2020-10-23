<?php

declare(strict_types=1);

namespace App\Http\Resources\Session;

use App\Models\Session;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray($request)
    {
        /** @var Session $model */
        $model = $this;

        return [
            'generated_at' => $model->getGeneratedAt()->format(DATE_W3C),
            'token_type' => $model->getTokenType(),
            'access_token_expires_in' => $model->getAccessTokenExpiresIn(),
            'access_token' => $model->getAccessToken(),
            'refresh_token' => $model->getRefreshToken()

        ];
    }
}
