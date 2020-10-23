<?php

declare(strict_types=1);

namespace App\Service\InvoiceItem\Event;

use App\Models\InvoiceItem;
use Illuminate\Queue\SerializesModels;

class InvoiceItemDeletedEvent
{
    use SerializesModels;

    public InvoiceItem $invoiceItem;

    public function __construct(InvoiceItem $invoiceItem)
    {
        $this->invoiceItem = $invoiceItem;
    }
}
