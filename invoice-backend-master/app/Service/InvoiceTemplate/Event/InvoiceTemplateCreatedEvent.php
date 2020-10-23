<?php

declare(strict_types=1);

namespace App\Service\InvoiceTemplate\Event;

use App\Models\InvoiceTemplate;
use Illuminate\Queue\SerializesModels;

class InvoiceTemplateCreatedEvent
{
    use SerializesModels;

    public InvoiceTemplate $invoiceTemplate;

    public function __construct(InvoiceTemplate $invoiceTemplate)
    {
        $this->invoiceTemplate = $invoiceTemplate;
    }
}
