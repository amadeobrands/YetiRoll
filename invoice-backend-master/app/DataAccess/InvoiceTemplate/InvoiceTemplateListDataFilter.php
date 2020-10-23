<?php

declare(strict_types=1);

namespace App\DataAccess\InvoiceTemplate;

use App\DataAccess\AbstractListDataFilter;

class InvoiceTemplateListDataFilter extends AbstractListDataFilter
{
    public const
        RECIPIENT = 'recipient',
        CURRENCY = 'currency';

    protected function init(): void
    {
        $this->registerValueSetter(self::CURRENCY, fn($x) => $this->toArrayOfInts($x));
        $this->registerValueSetter(self::RECIPIENT, fn($x) => $this->toArrayOfInts($x));
    }
}
