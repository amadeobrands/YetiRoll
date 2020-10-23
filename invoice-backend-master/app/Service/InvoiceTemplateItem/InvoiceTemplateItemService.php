<?php


declare(strict_types=1);

namespace App\Service\InvoiceTemplateItem;

use App\DataAccess\InvoiceTemplate\InvoiceTemplateDataAccess;
use App\Exceptions\NotFoundException;
use App\Models\InvoiceTemplate;
use App\Models\InvoiceTemplateItem;
use App\Service\AbstractService;
use App\Service\InvoiceTemplateItem\DTO\InvoiceTemplateItemCreateDTO;
use App\Service\InvoiceTemplateItem\DTO\InvoiceTemplateItemDeleteDTO;
use App\Service\InvoiceTemplateItem\DTO\InvoiceTemplateItemUpdateDTO;
use App\Service\InvoiceTemplateItem\Event\InvoiceTemplateItemCreatedEvent;
use App\Service\InvoiceTemplateItem\Event\InvoiceTemplateItemUpdatedEvent;

class InvoiceTemplateItemService extends AbstractService
{
    public function create(InvoiceTemplateItemCreateDTO $dto): InvoiceTemplateItem
    {
        $passport = $dto->getPassport();
        $template = (new InvoiceTemplateDataAccess())->usePassport($passport)->getById($dto->invoiceTemplateId);

        // Create item
        $item = new InvoiceTemplateItem();
        $item
            ->setName($dto->name)
            ->setQuantity($dto->quantity)
            ->setPricePerUnit($dto->pricePerUnit);
        $item->invoice_template()->associate($template);
        $item->save();

        event(new InvoiceTemplateItemCreatedEvent($item));

        return $item;
    }

    public function update(InvoiceTemplateItemUpdateDTO $dto): InvoiceTemplateItem
    {
        $passport = $dto->getPassport();

        /** @var InvoiceTemplateItem $item */
        $item = InvoiceTemplateItem::findOrFail($dto->invoiceTemplateItemId);

        /** @var InvoiceTemplate $template */
        $template = $item->invoice_template;

        if ($template->user->id !== $passport->getUserId()) {
            throw new NotFoundException("Item not found");
        }

        // Update item information
        $item
            ->setName($dto->name ?? $item->getName())
            ->setQuantity($dto->quantity ?? $item->getQuantity())
            ->setPricePerUnit($dto->pricePerUnit ?? $item->getPricePerUnit());
        $item->save();

        event(new InvoiceTemplateItemUpdatedEvent($item));

        return $item;
    }

    public function delete(InvoiceTemplateItemDeleteDTO $dto): bool
    {
        $passport = $dto->getPassport();

        /** @var InvoiceTemplateItem $item */
        $item = InvoiceTemplateItem::findOrFail($dto->invoiceTemplateItemId);

        /** @var InvoiceTemplate $template */
        $template = $item->invoice_template;

        if ($template->user->id !== $passport->getUserId()) {
            throw new NotFoundException("Item not found");
        }

        // Delete item
        $item->delete();

        return true;
    }
}
