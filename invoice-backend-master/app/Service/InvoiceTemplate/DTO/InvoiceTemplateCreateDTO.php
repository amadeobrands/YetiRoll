<?php

declare(strict_types=1);

namespace App\Service\InvoiceTemplate\DTO;

use App\Service\AbstractDTO;

final class InvoiceTemplateCreateDTO extends AbstractDTO
{
    // Properties
    public int $recipientId;
    public int $currencyId;
    public string $title;

    // Array field
    public const
        RECIPIENT_ID = 'recipient_id',
        CURRENCY_ID = 'currency_id',
        TITLE = 'title';

    public function __construct(
        int $recipientId,
        int $currencyId,
        string $title
    )
    {
        $this->recipientId = $recipientId;
        $this->currencyId = $currencyId;
        $this->title = $title;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::RECIPIENT_ID => ['required', 'integer', 'min:1'],
            self::CURRENCY_ID => ['required', 'integer', 'min:1'],
            self::TITLE => ['required', 'string']
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self(
            $input[self::RECIPIENT_ID],
            $input[self::CURRENCY_ID],
            $input[self::TITLE]
        );
    }
}
