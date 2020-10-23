<?php

declare(strict_types=1);

namespace App\Http\Resources\InvoiceItem;

use App\Models\InvoiceItem;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray($request)
    {
        /** @var InvoiceItem $model */
        $model = $this;

        return [
            'id' => $model->getId(),
            'name' => $model->getName(),
            'quantity' => $model->getQuantity(),
            'price_per_unit' => $model->getPricePerUnit()
        ];
    }
}
