<?php

declare(strict_types=1);

namespace App\Service\Auth\DTO;

use App\Service\AbstractDTO;

final class AuthCreateSessionByEmailAndPasswordDTO extends AbstractDTO
{

    // Properties
    public string $email;
    public string $password;

    // Array field
    public const
        EMAIL = 'email',
        PASSWORD = 'password';

    public function __construct(string $email, string $password)
    {
        $this->email = $email;
        $this->password = $password;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::EMAIL => ['required', 'string', 'email'],
            self::PASSWORD => ['required', 'string', 'min:5']
        ];
    }

    public static function normalize(array $input): array
    {
        $input = parent::normalize($input);

        // EMAIL
        if (isset($input[self::EMAIL])) {
            // Make sure email is lowercase
            $input[self::EMAIL] = mb_strtolower($input[self::EMAIL]);
        }

        return $input;
    }

    public static function instantiate(array $input): self
    {
        return new self($input[self::EMAIL], $input[self::PASSWORD]);
    }
}
