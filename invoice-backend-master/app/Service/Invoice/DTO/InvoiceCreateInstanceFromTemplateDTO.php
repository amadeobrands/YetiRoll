<?php

declare(strict_types=1);

namespace App\Service\Invoice\DTO;

use App\Service\AbstractDTO;

final class InvoiceCreateInstanceFromTemplateDTO extends AbstractDTO
{

    // Properties
    public int $invoiceTemplateId;

    // Array field
    public const
        INVOICE_TEMPLATE_ID = 'invoice_template_id';

    public function __construct(int $invoiceTemplateId)
    {
        $this->invoiceTemplateId = $invoiceTemplateId;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::INVOICE_TEMPLATE_ID => ['required', 'integer', 'min:1']
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self($input[self::INVOICE_TEMPLATE_ID]);
    }
}
