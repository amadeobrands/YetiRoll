<?php

declare(strict_types=1);

namespace App\Service\InvoiceTemplate;

use App\DataAccess\Currency\CurrencyDataAccess;
use App\DataAccess\Recipient\RecipientDataAccess;
use App\Models\InvoiceTemplate;
use App\Service\AbstractService;
use App\Service\InvoiceTemplate\DTO\InvoiceTemplateCreateDTO;
use App\Service\InvoiceTemplate\Event\InvoiceTemplateCreatedEvent;

class InvoiceTemplateService extends AbstractService
{
    public function create(InvoiceTemplateCreateDTO $dto): InvoiceTemplate
    {
        $passport = $dto->getPassport();

        // Get recipient
        $recipient = (new RecipientDataAccess())->usePassport($passport)->getById($dto->recipientId);

        // Get currency
        $currency = (new CurrencyDataAccess())->getById($dto->currencyId);

        // Create new template
        $template = new InvoiceTemplate();
        $template->setTitle($dto->title);
        $template->user()->associate($passport->getUser());
        $template->recipient()->associate($recipient);
        $template->currency()->associate($currency);
        $template->save();

        event(new InvoiceTemplateCreatedEvent($template));

        return $template;
    }
}
