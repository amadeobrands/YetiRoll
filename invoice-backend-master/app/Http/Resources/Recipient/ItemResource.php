<?php

declare(strict_types=1);

namespace App\Http\Resources\Recipient;

use App\Models\Recipient;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray($request)
    {
        /** @var Recipient $model */
        $model = $this;

        return [
            'id' => $model->getId(),
            'created_at' => $model->getCreatedAt()->format(DATE_W3C),
            'updated_at' => $model->getUpdatedAt()->format(DATE_W3C),
            'name' => $model->getName(),
            'email' => $model->getEmail(),
            'address_first_line' => $model->getAddressFirstLine(),
            'address_second_line' => $model->getAddressSecondLine(),
            'country_iso_code' => $model->getCountryIsoCode()
        ];
    }
}
