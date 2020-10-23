<?php

declare(strict_types=1);

namespace App\Http\Resources\Invoice;

use App\Http\Resources\Currency;
use App\Http\Resources\InvoiceItem;
use App\Http\Resources\User;
use App\Models\Invoice;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray($request)
    {
        /** @var Invoice $model */
        $model = $this;

        $deletedAt = $model->getDeletedAt() ? $model->getDeletedAt()->format(DATE_W3C) : null;
        $finalizedAt = $model->getFinalizedAt() ? $model->getFinalizedAt()->format(DATE_W3C) : null;
        $dueDate = $model->getDueDate() ? $model->getDueDate()->format(DATE_W3C) : null;
        $items = InvoiceItem\ItemResource::collection($model->items);

        return [
            'id' => $model->getId(),
            'created_at' => $model->getCreatedAt()->format(DATE_W3C),
            'updated_at' => $model->getUpdatedAt()->format(DATE_W3C),
            'deleted_at' => $deletedAt,
            'finalized_at' => $finalizedAt,
            'user' => new User\ItemResource($model->user),
            'title' => $model->getTitle(),
            'currency' => new Currency\ItemResource($model->currency),
            'local_id' => $model->getLocalId(),
            'due_date' => $dueDate,
            'author_name' => $model->getAuthorName(),
            'author_address_first_line' => $model->getAuthorAddressFirstLine(),
            'author_address_second_line' => $model->getAuthorAddressSecondLine(),
            'author_country_iso_code' => $model->getAuthorCountryIsoCode(),
            'recipient_name' => $model->getRecipientName(),
            'recipient_address_first_line' => $model->getRecipientAddressFirstLine(),
            'recipient_address_second_line' => $model->getRecipientAddressSecondLine(),
            'recipient_country_iso_code' => $model->getRecipientCountryIsoCode(),
            'note' => $model->getNote(),
            'terms' => $model->getTerms(),
            'items' => $items
        ];
    }
}
