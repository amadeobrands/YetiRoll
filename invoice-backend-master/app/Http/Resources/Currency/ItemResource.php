<?php

declare(strict_types=1);

namespace App\Http\Resources\Currency;

use App\Models\Currency;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray($request)
    {
        /** @var Currency $model */
        $model = $this;

        return [
            'id' => $model->getId(),
            'name' => $model->getName(),
            'local_name' => $model->getLocalName(),
            'symbol' => $model->getSymbol(),
            'iso' => $model->getIso(),
            'unit_precision' => $model->getUnitPrecision()
        ];
    }
}
