<?php

declare(strict_types=1);

namespace App\Service\Invoice\DTO;

use App\Service\AbstractDTO;

final class InvoiceCreateDTO extends AbstractDTO
{

    // Properties
    public string $title;
    public int $currencyId;

    // Array field
    public const
        TITLE = 'title',
        CURRENCY_ID = 'currency_id';

    public function __construct(string $title, int $currencyId)
    {
        $this->title = $title;
        $this->currencyId = $currencyId;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::TITLE => ['required', 'string'],
            self::CURRENCY_ID => ['required', 'integer', 'min:1']
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self(
            $input[self::TITLE],
            $input[self::CURRENCY_ID]
        );
    }
}
