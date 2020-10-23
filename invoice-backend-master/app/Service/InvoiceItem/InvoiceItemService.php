<?php

declare(strict_types=1);

namespace App\Service\InvoiceItem;

use App\DataAccess\Invoice\InvoiceDataAccess;
use App\Exceptions\NotFoundException;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Service\AbstractService;
use App\Service\InvoiceItem\DTO\InvoiceItemCreateDTO;
use App\Service\InvoiceItem\DTO\InvoiceItemDeleteDTO;
use App\Service\InvoiceItem\DTO\InvoiceItemUpdateDTO;
use App\Service\InvoiceItem\Event\InvoiceItemCreatedEvent;
use App\Service\InvoiceItem\Event\InvoiceItemUpdatedEvent;

class InvoiceItemService extends AbstractService
{
    public function create(InvoiceItemCreateDTO $dto): InvoiceItem
    {
        $passport = $dto->getPassport();
        $invoice = (new InvoiceDataAccess())->usePassport($passport)->getById($dto->invoiceId);

        // Create item
        $item = new InvoiceItem();
        $item
            ->setName($dto->name)
            ->setQuantity($dto->quantity)
            ->setPricePerUnit($dto->pricePerUnit);
        $item->invoice()->associate($invoice);
        $item->save();

        event(new InvoiceItemCreatedEvent($item));

        return $item;
    }

    public function update(InvoiceItemUpdateDTO $dto): InvoiceItem
    {
        $passport = $dto->getPassport();

        /** @var InvoiceItem $item */
        $item = InvoiceItem::findOrFail($dto->invoiceItemId);

        /** @var Invoice $invoice */
        $invoice = $item->invoice;

        if ($invoice->user->id !== $passport->getUserId()) {
            throw new NotFoundException("Item not found");
        }

        // Update item information
        $item
            ->setName($dto->name ?? $item->getName())
            ->setQuantity($dto->quantity ?? $item->getQuantity())
            ->setPricePerUnit($dto->pricePerUnit ?? $item->getPricePerUnit());
        $item->save();

        event(new InvoiceItemUpdatedEvent($item));

        return $item;
    }

    public function delete(InvoiceItemDeleteDTO $dto): bool
    {
        $passport = $dto->getPassport();

        /** @var InvoiceItem $item */
        $item = InvoiceItem::findOrFail($dto->invoiceItemId);

        /** @var Invoice $invoice */
        $invoice = $item->invoice;

        if ($invoice->user->id !== $passport->getUserId()) {
            throw new NotFoundException("Item not found");
        }

        // Delete item
        $item->delete();

        return true;
    }
}
