<?php

declare(strict_types=1);

namespace App\Service\Invoice;

use App\DataAccess\Currency\CurrencyDataAccess;
use App\DataAccess\Invoice\InvoiceDataAccess;
use App\DataAccess\InvoiceTemplate\InvoiceTemplateDataAccess;
use App\Exceptions\BadInputException;
use App\Models\Currency;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\InvoiceTemplateItem;
use App\Models\Recipient;
use App\Service\AbstractService;
use App\Service\Invoice\DTO\InvoiceCreateDTO;
use App\Service\Invoice\DTO\InvoiceCreateInstanceFromTemplateDTO;
use App\Service\Invoice\DTO\InvoiceUpdateDTO;
use App\Service\Invoice\Event\InvoiceCreatedEvent;
use App\Service\Invoice\Event\InvoiceUpdatedEvent;

class InvoiceService extends AbstractService
{

    public function createInstanceFromTemplate(InvoiceCreateInstanceFromTemplateDTO $dto): Invoice
    {
        $passport = $dto->getPassport();
        $template = (new InvoiceTemplateDataAccess())->usePassport($passport)->getById($dto->invoiceTemplateId);

        /** @var Recipient $recipient */
        $recipient = $template->recipient;

        /** @var Currency $currency */
        $currency = $template->currency;

        // Create invoice
        $invoice = new Invoice();
        $invoice->user()->associate($passport->getUser());
        $invoice->currency()->associate($currency);
        $invoice
            ->setTitle("Invoice from template #" . $template->getId())
            ->setFinalizedAt(null)
            ->setAuthorName($passport->getUser()->getName())
            ->setRecipientName($recipient->getName())
            ->setRecipientAddressFirstLine($recipient->getAddressFirstLine())
            ->setRecipientAddressSecondLine($recipient->getAddressSecondLine())
            ->setRecipientCountryIsoCode($recipient->getCountryIsoCode());
        $invoice->save();

        // Create items
        foreach ($template->items as $item) {
            /** @var InvoiceTemplateItem $item */
            $invoiceItem = new InvoiceItem();
            $invoiceItem->setName($item->getName());
            $invoiceItem->setQuantity($item->getQuantity());
            $invoiceItem->setPricePerUnit($item->getPricePerUnit());
            $invoiceItem->invoice()->associate($invoice);
            $invoiceItem->save();
        }

        // Return invoice
        return $invoice;
    }

    public function update(InvoiceUpdateDTO $dto): Invoice
    {
        $passport = $dto->getPassport();

        // Fetch invoice
        $invoice = (new InvoiceDataAccess())->usePassport($passport)->getById($dto->invoiceId);

        // Ensure invoice is not finalized
        if ($invoice->getFinalizedAt() !== null) {
            throw new BadInputException("Invoice is already finalized and not editable");
        }

        // Update invoice
        $invoice
            ->setTitle($dto->title ?? $invoice->getTitle())
            ->setLocalId($dto->localId ?? $invoice->getLocalId())
            ->setDueDate($dto->dueDate ?? $invoice->getDueDate())
            ->setAuthorName($dto->authorName ?? $invoice->getAuthorName())
            ->setAuthorAddressFirstLine($dto->authorAddressFirstLine ?? $invoice->getAuthorAddressFirstLine())
            ->setAuthorAddressSecondLine($dto->authorAddressSecondLine ?? $invoice->getAuthorAddressSecondLine())
            ->setAuthorCountryIsoCode($dto->authorCountryIsoCode ?? $invoice->getAuthorCountryIsoCode())
            ->setRecipientName($dto->recipientName ?? $invoice->getRecipientName())
            ->setRecipientAddressFirstLine($dto->recipientAddressFirstLine ?? $invoice->getRecipientAddressFirstLine())
            ->setRecipientAddressSecondLine($dto->recipientAddressSecondLine ?? $invoice->getRecipientAddressSecondLine())
            ->setRecipientCountryIsoCode($dto->recipientCountryIsoCode ?? $invoice->getRecipientCountryIsoCode())
            ->setNote($dto->note ?? $invoice->getNote())
            ->setTerms($dto->terms ?? $invoice->getTerms());
        $invoice->save();

        // Fire event
        event(new InvoiceUpdatedEvent($invoice));

        return $invoice;
    }

    public function create(InvoiceCreateDTO $dto): Invoice
    {
        $passport = $dto->getPassport();

        // Fetch currency by id
        $currency = (new CurrencyDataAccess())->getById($dto->currencyId);

        // Fetch current user
        $user = $passport->getUser();

        // Create new invoice
        $invoice = new Invoice();
        $invoice
            ->setTitle($dto->title)
            ->setFinalizedAt(null)
            ->setAuthorName($user->getName());
        $invoice->user()->associate($user);
        $invoice->currency()->associate($currency);
        $invoice->save();

        // Event
        event(new InvoiceCreatedEvent($invoice));

        return $invoice;
    }
}
