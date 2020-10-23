<?php

declare(strict_types=1);

namespace App\Http\Resources\Invoice;

use App\Http\Resources\Currency;
use App\Models\Invoice;
use Illuminate\Http\Resources\Json\JsonResource;

class ListItemResource extends JsonResource
{
    public function toArray($request)
    {
        /** @var Invoice $model */
        $model = $this;

        $finalizedAt = $model->getFinalizedAt() ? $model->getFinalizedAt()->format(DATE_W3C) : null;
        return [
            'id' => $model->getId(),
            'created_at' => $model->getCreatedAt()->format(DATE_W3C),
            'updated_at' => $model->getUpdatedAt()->format(DATE_W3C),
            'finalized_at' => $finalizedAt,
            'title' => $model->getTitle(),
            'currency' => new Currency\ItemResource($model->currency),
            'local_id' => $model->getLocalId(),
        ];
    }
}
