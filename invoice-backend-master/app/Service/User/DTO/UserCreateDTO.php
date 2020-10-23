<?php

declare(strict_types=1);

namespace App\Service\User\DTO;

use App\Service\AbstractDTO;

final class UserCreateDTO extends AbstractDTO
{

    // Properties
    public string $name;
    public string $email;
    public string $password;

    // Array field
    public const
        NAME = 'name',
        EMAIL = 'email',
        PASSWORD = 'password';

    public function __construct(string $name, string $email, string $password)
    {
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
    }

    public static function getValidationRules(array $input): ?array
    {
        return [
            self::NAME => ['required', 'string'],
            self::EMAIL => ['required', 'string', 'email'],
            self::PASSWORD => ['required', 'string', 'min:5']
        ];
    }

    public static function normalize(array $input): array
    {
        if (isset($input[self::EMAIL])) {
            $input[self::EMAIL] = mb_strtolower($input[self::EMAIL]);
        }
        return $input;
    }

    public static function instantiate(array $input): self
    {
        return new self(
            $input[self::NAME],
            $input[self::EMAIL],
            $input[self::PASSWORD]
        );
    }
}
