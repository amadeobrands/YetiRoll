<?php

declare(strict_types=1);

namespace App\Service\Recipient\DTO;

use App\Service\AbstractDTO;

class RecipientCreateDTO extends AbstractDTO
{

    public int $userId;
    public string $name;
    public string $addressFirstLine;
    public string $addressSecondLine;
    public string $email;
    public string $countryIsoCode;

    public const
        USER_ID = 'user_id',
        NAME = 'name',
        ADDRESS_FIRST_LINE = 'address_first_line',
        ADDRESS_SECOND_LINE = 'address_second_line',
        COUNTRY_ISO_CODE = 'country_iso_code',
        EMAIL = 'email';

    public function __construct(
        int $userId,
        string $name,
        string $addressFirstLine,
        string $addressSecondLine,
        string $countryIsoCode,
        string $email
    )
    {
        $this->userId = $userId;
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
            $input[self::COUNTRY_ISO_CODE] = mb_strtolower(self::COUNTRY_ISO_CODE);
        }

        return $input;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::USER_ID => ['required', 'integer', 'min:1'],
            self::NAME => ['required', 'string'],
            self::ADDRESS_FIRST_LINE => ['nullable', 'string'],
            self::ADDRESS_SECOND_LINE => ['nullable', 'string'],
            self::COUNTRY_ISO_CODE => ['nullable', 'string'],
            self::EMAIL => ['nullable', 'string']
        ];
    }

    protected static function instantiate(array $input): self
    {
        return new self(
            $input[self::USER_ID],
            $input[self::NAME],
            $input[self::ADDRESS_FIRST_LINE] ?? "",
            $input[self::ADDRESS_SECOND_LINE] ?? "",
            $input[self::COUNTRY_ISO_CODE] ?? "",
            $input[self::EMAIL] ?? ""
        );
    }
}
