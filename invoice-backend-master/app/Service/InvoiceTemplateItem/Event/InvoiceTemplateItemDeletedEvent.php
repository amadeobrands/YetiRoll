<?php

declare(strict_types=1);

namespace App\Service\InvoiceTemplateItem\Event;

use App\Models\InvoiceTemplateItem;
use Illuminate\Queue\SerializesModels;

class InvoiceTemplateItemDeletedEvent
{
    use SerializesModels;

    public InvoiceTemplateItem $invoiceTemplateItem;

    public function __construct(InvoiceTemplateItem $invoiceTemplateItem)
    {
        $this->invoiceTemplateItem = $invoiceTemplateItem;
    }
}
