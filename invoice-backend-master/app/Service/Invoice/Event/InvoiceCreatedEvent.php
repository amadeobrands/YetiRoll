<?php

declare(strict_types=1);

namespace App\Service\Invoice\Event;

use App\Models\Invoice;
use Illuminate\Queue\SerializesModels;

class InvoiceCreatedEvent
{
    use SerializesModels;

    public Invoice $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }
}
