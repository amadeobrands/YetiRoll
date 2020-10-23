<?php

declare(strict_types=1);

namespace App\Http\Resources\InvoiceTemplate;

use App\Http\Resources;
use App\Models\InvoiceTemplate;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray($request)
    {
        /** @var InvoiceTemplate $model */
        $model = $this;

        $recipient = new Resources\Recipient\ListItemResource($model->recipient);
        $currency = new Resources\Currency\ItemResource($model->currency);
        $items = Resources\InvoiceTemplateItem\ItemResource::collection($model->items);

        return [
            'id' => $model->getId(),
            'created_at' => $model->getCreatedAt()->format(DATE_W3C),
            'updated_at' => $model->getUpdatedAt()->format(DATE_W3C),
            'title' => $model->getTitle(),
            'recipient' => $recipient,
            'currency' => $currency,
            'items' => $items
        ];
    }
}
