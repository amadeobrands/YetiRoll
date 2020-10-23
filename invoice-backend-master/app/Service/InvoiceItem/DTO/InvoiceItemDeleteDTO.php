<?php

declare(strict_types=1);

namespace App\Service\InvoiceItem\DTO;

use App\Service\AbstractDTO;

final class InvoiceItemDeleteDTO extends AbstractDTO
{

    // Properties
    public int $invoiceItemId;

    // Array field
    public const
        INVOICE_ITEM_ID = 'invoice_item_id';

    public function __construct(int $invoiceItemId)
    {
        $this->invoiceItemId = $invoiceItemId;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::INVOICE_ITEM_ID => ['required', 'integer', 'min:1']
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self($input[self::INVOICE_ITEM_ID]);
    }
}
