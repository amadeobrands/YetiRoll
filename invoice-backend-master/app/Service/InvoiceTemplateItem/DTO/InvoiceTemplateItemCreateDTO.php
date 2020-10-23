<?php

declare(strict_types=1);

namespace App\Service\InvoiceTemplateItem\DTO;

use App\Service\AbstractDTO;

final class InvoiceTemplateItemCreateDTO extends AbstractDTO
{
    // Properties
    public int $invoiceTemplateId;
    public string $name;
    public int $quantity;
    public float $pricePerUnit;

    // Array field
    public const
        INVOICE_TEMPLATE_ID = 'invoice_template_id',
        NAME = 'name',
        QUANTITY = 'quantity',
        PRICE_PER_UNIT = 'price_per_unit';

    public function __construct(
        int $invoiceTemplateId,
        string $name,
        int $quantity,
        float $pricePerUnit
    )
    {
        $this->invoiceTemplateId = $invoiceTemplateId;
        $this->name = $name;
        $this->quantity = $quantity;
        $this->pricePerUnit = $pricePerUnit;
    }

    public static function normalize(array $input): array
    {
        if (isset($input[self::PRICE_PER_UNIT])) {
            $input[self::PRICE_PER_UNIT] = (double)$input[self::PRICE_PER_UNIT];
        }
        return $input;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::INVOICE_TEMPLATE_ID => ['required', 'integer', 'min:1'],
            self::NAME => ['required', 'string', 'min:1'],
            self::QUANTITY => ['required', 'integer', 'min:0'],
            self::PRICE_PER_UNIT => ['required', 'numeric']
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self(
            $input[self::INVOICE_TEMPLATE_ID],
            $input[self::NAME],
            $input[self::QUANTITY],
            $input[self::PRICE_PER_UNIT]
        );
    }
}
