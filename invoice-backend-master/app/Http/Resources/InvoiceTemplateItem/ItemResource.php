<?php

declare(strict_types=1);

namespace App\Http\Resources\InvoiceTemplateItem;

use App\Models\InvoiceTemplateItem;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray($request)
    {
        /** @var InvoiceTemplateItem $model */
        $model = $this;

        return [
            'id' => $model->getId(),
            'name' => $model->getName(),
            'quantity' => $model->getQuantity(),
            'price_per_unit' => $model->getPricePerUnit()
        ];
    }
}
