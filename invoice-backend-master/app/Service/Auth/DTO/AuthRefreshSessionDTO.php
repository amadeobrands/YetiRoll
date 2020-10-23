<?php

declare(strict_types=1);

namespace App\Service\Auth\DTO;

use App\Service\AbstractDTO;

final class AuthRefreshSessionDTO extends AbstractDTO
{
    // Properties
    public string $refreshToken;

    // Array field
    public const
        REFRESH_TOKEN = 'refresh_token';

    public function __construct(string $refreshToken)
    {
        $this->refreshToken = $refreshToken;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::REFRESH_TOKEN => ['required', 'string'],
        ];
    }

    public static function instantiate(array $input): self
    {
        return new self($input[self::REFRESH_TOKEN]);
    }
}
