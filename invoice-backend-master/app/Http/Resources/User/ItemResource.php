<?php

declare(strict_types=1);

namespace App\Http\Resources\User;

use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray($request)
    {
        /** @var User $model */
        $model = $this;

        return [
            'id' => $model->getId(),
            'name' => $model->getName(),
            'email' => $model->getEmail()
        ];
    }
}
