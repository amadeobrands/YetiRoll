<?php

declare(strict_types=1);

namespace App\Service\Currency\Event;

use App\Models\Currency;
use Illuminate\Queue\SerializesModels;

class CurrencyCreatedEvent
{
    use SerializesModels;

    public Currency $currency;

    public function __construct(Currency $currency)
    {
        $this->currency = $currency;
    }
}
