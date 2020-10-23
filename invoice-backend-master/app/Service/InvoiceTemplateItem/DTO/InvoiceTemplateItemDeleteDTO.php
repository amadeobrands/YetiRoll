<?php

declare(strict_types=1);

namespace App\Service\InvoiceTemplateItem\DTO;

use App\Service\AbstractDTO;

final class InvoiceTemplateItemDeleteDTO extends AbstractDTO
{

    // Properties
    public int $invoiceTemplateItemId;

    // Array field
    public const
        INVOICE_TEMPLATE_ITEM_ID = 'invoice_template_item_id';

    public function __construct(int $invoiceTemplateItemId)
    {
        $this->invoiceTemplateItemId = $invoiceTemplateItemId;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::INVOICE_TEMPLATE_ITEM_ID => ['required', 'integer', 'min:1']
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self($input[self::INVOICE_TEMPLATE_ITEM_ID]);
    }
}
