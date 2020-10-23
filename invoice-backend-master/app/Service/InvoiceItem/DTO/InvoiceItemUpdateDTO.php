<?php

declare(strict_types=1);

namespace App\Service\InvoiceItem\DTO;

use App\Service\AbstractDTO;

final class InvoiceItemUpdateDTO extends AbstractDTO
{

    // Properties
    public int $invoiceItemId;
    public ?string $name;
    public ?int $quantity;
    public ?float $pricePerUnit;

    // Array field
    public const
        INVOICE_ITEM_ID = 'invoice_item_id',
        NAME = 'name',
        QUANTITY = 'quantity',
        PRICE_PER_UNIT = 'price_per_unit';

    public function __construct(
        int $invoiceItemId,
        ?string $name,
        ?int $quantity,
        ?float $pricePerUnit
    )
    {
        $this->invoiceItemId = $invoiceItemId;
        $this->name = $name;
        $this->quantity = $quantity;
        $this->pricePerUnit = $pricePerUnit;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::INVOICE_ITEM_ID => ['required', 'integer', 'min:1'],
            self::NAME => ['nullable', 'string'],
            self::QUANTITY => ['nullable', 'integer', 'min:0'],
            self::PRICE_PER_UNIT => ['nullable', 'numeric']
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self(
            $input[self::INVOICE_ITEM_ID],
            $input[self::NAME],
            $input[self::QUANTITY],
            $input[self::PRICE_PER_UNIT]
        );
    }
}
