<?php

declare(strict_types=1);

namespace App\Service\Recipient\DTO;

use App\Service\AbstractDTO;

final class RecipientUpdateDTO extends AbstractDTO
{
    public int $recipientId;
    public ?string $name;
    public ?string $addressFirstLine;
    public ?string $addressSecondLine;
    public ?string $email;
    public ?string $countryIsoCode;

    public const
        RECIPIENT_ID = 'recipient_id',
        NAME = 'name',
        ADDRESS_FIRST_LINE = 'address_first_line',
        ADDRESS_SECOND_LINE = 'address_second_line',
        COUNTRY_ISO_CODE = 'country_iso_code',
        EMAIL = 'email';

    public function __construct(
        int $recipientId,
        ?string $name,
        ?string $addressFirstLine,
        ?string $addressSecondLine,
        ?string $countryIsoCode,
        ?string $email
    )
    {
        $this->recipientId = $recipientId;
        $this->name = $name;
        $this->addressFirstLine = $addressFirstLine;
        $this->addressSecondLine = $addressSecondLine;
        $this->countryIsoCode = $countryIsoCode;
        $this->email = $email;
    }

    public static function normalize(array $input): array
    {
        if (isset($input[self::EMAIL])) {
            $input[self::EMAIL] = mb_strtolower($input[self::EMAIL]);
        }

        if (isset($input[self::COUNTRY_ISO_CODE])) {
            $input[self::COUNTRY_ISO_CODE] = mb_strtolower($input[self::COUNTRY_ISO_CODE]);
        }

        return $input;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::RECIPIENT_ID => ['required', 'integer', 'min:1'],
            self::NAME => ['nullable', 'string'],
            self::ADDRESS_FIRST_LINE => ['nullable', 'string'],
            self::ADDRESS_SECOND_LINE => ['nullable', 'string'],
            self::COUNTRY_ISO_CODE => ['nullable', 'string'],
            self::EMAIL => ['nullable', 'string', 'email']
        ];
    }

    protected static function instantiate(array $input): self
    {
        return new self(
            $input[self::RECIPIENT_ID],
            $input[self::NAME] ?? null,
            $input[self::ADDRESS_FIRST_LINE] ?? null,
            $input[self::ADDRESS_SECOND_LINE] ?? null,
            $input[self::COUNTRY_ISO_CODE] ?? null,
            $input[self::EMAIL] ?? null
        );
    }
}
