<?php

declare(strict_types=1);

namespace App\Service\InvoiceItem\DTO;

use App\Service\AbstractDTO;

final class InvoiceItemCreateDTO extends AbstractDTO
{
    // Properties
    public int $invoiceId;
    public string $name;
    public int $quantity;
    public float $pricePerUnit;

    // Array field
    public const
        INVOICE_ID = 'invoice_id',
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
        $this->invoiceId = $invoiceTemplateId;
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
            self::INVOICE_ID => ['required', 'integer', 'min:1'],
            self::NAME => ['required', 'string', 'min:1'],
            self::QUANTITY => ['required', 'integer', 'min:0'],
            self::PRICE_PER_UNIT => ['required', 'numeric']
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self(
            $input[self::INVOICE_ID],
            $input[self::NAME],
            $input[self::QUANTITY],
            $input[self::PRICE_PER_UNIT]
        );
    }
}
