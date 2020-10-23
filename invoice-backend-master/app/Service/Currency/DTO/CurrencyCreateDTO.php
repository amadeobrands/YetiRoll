<?php

declare(strict_types=1);

namespace App\Service\Currency\DTO;

use App\Service\AbstractDTO;

final class CurrencyCreateDTO extends AbstractDTO
{

    // Properties
    public string $iso;
    public string $name;
    public string $localName;
    public string $symbol;
    public int $unitPrecision;

    // Array field
    public const
        ISO = 'iso',
        NAME = 'name',
        LOCAL_NAME = 'local_name',
        SYMBOL = 'symbol',
        UNIT_PRECISION = 'unit_precision';

    public function __construct(
        string $iso,
        string $name,
        string $localName,
        string $symbol,
        int $unitPrecision = 2
    )
    {
        $this->iso = $iso;
        $this->name = $name;
        $this->localName = $localName;
        $this->symbol = $symbol;
        $this->unitPrecision = $unitPrecision;
    }

    public static function normalize(array $input): array
    {
        if (array_key_exists(self::ISO, $input)) {
            $input[self::ISO] = mb_strtolower($input[self::ISO]);
        }
        return $input;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::ISO => ['required', 'string', 'max:3'],
            self::NAME => ['required', 'string', 'max:255'],
            self::LOCAL_NAME => ['required', 'string', 'max:255'],
            self::SYMBOL => ['required', 'string', 'max:255'],
            self::UNIT_PRECISION => ['required', 'int', 'min:0']
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self(
            $input[self::ISO],
            $input[self::NAME],
            $input[self::LOCAL_NAME],
            $input[self::SYMBOL],
            $input[self::UNIT_PRECISION]
        );
    }
}
